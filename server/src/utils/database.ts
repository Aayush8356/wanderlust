import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wanderlog';
    
    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 To fix this:');
    console.log('   1. Install MongoDB: brew install mongodb/brew/mongodb-community');
    console.log('   2. Start MongoDB: brew services start mongodb/brew/mongodb-community');
    console.log('   3. Or use MongoDB Atlas cloud database');
    console.log('   4. Update MONGODB_URI in .env file');
    console.log('⚠️  Server will continue without database (some features limited)');
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

export default connectDB;