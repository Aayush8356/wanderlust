import mongoose, { Document, Schema } from 'mongoose';

export interface ITrip extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  destinations: mongoose.Types.ObjectId[];
  packingList: string[];
  checklist: { item: string; completed: boolean }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  destinations: [{
    type: Schema.Types.ObjectId,
    ref: 'Destination',
  }],
  packingList: [{
    type: String,
    trim: true,
  }],
  checklist: [{
    item: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
}, {
  timestamps: true,
});

TripSchema.index({ userId: 1, startDate: -1 });
TripSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ITrip>('Trip', TripSchema);