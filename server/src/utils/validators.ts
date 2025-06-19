import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const tripSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  destinations: Joi.array().items(Joi.string()).optional(),
  packingList: Joi.array().items(Joi.string()).optional(),
  checklist: Joi.array().items(
    Joi.object({
      item: Joi.string().required(),
      completed: Joi.boolean().default(false),
    })
  ).optional(),
  notes: Joi.string().max(1000).optional(),
});

export const destinationSchema = Joi.object({
  country: Joi.string().required(),
  city: Joi.string().required(),
  coordinates: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }).required(),
  arrivalDate: Joi.date().optional(),
  departureDate: Joi.date().optional(),
  accommodation: Joi.string().optional(),
  activities: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().max(500).optional(),
  order: Joi.number().integer().min(0).required(),
});

export const journalEntrySchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).required(),
  location: Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
    }).required(),
  }).optional(),
  photos: Joi.array().items(Joi.string()).optional(),
  date: Joi.date().required(),
  mood: Joi.string().valid('excited', 'happy', 'neutral', 'tired', 'sad').optional(),
  weather: Joi.object({
    temperature: Joi.number().required(),
    condition: Joi.string().required(),
    icon: Joi.string().required(),
  }).optional(),
});