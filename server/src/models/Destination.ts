import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  _id: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  country: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  arrivalDate?: Date;
  departureDate?: Date;
  accommodation?: string;
  activities: string[];
  notes?: string;
  order: number;
}

const DestinationSchema = new Schema<IDestination>({
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  arrivalDate: {
    type: Date,
  },
  departureDate: {
    type: Date,
  },
  accommodation: {
    type: String,
    trim: true,
  },
  activities: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  order: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  timestamps: true,
});

DestinationSchema.index({ tripId: 1, order: 1 });

export default mongoose.model<IDestination>('Destination', DestinationSchema);