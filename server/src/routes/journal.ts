import express from 'express';
import { 
  createJournalEntry, 
  getUserJournalEntries, 
  getJournalEntryById, 
  updateJournalEntry, 
  deleteJournalEntry,
  getJournalStats
} from '../controllers/journalController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { journalEntrySchema } from '../utils/validators';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validateRequest(journalEntrySchema), createJournalEntry);
router.get('/', getUserJournalEntries);
router.get('/stats', getJournalStats);
router.get('/:id', getJournalEntryById);
router.put('/:id', validateRequest(journalEntrySchema), updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

export default router;