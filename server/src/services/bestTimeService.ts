import { Pool } from 'pg';

interface BestTimeData {
  cityId: number;
  cityName: string;
  countryName: string;
  latitude: number;
  longitude: number;
  bestMonths: number[];
  bestTimeSummary: string;
  weatherSummary: string;
  touristSummary: string;
  idealTripDuration: number;
  dataConfidence: number;
  notes?: string;
}

interface LocationSearchResult {
  cityId: number;
  cityName: string;
  countryName: string;
  distance: number;
  bestTimeData?: BestTimeData;
}

class BestTimeService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Get best time to visit for a specific city
   */
  async getBestTimeByCity(cityName: string, countryName?: string): Promise<BestTimeData | null> {
    try {
      let query = `
        SELECT 
          cli.city_id,
          cli.city_name,
          cli.country_name,
          cli.latitude,
          cli.longitude,
          cli.best_months,
          cli.best_time_summary,
          cli.weather_summary,
          cli.tourist_summary,
          cli.ideal_trip_duration_days,
          cli.data_confidence,
          bt.notes
        FROM complete_location_info cli
        WHERE LOWER(cli.city_name) = LOWER($1)
      `;

      const queryParams: any[] = [cityName];

      if (countryName) {
        query += ` AND LOWER(cli.country_name) = LOWER($2)`;
        queryParams.push(countryName);
      }

      query += ` LIMIT 1`;

      const result = await this.pool.query(query, queryParams);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        cityId: row.city_id,
        cityName: row.city_name,
        countryName: row.country_name,
        latitude: row.latitude,
        longitude: row.longitude,
        bestMonths: row.best_months || [],
        bestTimeSummary: row.best_time_summary || 'Year-round',
        weatherSummary: row.weather_summary || 'Weather information not available',
        touristSummary: row.tourist_summary || 'Tourism information not available',
        idealTripDuration: row.ideal_trip_duration_days || 5,
        dataConfidence: row.data_confidence || 0.5,
        notes: row.notes
      };
    } catch (error) {
      console.error('Error fetching best time data:', error);
      throw new Error('Failed to fetch best time data');
    }
  }

  /**
   * Search for best time data by coordinates (for locations not in database)
   */
  async getBestTimeByCoordinates(latitude: number, longitude: number, radius: number = 100): Promise<BestTimeData | null> {
    try {
      const query = `
        SELECT 
          cli.city_id,
          cli.city_name,
          cli.country_name,
          cli.latitude,
          cli.longitude,
          cli.best_months,
          cli.best_time_summary,
          cli.weather_summary,
          cli.tourist_summary,
          cli.ideal_trip_duration_days,
          cli.data_confidence,
          bt.notes,
          (6371 * acos(cos(radians($1)) * cos(radians(cli.latitude)) * 
           cos(radians(cli.longitude) - radians($2)) + 
           sin(radians($1)) * sin(radians(cli.latitude)))) AS distance
        FROM complete_location_info cli
        LEFT JOIN location_best_times bt ON cli.city_id = bt.city_id
        WHERE cli.best_months IS NOT NULL
        HAVING distance < $3
        ORDER BY distance ASC
        LIMIT 1
      `;

      const result = await this.pool.query(query, [latitude, longitude, radius]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        cityId: row.city_id,
        cityName: row.city_name,
        countryName: row.country_name,
        latitude: row.latitude,
        longitude: row.longitude,
        bestMonths: row.best_months || [],
        bestTimeSummary: row.best_time_summary || 'Year-round',
        weatherSummary: row.weather_summary || 'Weather information not available',
        touristSummary: row.tourist_summary || 'Tourism information not available',
        idealTripDuration: row.ideal_trip_duration_days || 5,
        dataConfidence: row.data_confidence || 0.5,
        notes: row.notes
      };
    } catch (error) {
      console.error('Error fetching best time data by coordinates:', error);
      throw new Error('Failed to fetch best time data by coordinates');
    }
  }

  /**
   * Get monthly climate data for a city
   */
  async getMonthlyClimateData(cityId: number) {
    try {
      const query = `
        SELECT 
          month,
          avg_temp_celsius,
          avg_high_celsius,
          avg_low_celsius,
          avg_rainfall_mm,
          avg_humidity_percent,
          avg_sunshine_hours,
          avg_rainy_days,
          visitor_volume_score,
          price_index,
          tourism_season
        FROM monthly_location_data
        WHERE city_id = $1
        ORDER BY month
      `;

      const result = await this.pool.query(query, [cityId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching monthly climate data:', error);
      throw new Error('Failed to fetch monthly climate data');
    }
  }

  /**
   * Get activities for a city
   */
  async getCityActivities(cityId: number) {
    try {
      const query = `
        SELECT 
          activity_name,
          activity_type,
          best_months,
          available_months,
          description
        FROM location_activities
        WHERE city_id = $1
        ORDER BY activity_type, activity_name
      `;

      const result = await this.pool.query(query, [cityId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching city activities:', error);
      throw new Error('Failed to fetch city activities');
    }
  }

  /**
   * Search similar destinations with best time data
   */
  async searchSimilarDestinations(latitude: number, longitude: number, limit: number = 5): Promise<LocationSearchResult[]> {
    try {
      const query = `
        SELECT 
          cli.city_id,
          cli.city_name,
          cli.country_name,
          cli.latitude,
          cli.longitude,
          cli.best_months,
          cli.best_time_summary,
          cli.weather_summary,
          cli.tourist_summary,
          cli.ideal_trip_duration_days,
          cli.data_confidence,
          (6371 * acos(cos(radians($1)) * cos(radians(cli.latitude)) * 
           cos(radians(cli.longitude) - radians($2)) + 
           sin(radians($1)) * sin(radians(cli.latitude)))) AS distance
        FROM complete_location_info cli
        WHERE cli.best_months IS NOT NULL
        ORDER BY distance ASC
        LIMIT $3
      `;

      const result = await this.pool.query(query, [latitude, longitude, limit]);

      return result.rows.map(row => ({
        cityId: row.city_id,
        cityName: row.city_name,
        countryName: row.country_name,
        distance: row.distance,
        bestTimeData: {
          cityId: row.city_id,
          cityName: row.city_name,
          countryName: row.country_name,
          latitude: row.latitude,
          longitude: row.longitude,
          bestMonths: row.best_months || [],
          bestTimeSummary: row.best_time_summary || 'Year-round',
          weatherSummary: row.weather_summary || 'Weather information not available',
          touristSummary: row.tourist_summary || 'Tourism information not available',
          idealTripDuration: row.ideal_trip_duration_days || 5,
          dataConfidence: row.data_confidence || 0.5
        }
      }));
    } catch (error) {
      console.error('Error searching similar destinations:', error);
      throw new Error('Failed to search similar destinations');
    }
  }

  /**
   * Add new location with best time data
   */
  async addLocationBestTime(locationData: {
    cityName: string;
    countryName: string;
    latitude: number;
    longitude: number;
    bestMonths: number[];
    bestTimeSummary: string;
    weatherSummary?: string;
    touristSummary?: string;
    idealTripDuration?: number;
  }) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get or create country
      let countryResult = await client.query(
        'SELECT id FROM countries WHERE LOWER(name) = LOWER($1)',
        [locationData.countryName]
      );

      let countryId;
      if (countryResult.rows.length === 0) {
        const insertCountry = await client.query(
          'INSERT INTO countries (name, code_alpha2, code_alpha3, continent) VALUES ($1, \'XX\', \'XXX\', \'Unknown\') RETURNING id',
          [locationData.countryName]
        );
        countryId = insertCountry.rows[0].id;
      } else {
        countryId = countryResult.rows[0].id;
      }

      // Insert city
      const cityResult = await client.query(
        `INSERT INTO cities (name, country_id, latitude, longitude, is_tourist_destination) 
         VALUES ($1, $2, $3, $4, TRUE) RETURNING id`,
        [locationData.cityName, countryId, locationData.latitude, locationData.longitude]
      );

      const cityId = cityResult.rows[0].id;

      // Insert best time data
      await client.query(
        `INSERT INTO location_best_times 
         (city_id, best_months, best_time_summary, weather_summary, tourist_summary, ideal_trip_duration_days, data_confidence)
         VALUES ($1, $2, $3, $4, $5, $6, 0.7)`,
        [
          cityId,
          locationData.bestMonths,
          locationData.bestTimeSummary,
          locationData.weatherSummary || 'Climate information not available',
          locationData.touristSummary || 'Tourism information not available',
          locationData.idealTripDuration || 5
        ]
      );

      await client.query('COMMIT');
      return cityId;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error adding location best time data:', error);
      throw new Error('Failed to add location data');
    } finally {
      client.release();
    }
  }

  /**
   * Get all available destinations with best time data
   */
  async getAllDestinations(limit: number = 100, offset: number = 0) {
    try {
      const query = `
        SELECT 
          cli.city_id,
          cli.city_name,
          cli.country_name,
          cli.latitude,
          cli.longitude,
          cli.best_time_summary,
          cli.data_confidence
        FROM complete_location_info cli
        WHERE cli.best_months IS NOT NULL
        ORDER BY cli.city_name
        LIMIT $1 OFFSET $2
      `;

      const result = await this.pool.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching all destinations:', error);
      throw new Error('Failed to fetch destinations');
    }
  }
}

export default BestTimeService;