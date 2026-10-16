const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumni_mentorship_db';
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    console.log(`Connecting to MongoDB (URI configured: ${Boolean(process.env.MONGODB_URI)})...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000, // 15 seconds to allow cloud Atlas handshake
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed presentation demo data if the database is newly initialized
    try {
      const User = require('../models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('Database empty. Automatically seeding demo users and portal data...');
        const seedDatabase = require('../utils/seedHelper');
        await seedDatabase();
      }
    } catch (seedErr) {
      console.warn('Auto-seed check note:', seedErr.message);
    }
  } catch (error) {
    console.error(`✕ MongoDB connection failed: ${error.message}`);

    if (isProduction) {
      console.error('CRITICAL: Running in production without a valid MONGODB_URI. In-Memory fallback is disabled in production.');
      return;
    }

    console.log('Starting automatically with In-Memory MongoDB for local development demonstration...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected at: ${mongoUri}`);

      const seedDatabase = require('../utils/seedHelper');
      await seedDatabase();
    } catch (memErr) {
      console.error('Failed to start In-Memory MongoDB:', memErr.message);
    }
  }
};

module.exports = connectDB;

