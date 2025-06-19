import { Router, Request, Response } from 'express';
import imageService from '../services/imageService';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Search images
router.get('/search', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, page = '1', per_page = '10' } = req.query as {
      query: string;
      page?: string;
      per_page?: string;
    };
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter is required'
      });
    }

    const pageNum = parseInt(page) || 1;
    const perPage = parseInt(per_page) || 10;

    // Limit per_page to prevent abuse
    const limitedPerPage = Math.min(perPage, 30);

    const result = await imageService.searchImages(query, pageNum, limitedPerPage);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Image search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search images'
    });
  }
});

// Get destination images with optional limit parameter
router.get('/destination/:destination', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { destination } = req.params;
    const { limit } = req.query as { limit?: string };
    
    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Destination parameter is required'
      });
    }

    const imageLimit = limit ? Math.min(parseInt(limit) || 6, 30) : 6; // Default 6, max 30
    const images = await imageService.getDestinationImages(destination, imageLimit);
    
    res.json({
      success: true,
      data: {
        destination,
        images,
        requestedLimit: imageLimit,
        actualCount: images.length
      }
    });
  } catch (error: any) {
    console.error('Destination images error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch destination images'
    });
  }
});

// Enhanced destination search with pagination and strategy info
router.get('/destination/:destination/search', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { destination } = req.params;
    const { page = '1', per_page = '10' } = req.query as {
      page?: string;
      per_page?: string;
    };
    
    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Destination parameter is required'
      });
    }

    const pageNum = parseInt(page) || 1;
    const perPage = parseInt(per_page) || 10;
    const limitedPerPage = Math.min(perPage, 30);

    const result = await imageService.searchDestinationImages(destination, pageNum, limitedPerPage);
    
    res.json({
      success: true,
      data: {
        destination,
        ...result
      }
    });
  } catch (error: any) {
    console.error('Enhanced destination search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search destination images'
    });
  }
});

// Get random photo
router.get('/random', optionalAuth, async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req.query as { query?: string };
    
    const image = await imageService.getRandomPhoto(query);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'No random image found'
      });
    }
    
    res.json({
      success: true,
      data: image
    });
  } catch (error: any) {
    console.error('Random image error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch random image'
    });
  }
});

export default router;