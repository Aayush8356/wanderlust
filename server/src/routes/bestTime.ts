import { Router, Request, Response } from 'express';
import BestTimeService from '../services/bestTimeService';
import { pool } from '../config/database';

const router = Router();
const bestTimeService = new BestTimeService(pool);

// GET /city/:cityName
router.get('/city/:cityName', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.params;
    const { country } = req.query;

    const bestTimeData = await bestTimeService.getBestTimeByCity(cityName, country as string);

    if (!bestTimeData) {
      return res.status(404).json({
        success: false,
        message: 'Best time data not found for this location',
        data: null
      });
    }

    return res.json({
      success: true,
      message: 'Best time data retrieved successfully',
      data: bestTimeData
    });
  } catch (error) {
    console.error('Error in /city/:cityName route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /coordinates
router.get('/coordinates', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
        data: null
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const searchRadius = radius ? parseInt(radius as string) : 100;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values',
        data: null
      });
    }

    const bestTimeData = await bestTimeService.getBestTimeByCoordinates(latitude, longitude, searchRadius);

    if (!bestTimeData) {
      return res.status(404).json({
        success: false,
        message: 'No best time data found for this location',
        data: null
      });
    }

    return res.json({
      success: true,
      message: 'Best time data retrieved successfully',
      data: bestTimeData
    });
  } catch (error) {
    console.error('Error in /coordinates route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /city/:cityId/climate
router.get('/city/:cityId/climate', async (req: Request, res: Response) => {
  try {
    const { cityId } = req.params;
    const id = parseInt(cityId);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid city ID',
        data: null
      });
    }

    const climateData = await bestTimeService.getMonthlyClimateData(id);

    return res.json({
      success: true,
      message: 'Climate data retrieved successfully',
      data: climateData
    });
  } catch (error) {
    console.error('Error in /city/:cityId/climate route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /city/:cityId/activities
router.get('/city/:cityId/activities', async (req: Request, res: Response) => {
  try {
    const { cityId } = req.params;
    const id = parseInt(cityId);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid city ID',
        data: null
      });
    }

    const activities = await bestTimeService.getCityActivities(id);

    return res.json({
      success: true,
      message: 'Activities retrieved successfully',
      data: activities
    });
  } catch (error) {
    console.error('Error in /city/:cityId/activities route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /similar
router.get('/similar', async (req: Request, res: Response) => {
  try {
    const { lat, lng, limit } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
        data: null
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const resultLimit = limit ? parseInt(limit as string) : 5;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values',
        data: null
      });
    }

    const similarDestinations = await bestTimeService.searchSimilarDestinations(latitude, longitude, resultLimit);

    return res.json({
      success: true,
      message: 'Similar destinations retrieved successfully',
      data: similarDestinations
    });
  } catch (error) {
    console.error('Error in /similar route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /destinations
router.get('/destinations', async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const pageNum = page ? parseInt(page as string) : 1;
    const limitNum = limit ? parseInt(limit as string) : 50;
    const offset = (pageNum - 1) * limitNum;

    const destinations = await bestTimeService.getAllDestinations(limitNum, offset);

    return res.json({
      success: true,
      message: 'Destinations retrieved successfully',
      data: {
        destinations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          hasMore: destinations.length === limitNum
        }
      }
    });
  } catch (error) {
    console.error('Error in /destinations route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /location
router.post('/location', async (req: Request, res: Response) => {
  try {
    const {
      cityName,
      countryName,
      latitude,
      longitude,
      bestMonths,
      bestTimeSummary,
      weatherSummary,
      touristSummary,
      idealTripDuration
    } = req.body;

    if (!cityName || !countryName || !latitude || !longitude || !bestMonths || !bestTimeSummary) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: cityName, countryName, latitude, longitude, bestMonths, bestTimeSummary',
        data: null
      });
    }

    if (!Array.isArray(bestMonths) || bestMonths.some(month => month < 1 || month > 12)) {
      return res.status(400).json({
        success: false,
        message: 'bestMonths must be an array of numbers between 1 and 12',
        data: null
      });
    }

    const cityId = await bestTimeService.addLocationBestTime({
      cityName,
      countryName,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      bestMonths,
      bestTimeSummary,
      weatherSummary,
      touristSummary,
      idealTripDuration: idealTripDuration ? parseInt(idealTripDuration) : undefined
    });

    return res.status(201).json({
      success: true,
      message: 'Location added successfully',
      data: { cityId }
    });
  } catch (error) {
    console.error('Error in POST /location route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /search
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query (q) is required',
        data: null
      });
    }

    const searchQuery = q as string;
    let bestTimeData = await bestTimeService.getBestTimeByCity(searchQuery);

    if (!bestTimeData) {
      const parts = searchQuery.split(',').map(part => part.trim());
      if (parts.length === 2) {
        const [city, country] = parts;
        bestTimeData = await bestTimeService.getBestTimeByCity(city, country);
      }
    }

    if (bestTimeData) {
      return res.json({
        success: true,
        message: 'Best time data found',
        data: bestTimeData
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No best time data found for this search query',
        data: null,
        suggestion: 'Try searching by coordinates using /coordinates endpoint'
      });
    }
  } catch (error) {
    console.error('Error in /search route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
