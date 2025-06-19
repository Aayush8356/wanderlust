import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './utils/database';
import { errorHandler, notFound } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import tripRoutes from './routes/trips';
import journalRoutes from './routes/journal';
import weatherRoutes from './routes/weather';
import imageRoutes from './routes/images';
import mapRoutes from './routes/maps';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://wanderlust-lilac-five.vercel.app', 'https://your-frontend-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WanderLog API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/maps', mapRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
});