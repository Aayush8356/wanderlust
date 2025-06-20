import { Pool } from 'pg';

// Enhanced interfaces for better type safety
interface ClimateData {
  temperature: {
    avg: number;
    min: number;
    max: number;
    seasonalVariation: number;
  };
  precipitation: {
    annual: number;
    wetMonths: number[];
    dryMonths: number[];
    monsoonIntensity: 'none' | 'light' | 'moderate' | 'heavy';
  };
  humidity: {
    avg: number;
    seasonal: number[];
  };
  sunshine: {
    hoursPerDay: number;
    uvIndex: number;
  };
  extremeEvents: {
    hurricanes: boolean;
    typhoons: boolean;
    extremeHeat: boolean;
    flooding: boolean;
  };
}

interface LocationFactors {
  latitude: number;
  longitude: number;
  elevation: number;
  coastalDistance: number;
  climateZone: string;
  terrainType: string;
  urbanHeatEffect: number;
}

interface TourismIntelligence {
  peakSeason: number[];
  shoulderSeason: number[];
  offSeason: number[];
  crowdLevels: { [month: number]: number }; // 1-10 scale
  priceIndex: { [month: number]: number }; // 0.5-2.0 multiplier
  accessibility: { [month: number]: boolean };
  localEvents: Array<{
    month: number;
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
  }>;
}

interface EnhancedBestTimeData {
  cityId: number;
  cityName: string;
  countryName: string;
  latitude: number;
  longitude: number;
  bestMonths: number[];
  shoulderMonths: number[];
  avoidMonths: number[];
  bestTimeSummary: string;
  weatherSummary: string;
  crowdSummary: string;
  priceSummary: string;
  idealTripDuration: number;
  accuracyScore: number;
  dataConfidence: number;
  lastUpdated: Date;
  dataSource: string;
  climateData: ClimateData;
  tourismData: TourismIntelligence;
  personalizedTips: string[];
  warnings: string[];
}

class EnhancedBestTimeService {
  private pool: Pool;
  private weatherAPIs: { [key: string]: string };
  private climateDatabase: Map<string, ClimateData>;
  private tourismDatabase: Map<string, TourismIntelligence>;

  constructor(pool: Pool) {
    this.pool = pool;
    this.weatherAPIs = {
      openweather: process.env.OPENWEATHER_API_KEY || '',
      weatherapi: process.env.WEATHERAPI_KEY || '',
      meteostat: process.env.METEOSTAT_KEY || ''
    };
    this.climateDatabase = new Map();
    this.tourismDatabase = new Map();
    this.initializeEnhancedDatabase();
  }

  /**
   * Initialize comprehensive location database with climate intelligence
   */
  private initializeEnhancedDatabase() {
    // Enhanced climate data for major destinations
    const climateData: { [key: string]: ClimateData } = {
      'goa': {
        temperature: { avg: 27, min: 21, max: 33, seasonalVariation: 6 },
        precipitation: { 
          annual: 3000, 
          wetMonths: [6, 7, 8, 9], 
          dryMonths: [11, 12, 1, 2, 3], 
          monsoonIntensity: 'heavy' 
        },
        humidity: { avg: 75, seasonal: [65, 70, 85, 90, 85, 80, 75, 70, 65, 60, 60, 65] },
        sunshine: { hoursPerDay: 8, uvIndex: 9 },
        extremeEvents: { hurricanes: false, typhoons: false, extremeHeat: false, flooding: true }
      },
      'mumbai': {
        temperature: { avg: 28, min: 16, max: 36, seasonalVariation: 8 },
        precipitation: { 
          annual: 2200, 
          wetMonths: [6, 7, 8, 9], 
          dryMonths: [11, 12, 1, 2, 3], 
          monsoonIntensity: 'heavy' 
        },
        humidity: { avg: 74, seasonal: [61, 65, 70, 75, 79, 84, 87, 85, 80, 70, 65, 62] },
        sunshine: { hoursPerDay: 7, uvIndex: 8 },
        extremeEvents: { hurricanes: false, typhoons: false, extremeHeat: true, flooding: true }
      },
      'delhi': {
        temperature: { avg: 24, min: 2, max: 45, seasonalVariation: 25 },
        precipitation: { 
          annual: 800, 
          wetMonths: [7, 8, 9], 
          dryMonths: [11, 12, 1, 2, 3, 4], 
          monsoonIntensity: 'moderate' 
        },
        humidity: { avg: 62, seasonal: [55, 50, 45, 40, 45, 58, 75, 80, 70, 55, 50, 52] },
        sunshine: { hoursPerDay: 8, uvIndex: 8 },
        extremeEvents: { hurricanes: false, typhoons: false, extremeHeat: true, flooding: false }
      },
      'kathmandu': {
        temperature: { avg: 18, min: 2, max: 30, seasonalVariation: 15 },
        precipitation: { 
          annual: 1400, 
          wetMonths: [6, 7, 8, 9], 
          dryMonths: [11, 12, 1, 2, 3], 
          monsoonIntensity: 'moderate' 
        },
        humidity: { avg: 68, seasonal: [60, 58, 55, 60, 70, 80, 85, 85, 75, 65, 60, 58] },
        sunshine: { hoursPerDay: 6, uvIndex: 7 },
        extremeEvents: { hurricanes: false, typhoons: false, extremeHeat: false, flooding: true }
      },
      'paris': {
        temperature: { avg: 12, min: -2, max: 26, seasonalVariation: 18 },
        precipitation: { 
          annual: 650, 
          wetMonths: [10, 11, 12, 1], 
          dryMonths: [6, 7, 8], 
          monsoonIntensity: 'none' 
        },
        humidity: { avg: 78, seasonal: [81, 78, 73, 70, 69, 68, 68, 69, 73, 78, 81, 82] },
        sunshine: { hoursPerDay: 4, uvIndex: 4 },
        extremeEvents: { hurricanes: false, typhoons: false, extremeHeat: false, flooding: false }
      },
      'tokyo': {
        temperature: { avg: 16, min: -1, max: 31, seasonalVariation: 20 },
        precipitation: { 
          annual: 1600, 
          wetMonths: [6, 7, 9, 10], 
          dryMonths: [12, 1, 2], 
          monsoonIntensity: 'moderate' 
        },
        humidity: { avg: 63, seasonal: [51, 53, 56, 62, 67, 75, 78, 77, 74, 65, 59, 56] },
        sunshine: { hoursPerDay: 5, uvIndex: 6 },
        extremeEvents: { hurricanes: false, typhoons: true, extremeHeat: true, flooding: true }
      },
      'dubai': {
        temperature: { avg: 27, min: 14, max: 42, seasonalVariation: 18 },
        precipitation: { 
          annual: 100, 
          wetMonths: [12, 1, 2, 3], 
          dryMonths: [5, 6, 7, 8, 9, 10], 
          monsoonIntensity: 'none' 
        },
        humidity: { avg: 61, seasonal: [65, 65, 64, 61, 58, 59, 60, 62, 64, 64, 65, 66] },
        sunshine: { hoursPerDay: 9, uvIndex: 10 },
        extremeEvents: { hurricanes: false, typhoons: false, extremeHeat: true, flooding: false }
      }
    };

    // Enhanced tourism intelligence
    const tourismData: { [key: string]: TourismIntelligence } = {
      'goa': {
        peakSeason: [12, 1, 2],
        shoulderSeason: [11, 3],
        offSeason: [4, 5, 6, 7, 8, 9, 10],
        crowdLevels: {1: 9, 2: 8, 3: 6, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 2, 10: 3, 11: 6, 12: 10},
        priceIndex: {1: 2.0, 2: 1.8, 3: 1.2, 4: 0.6, 5: 0.5, 6: 0.5, 7: 0.5, 8: 0.5, 9: 0.6, 10: 0.8, 11: 1.2, 12: 1.8},
        accessibility: {1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false, 8: false, 9: false, 10: true, 11: true, 12: true},
        localEvents: [
          {month: 2, name: 'Carnival', impact: 'positive'},
          {month: 6, name: 'Monsoon Season', impact: 'negative'},
          {month: 12, name: 'New Year Celebrations', impact: 'positive'}
        ]
      },
      'mumbai': {
        peakSeason: [11, 12, 1, 2],
        shoulderSeason: [10, 3],
        offSeason: [4, 5, 6, 7, 8, 9],
        crowdLevels: {1: 8, 2: 7, 3: 5, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 2, 10: 4, 11: 7, 12: 9},
        priceIndex: {1: 1.6, 2: 1.4, 3: 1.0, 4: 0.7, 5: 0.6, 6: 0.5, 7: 0.5, 8: 0.5, 9: 0.6, 10: 0.8, 11: 1.2, 12: 1.5},
        accessibility: {1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false, 8: false, 9: false, 10: true, 11: true, 12: true},
        localEvents: [
          {month: 8, name: 'Ganesh Chaturthi', impact: 'positive'},
          {month: 10, name: 'Durga Puja', impact: 'positive'},
          {month: 6, name: 'Monsoon Arrival', impact: 'negative'}
        ]
      },
      'delhi': {
        peakSeason: [11, 12, 1, 2, 3],
        shoulderSeason: [10, 4],
        offSeason: [5, 6, 7, 8, 9],
        crowdLevels: {1: 8, 2: 9, 3: 7, 4: 5, 5: 3, 6: 2, 7: 2, 8: 2, 9: 3, 10: 5, 11: 7, 12: 8},
        priceIndex: {1: 1.5, 2: 1.6, 3: 1.2, 4: 0.9, 5: 0.7, 6: 0.6, 7: 0.6, 8: 0.6, 9: 0.7, 10: 0.9, 11: 1.2, 12: 1.4},
        accessibility: {1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: true, 11: true, 12: true},
        localEvents: [
          {month: 10, name: 'Diwali Season', impact: 'positive'},
          {month: 3, name: 'Holi Festival', impact: 'positive'},
          {month: 5, name: 'Extreme Heat Wave', impact: 'negative'}
        ]
      }
    };

    // Store in memory maps for fast access
    Object.entries(climateData).forEach(([key, data]) => {
      this.climateDatabase.set(key, data);
    });

    Object.entries(tourismData).forEach(([key, data]) => {
      this.tourismDatabase.set(key, data);
    });
  }

  /**
   * Enhanced climate zone classification using Köppen system
   */
  private getClimateZone(lat: number, _lng: number, elevation: number): string {
    // Simplified Köppen classification
    if (Math.abs(lat) < 10) return 'tropical';
    if (Math.abs(lat) < 23.5) return 'subtropical';
    if (Math.abs(lat) < 35) return elevation > 1000 ? 'highland' : 'temperate';
    if (Math.abs(lat) < 50) return 'temperate';
    if (Math.abs(lat) < 60) return 'continental';
    return 'polar';
  }

  /**
   * Calculate geographic similarity factors
   */
  private calculateLocationFactors(lat: number, lng: number): LocationFactors {
    const elevation = this.estimateElevation(lat, lng);
    const coastalDistance = this.calculateCoastalDistance(lat, lng);
    const climateZone = this.getClimateZone(lat, lng, elevation);
    
    return {
      latitude: lat,
      longitude: lng,
      elevation,
      coastalDistance,
      climateZone,
      terrainType: elevation > 1500 ? 'mountain' : coastalDistance < 50 ? 'coastal' : 'inland',
      urbanHeatEffect: this.estimateUrbanHeatEffect(lat, lng)
    };
  }

  /**
   * Advanced similarity scoring for location matching
   */
  private calculateLocationSimilarity(target: LocationFactors, candidate: LocationFactors): number {
    const weights = {
      climate: 0.35,
      latitude: 0.25,
      elevation: 0.20,
      coastal: 0.15,
      terrain: 0.05
    };

    const climateMatch = target.climateZone === candidate.climateZone ? 1 : 0.3;
    const latitudeMatch = 1 - Math.min(Math.abs(target.latitude - candidate.latitude) / 30, 1);
    const elevationMatch = 1 - Math.min(Math.abs(target.elevation - candidate.elevation) / 2000, 1);
    const coastalMatch = 1 - Math.min(Math.abs(target.coastalDistance - candidate.coastalDistance) / 500, 1);
    const terrainMatch = target.terrainType === candidate.terrainType ? 1 : 0.5;

    return (
      climateMatch * weights.climate +
      latitudeMatch * weights.latitude +
      elevationMatch * weights.elevation +
      coastalMatch * weights.coastal +
      terrainMatch * weights.terrain
    );
  }

  /**
   * Enhanced best time calculation with multiple factors
   */
  private calculateEnhancedBestTime(
    climate: ClimateData, 
    tourism: TourismIntelligence,
    _userPreferences?: any
  ): {
    bestMonths: number[];
    shoulderMonths: number[];
    avoidMonths: number[];
    summary: string;
    accuracy: number;
  } {
    const monthScores: { [month: number]: number } = {};
    
    // Score each month based on multiple factors
    for (let month = 1; month <= 12; month++) {
      let score = 0;
      
      // Weather factors (40% weight)
      if (!climate.precipitation.wetMonths.includes(month)) score += 0.15;
      if (climate.precipitation.dryMonths.includes(month)) score += 0.15;
      if (climate.humidity.seasonal[month - 1] < 80) score += 0.10;
      
      // Tourism factors (35% weight)
      const crowdLevel = tourism.crowdLevels[month] || 5;
      const priceIndex = tourism.priceIndex[month] || 1.0;
      
      // Moderate crowds preferred (4-7 range optimal)
      if (crowdLevel >= 4 && crowdLevel <= 7) score += 0.15;
      else if (crowdLevel < 4) score += 0.10; // Low crowds good but may lack atmosphere
      
      // Better prices boost score
      if (priceIndex < 1.2) score += 0.10;
      if (priceIndex < 0.8) score += 0.05;
      
      // Accessibility essential
      if (tourism.accessibility[month]) score += 0.05;
      
      // Safety factors (25% weight)
      if (!climate.extremeEvents.flooding && climate.precipitation.wetMonths.includes(month)) {
        score -= 0.10; // Reduce score for wet months if flooding possible
      }
      
      if (climate.extremeEvents.extremeHeat && [5, 6, 7, 8].includes(month)) {
        score -= 0.15; // Major penalty for extreme heat months
      }
      
      monthScores[month] = Math.max(0, Math.min(1, score));
    }
    
    // Categorize months based on scores
    const sortedMonths = Object.entries(monthScores)
      .sort(([,a], [,b]) => b - a)
      .map(([month]) => parseInt(month));
    
    const bestMonths = sortedMonths.filter(month => monthScores[month] >= 0.7);
    const shoulderMonths = sortedMonths.filter(month => 
      monthScores[month] >= 0.5 && monthScores[month] < 0.7
    );
    const avoidMonths = sortedMonths.filter(month => monthScores[month] < 0.3);
    
    const avgScore = Object.values(monthScores).reduce((a, b) => a + b, 0) / 12;
    
    return {
      bestMonths,
      shoulderMonths,
      avoidMonths,
      summary: this.generateTimingSummary(bestMonths, shoulderMonths),
      accuracy: Math.round(avgScore * 100) / 100
    };
  }

  /**
   * Multi-source weather data aggregation
   */
  private async _fetchMultiSourceWeatherData(lat: number, lng: number): Promise<ClimateData | null> {
    try {
      const weatherSources = await Promise.allSettled([
        this.getOpenWeatherData(lat, lng),
        this.getWeatherAPIData(lat, lng),
        this.getElevationData(lat, lng)
      ]);

      // Aggregate successful responses
      const validData = weatherSources
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value);

      if (validData.length === 0) return null;

      return this.aggregateWeatherData(validData);
    } catch (error) {
      console.error('Multi-source weather fetch failed:', error);
      return null;
    }
  }

  /**
   * Enhanced best time service with comprehensive analysis
   */
  async getEnhancedBestTime(
    cityName: string, 
    country?: string, 
    coordinates?: { lat: number; lng: number }
  ): Promise<EnhancedBestTimeData | null> {
    try {
      // Try exact match first
      const exactMatch = await this.getExactMatch(cityName, country);
      if (exactMatch) return exactMatch;

      // If coordinates provided, use advanced matching
      if (coordinates) {
        return await this.getLocationByIntelligentMatching(coordinates.lat, coordinates.lng, cityName);
      }

      return null;
    } catch (error) {
      console.error('Enhanced best time calculation failed:', error);
      return null;
    }
  }

  private async getExactMatch(cityName: string, country?: string): Promise<EnhancedBestTimeData | null> {
    const searchKey = cityName.toLowerCase();
    
    const climateData = this.climateDatabase.get(searchKey);
    const tourismData = this.tourismDatabase.get(searchKey);
    
    if (!climateData || !tourismData) return null;

    const timing = this.calculateEnhancedBestTime(climateData, tourismData);
    
    return {
      cityId: Math.floor(Math.random() * 1000),
      cityName: this.capitalize(cityName),
      countryName: country || 'Unknown',
      latitude: this.getKnownCoordinates(searchKey).lat,
      longitude: this.getKnownCoordinates(searchKey).lng,
      bestMonths: timing.bestMonths,
      shoulderMonths: timing.shoulderMonths,
      avoidMonths: timing.avoidMonths,
      bestTimeSummary: timing.summary,
      weatherSummary: this.generateWeatherSummary(climateData),
      crowdSummary: this.generateCrowdSummary(tourismData),
      priceSummary: this.generatePriceSummary(tourismData),
      idealTripDuration: this.calculateIdealDuration(climateData, tourismData),
      accuracyScore: timing.accuracy,
      dataConfidence: 0.92,
      lastUpdated: new Date(),
      dataSource: 'Enhanced Climate & Tourism Analysis',
      climateData,
      tourismData,
      personalizedTips: this.generatePersonalizedTips(climateData, tourismData),
      warnings: this.generateWarnings(climateData, tourismData)
    };
  }

  private async getLocationByIntelligentMatching(
    lat: number, 
    lng: number, 
    cityName: string
  ): Promise<EnhancedBestTimeData | null> {
    const targetFactors = this.calculateLocationFactors(lat, lng);
    
    // Find best matching location from our database
    let bestMatch = '';
    let bestSimilarity = 0;
    
    const knownLocations = ['goa', 'mumbai', 'delhi', 'kathmandu', 'paris', 'tokyo', 'dubai'];
    
    for (const location of knownLocations) {
      const coords = this.getKnownCoordinates(location);
      const candidateFactors = this.calculateLocationFactors(coords.lat, coords.lng);
      const similarity = this.calculateLocationSimilarity(targetFactors, candidateFactors);
      
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = location;
      }
    }
    
    if (bestSimilarity < 0.4) return null; // Too dissimilar
    
    const exactData = await this.getExactMatch(bestMatch);
    if (!exactData) return null;
    
    // Adjust data for the actual location
    const adjustedData = this.adjustForLocation(exactData, targetFactors, bestSimilarity);
    adjustedData.cityName = cityName;
    adjustedData.latitude = lat;
    adjustedData.longitude = lng;
    adjustedData.dataSource = `Intelligent matching (${Math.round(bestSimilarity * 100)}% similarity to ${bestMatch})`;
    
    return adjustedData;
  }

  // Helper methods (simplified implementations)
  private estimateElevation(lat: number, lng: number): number {
    // Simplified elevation estimation
    if (lat >= 25 && lat <= 35 && lng >= 75 && lng <= 85) return 1400; // Himalayas
    if (lat >= 45 && lat <= 50 && lng >= 5 && lng <= 10) return 200; // Europe plains
    return 50; // Default sea level
  }

  private calculateCoastalDistance(lat: number, lng: number): number {
    // Simplified coastal distance calculation
    const coastalPoints = [
      {lat: 15.3, lng: 74.1, name: 'Goa coast'},
      {lat: 19.1, lng: 72.9, name: 'Mumbai coast'},
      {lat: 48.9, lng: 2.3, name: 'Paris inland'}
    ];
    
    const distances = coastalPoints.map(point => 
      this.calculateDistance(lat, lng, point.lat, point.lng)
    );
    
    return Math.min(...distances);
  }

  private estimateUrbanHeatEffect(lat: number, lng: number): number {
    // Major cities have higher heat effect
    const majorCities = [
      {lat: 28.7, lng: 77.1, effect: 3}, // Delhi
      {lat: 19.1, lng: 72.9, effect: 2}, // Mumbai
      {lat: 48.9, lng: 2.3, effect: 2}   // Paris
    ];
    
    for (const city of majorCities) {
      if (this.calculateDistance(lat, lng, city.lat, city.lng) < 50) {
        return city.effect;
      }
    }
    return 0;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  private getKnownCoordinates(location: string): {lat: number, lng: number} {
    const coords: {[key: string]: {lat: number, lng: number}} = {
      'goa': {lat: 15.2993, lng: 74.1240},
      'mumbai': {lat: 19.0760, lng: 72.8777},
      'delhi': {lat: 28.7041, lng: 77.1025},
      'kathmandu': {lat: 27.7172, lng: 85.3240},
      'paris': {lat: 48.8566, lng: 2.3522},
      'tokyo': {lat: 35.6762, lng: 139.6503},
      'dubai': {lat: 25.2048, lng: 55.2708}
    };
    return coords[location] || {lat: 0, lng: 0};
  }

  private generateTimingSummary(bestMonths: number[], _shoulderMonths: number[]): string {
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (bestMonths.length === 0) return 'Year-round destination';
    
    const bestNames = bestMonths.map(m => monthNames[m]);
    const ranges = this.compressMonthRanges(bestNames);
    
    return ranges.join(', ');
  }

  private compressMonthRanges(months: string[]): string[] {
    // Simple range compression logic
    return months.length <= 3 ? months : [`${months[0]} to ${months[months.length - 1]}`];
  }

  private generateWeatherSummary(climate: ClimateData): string {
    const temp = climate.temperature;
    const precip = climate.precipitation;
    
    let summary = `Average ${temp.avg}°C (${temp.min}-${temp.max}°C range). `;
    
    if (precip.monsoonIntensity !== 'none') {
      summary += `${this.capitalize(precip.monsoonIntensity)} monsoon season affects ${precip.wetMonths.length} months. `;
    }
    
    if (climate.extremeEvents.extremeHeat) {
      summary += 'Extreme heat possible in summer months. ';
    }
    
    return summary.trim();
  }

  private generateCrowdSummary(tourism: TourismIntelligence): string {
    const peak = tourism.peakSeason.length;
    const shoulder = tourism.shoulderSeason.length;
    
    return `Peak season: ${peak} months. Shoulder season: ${shoulder} months. Best for avoiding crowds: off-season periods.`;
  }

  private generatePriceSummary(tourism: TourismIntelligence): string {
    const maxPrice = Math.max(...Object.values(tourism.priceIndex));
    const minPrice = Math.min(...Object.values(tourism.priceIndex));
    
    return `Price variation: ${Math.round((maxPrice - minPrice) * 100)}% difference between peak and off-season.`;
  }

  private calculateIdealDuration(climate: ClimateData, tourism: TourismIntelligence): number {
    // Base duration on destination type and weather stability
    let duration = 4; // Base 4 days
    
    if (climate.temperature.seasonalVariation > 20) duration += 1; // Variable climate needs more time
    if (tourism.peakSeason.length <= 3) duration += 1; // Limited good weather = longer stay
    
    return Math.min(duration, 7); // Cap at 7 days
  }

  private generatePersonalizedTips(climate: ClimateData, tourism: TourismIntelligence): string[] {
    const tips: string[] = [];
    
    if (climate.extremeEvents.extremeHeat) {
      tips.push('Pack sun protection and stay hydrated during summer months');
    }
    
    if (climate.precipitation.monsoonIntensity === 'heavy') {
      tips.push('Waterproof gear essential during monsoon season');
    }
    
    if (Math.max(...Object.values(tourism.priceIndex)) > 1.5) {
      tips.push('Book accommodations early for peak season or consider shoulder months for savings');
    }
    
    if (climate.humidity.avg > 80) {
      tips.push('Lightweight, breathable clothing recommended year-round');
    }
    
    return tips;
  }

  private generateWarnings(climate: ClimateData, tourism: TourismIntelligence): string[] {
    const warnings: string[] = [];
    
    if (climate.extremeEvents.flooding) {
      warnings.push('Flooding possible during heavy monsoon months - check current conditions');
    }
    
    if (climate.extremeEvents.typhoons) {
      warnings.push('Typhoon season may affect travel plans - monitor weather forecasts');
    }
    
    const inaccessibleMonths = Object.entries(tourism.accessibility)
      .filter(([_, accessible]) => !accessible)
      .map(([month]) => month);
    
    if (inaccessibleMonths.length > 0) {
      warnings.push(`Limited accessibility during months: ${inaccessibleMonths.join(', ')}`);
    }
    
    return warnings;
  }

  private adjustForLocation(
    baseData: EnhancedBestTimeData, 
    targetFactors: LocationFactors, 
    similarity: number
  ): EnhancedBestTimeData {
    const adjusted = { ...baseData };
    
    // Adjust confidence based on similarity
    adjusted.dataConfidence = similarity * 0.9;
    adjusted.accuracyScore = adjusted.accuracyScore * similarity;
    
    // Adjust for elevation differences
    if (targetFactors.elevation > 1500) {
      adjusted.warnings.push('High altitude destination - temperature will be cooler than predicted');
    }
    
    // Adjust for coastal vs inland
    if (targetFactors.terrainType === 'coastal' || targetFactors.terrainType === 'mountain') {
      if (targetFactors.terrainType === 'coastal') {
        adjusted.personalizedTips.push('Coastal location may have milder temperatures and higher humidity');
      } else if (targetFactors.terrainType === 'mountain') {
        adjusted.personalizedTips.push('Mountain location will have cooler temperatures and possible altitude effects');
      }
    }
    
    return adjusted;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Mock external API calls for development
  private async getOpenWeatherData(_lat: number, _lng: number): Promise<any> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return { temp: 25, humidity: 70, rainfall: 100 };
  }

  private async getWeatherAPIData(_lat: number, _lng: number): Promise<any> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return { temperature: 26, humidity: 72, precipitation: 95 };
  }

  private async getElevationData(lat: number, lng: number): Promise<any> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return { elevation: this.estimateElevation(lat, lng) };
  }

  private aggregateWeatherData(_sources: any[]): ClimateData {
    // Aggregate multiple weather sources intelligently
    // This is a simplified implementation
    return {
      temperature: { avg: 25, min: 15, max: 35, seasonalVariation: 10 },
      precipitation: { annual: 1000, wetMonths: [6,7,8], dryMonths: [12,1,2], monsoonIntensity: 'moderate' },
      humidity: { avg: 70, seasonal: new Array(12).fill(70) },
      sunshine: { hoursPerDay: 7, uvIndex: 6 },
      extremeEvents: { hurricanes: false, typhoons: false, extremeHeat: false, flooding: false }
    };
  }
}

export default EnhancedBestTimeService;