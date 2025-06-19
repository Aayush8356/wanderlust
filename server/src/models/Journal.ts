import mongoose, { Document, Schema } from 'mongoose';

export interface IJournalEntry extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tripId?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  location?: {
    country: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  photos: string[];
  date: Date;
  mood?: 'excited' | 'happy' | 'neutral' | 'tired' | 'sad';
  weather?: {
    temperature: number;
    condition: string;
    icon: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
  },
  location: {
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        min: -90,
        max: 90,
      },
      lng: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
  },
  photos: [{
    type: String,
  }],
  date: {
    type: Date,
    required: true,
  },
  mood: {
    type: String,
    enum: ['excited', 'happy', 'neutral', 'tired', 'sad'],
  },
  weather: {
    temperature: {
      type: Number,
    },
    condition: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
}, {
  timestamps: true,
});

JournalEntrySchema.index({ userId: 1, date: -1 });
JournalEntrySchema.index({ userId: 1, tripId: 1 });

export default mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);