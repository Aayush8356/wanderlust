import { Router, Request, Response } from 'express';
import mapService from '../services/mapService';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Geocode location (search for places)
router.get('/geocode', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, limit = '5' } = req.query as { query: string; limit?: string };
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required'
      });
    }

    const limitNum = parseInt(limit) || 5;
    const locations = await mapService.geocodeLocation(query, Math.min(limitNum, 10));
    
    res.json({
      success: true,
      data: {
        query,
        locations
      }
    });
  } catch (error: any) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to geocode location'
    });
  }
});

// Reverse geocode (get place name from coordinates)
router.get('/reverse-geocode', optionalAuth, async (req: Request, res: Response): Promise<any> => {
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

    const location = await mapService.reverseGeocode(longitude, latitude);
    
    res.json({
      success: true,
      data: {
        coordinates: { latitude, longitude },
        location
      }
    });
  } catch (error: any) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reverse geocode location'
    });
  }
});

// Get directions between points
router.post('/directions', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { coordinates, profile = 'driving' } = req.body as {
      coordinates: Array<[number, number]>;
      profile?: 'driving' | 'walking' | 'cycling';
    };
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 coordinate pairs are required'
      });
    }

    // Validate coordinates format
    for (const coord of coordinates) {
      if (!Array.isArray(coord) || coord.length !== 2 || 
          typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Invalid coordinate format. Expected [longitude, latitude] pairs'
        });
      }
    }

    const route = await mapService.getDirections({
      coordinates,
      profile
    });
    
    res.json({
      success: true,
      data: route
    });
  } catch (error: any) {
    console.error('Directions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get directions'
    });
  }
});

// Generate static map URL
router.get('/static-map', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      lat, 
      lon, 
      zoom = '12', 
      width = '600', 
      height = '400',
      style = 'streets-v11'
    } = req.query as {
      lat: string;
      lon: string;
      zoom?: string;
      width?: string;
      height?: string;
      style?: string;
    };
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude parameters are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const zoomLevel = parseInt(zoom) || 12;
    const mapWidth = parseInt(width) || 600;
    const mapHeight = parseInt(height) || 400;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    const mapUrl = mapService.generateStaticMapUrl(
      longitude,
      latitude,
      zoomLevel,
      mapWidth,
      mapHeight,
      style
    );
    
    res.json({
      success: true,
      data: {
        mapUrl,
        coordinates: { latitude, longitude },
        zoom: zoomLevel,
        dimensions: { width: mapWidth, height: mapHeight },
        style
      }
    });
  } catch (error: any) {
    console.error('Static map error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate static map'
    });
  }
});

// Generate static map with multiple points
router.post('/static-map-multi', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      points,
      zoom = 10,
      width = 600,
      height = 400,
      style = 'streets-v11'
    } = req.body as {
      points: Array<{ latitude: number; longitude: number; color?: string; size?: 's' | 'm' | 'l' }>;
      zoom?: number;
      width?: number;
      height?: number;
      style?: string;
    };
    
    if (!points || !Array.isArray(points) || points.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one point is required'
      });
    }

    // Validate and transform points
    const validPoints = points.map(point => {
      if (typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
        throw new Error('Invalid point coordinates');
      }
      return {
        longitude: point.longitude,
        latitude: point.latitude,
        color: point.color,
        size: point.size
      };
    });

    const mapUrl = mapService.generateStaticMapWithMultiplePoints(
      validPoints,
      zoom,
      width,
      height,
      style
    );
    
    res.json({
      success: true,
      data: {
        mapUrl,
        points: validPoints,
        zoom,
        dimensions: { width, height },
        style
      }
    });
  } catch (error: any) {
    console.error('Multi-point static map error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate multi-point static map'
    });
  }
});

export default router;