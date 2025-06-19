import express from 'express';
import { 
  createTrip, 
  getUserTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip 
} from '../controllers/tripController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { tripSchema } from '../utils/validators';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validateRequest(tripSchema), createTrip);
router.get('/', getUserTrips);
router.get('/:id', getTripById);
router.put('/:id', validateRequest(tripSchema), updateTrip);
router.delete('/:id', deleteTrip);

export default router;