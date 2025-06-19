import { Response } from 'express';
import JournalEntry from '../models/Journal';
import User from '../models/User';
import { AuthenticatedRequest, UserPayload, JournalEntryData } from '../types';

export const createJournalEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    const journalData: JournalEntryData = req.body;

    const journalEntry = new JournalEntry({
      ...journalData,
      userId: userPayload.userId,
    });

    await journalEntry.save();

    await User.findByIdAndUpdate(
      userPayload.userId,
      { $push: { journalEntries: journalEntry._id } }
    );

    res.status(201).json({
      message: 'Journal entry created successfully',
      journalEntry,
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ message: 'Server error creating journal entry' });
  }
};

export const getUserJournalEntries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    const { tripId } = req.query;
    
    const filter: any = { userId: userPayload.userId };
    
    // If tripId is provided, filter by specific trip
    if (tripId) {
      filter.tripId = tripId;
    }
    
    const journalEntries = await JournalEntry.find(filter)
      .populate('tripId', 'title')
      .sort({ date: -1, createdAt: -1 });

    res.json({
      journalEntries,
      count: journalEntries.length,
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ message: 'Server error fetching journal entries' });
  }
};

export const getJournalEntryById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    const { id } = req.params;

    const journalEntry = await JournalEntry.findOne({ 
      _id: id, 
      userId: userPayload.userId 
    }).populate('tripId', 'title');

    if (!journalEntry) {
      res.status(404).json({ message: 'Journal entry not found' });
      return;
    }

    res.json({ journalEntry });
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({ message: 'Server error fetching journal entry' });
  }
};

export const updateJournalEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    const { id } = req.params;
    const updateData: Partial<JournalEntryData> = req.body;

    const journalEntry = await JournalEntry.findOneAndUpdate(
      { _id: id, userId: userPayload.userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('tripId', 'title');

    if (!journalEntry) {
      res.status(404).json({ message: 'Journal entry not found' });
      return;
    }

    res.json({
      message: 'Journal entry updated successfully',
      journalEntry,
    });
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({ message: 'Server error updating journal entry' });
  }
};

export const deleteJournalEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    const { id } = req.params;

    const journalEntry = await JournalEntry.findOneAndDelete({ 
      _id: id, 
      userId: userPayload.userId 
    });

    if (!journalEntry) {
      res.status(404).json({ message: 'Journal entry not found' });
      return;
    }

    await User.findByIdAndUpdate(
      userPayload.userId,
      { $pull: { journalEntries: id } }
    );

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ message: 'Server error deleting journal entry' });
  }
};

export const getJournalStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    
    const totalEntries = await JournalEntry.countDocuments({ userId: userPayload.userId });
    
    const entriesThisMonth = await JournalEntry.countDocuments({
      userId: userPayload.userId,
      date: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      }
    });

    const moodStats = await JournalEntry.aggregate([
      { $match: { userId: userPayload.userId, mood: { $exists: true } } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const locationStats = await JournalEntry.aggregate([
      { $match: { userId: userPayload.userId, 'location.country': { $exists: true } } },
      { $group: { _id: '$location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalEntries,
      entriesThisMonth,
      moodStats,
      locationStats,
    });
  } catch (error) {
    console.error('Get journal stats error:', error);
    res.status(500).json({ message: 'Server error fetching journal statistics' });
  }
};