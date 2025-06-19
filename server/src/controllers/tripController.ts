import { Response } from 'express';
import Trip from '../models/Trip';
import Destination from '../models/Destination';
import User from '../models/User';
import { AuthenticatedRequest, UserPayload, TripData } from '../types';

export const createTrip = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    const tripData: TripData = req.body;

    const trip = new Trip({
      ...tripData,
      userId: userPayload.userId,
    });

    await trip.save();

    await User.findByIdAndUpdate(
      userPayload.userId,
      { $push: { trips: trip._id } }
    );

    res.status(201).json({
      message: 'Trip created successfully',
      trip,
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error creating trip' });
  }
};

export const getUserTrips = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    
    const trips = await Trip.find({ userId: userPayload.userId })
      .populate('destinations')
      .sort({ createdAt: -1 });

    res.json({
      trips,
      count: trips.length,
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error fetching trips' });
  }
};

export const getTripById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    const { id } = req.params;

    const trip = await Trip.findOne({ 
      _id: id, 
      userId: userPayload.userId 
    }).populate('destinations');

    if (!trip) {
      res.status(404).json({ message: 'Trip not found' });
      return;
    }

    res.json({ trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Server error fetching trip' });
  }
};

export const updateTrip = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    const { id } = req.params;
    const updateData: Partial<TripData> = req.body;

    const trip = await Trip.findOneAndUpdate(
      { _id: id, userId: userPayload.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!trip) {
      res.status(404).json({ message: 'Trip not found' });
      return;
    }

    res.json({
      message: 'Trip updated successfully',
      trip,
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Server error updating trip' });
  }
};

export const deleteTrip = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as UserPayload;
    const { id } = req.params;

    const trip = await Trip.findOneAndDelete({ 
      _id: id, 
      userId: userPayload.userId 
    });

    if (!trip) {
      res.status(404).json({ message: 'Trip not found' });
      return;
    }

    await Destination.deleteMany({ tripId: id });

    await User.findByIdAndUpdate(
      userPayload.userId,
      { $pull: { trips: id } }
    );

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error deleting trip' });
  }
};