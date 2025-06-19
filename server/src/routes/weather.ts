import { Router, Request, Response } from 'express';
import weatherService from '../services/weatherService';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Get weather by city name
router.get('/city', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { city, country } = req.query as { city: string; country?: string };
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }

    const weather = await weatherService.getWeatherByCity(city, country);
    
    res.json({
      success: true,
      data: weather
    });
  } catch (error: any) {
    console.error('Weather by city error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch weather data'
    });
  }
});

// Get weather by coordinates
router.get('/coordinates', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { lat, lon } = req.query as { lat: string; lon: string };
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude parameters are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    const weather = await weatherService.getWeatherByCoordinates(latitude, longitude);
    
    res.json({
      success: true,
      data: weather
    });
  } catch (error: any) {
    console.error('Weather by coordinates error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch weather data'
    });
  }
});

export default router;