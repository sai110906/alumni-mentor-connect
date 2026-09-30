const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumni_mentorship_db';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}).`);
    console.log('Starting automatically with In-Memory MongoDB for zero-config demonstration...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected at: ${mongoUri}`);

      // Auto-run database seed for instant demo setup
      const seedDatabase = require('../utils/seedHelper');
      await seedDatabase();
    } catch (memErr) {
      console.error('Failed to start In-Memory MongoDB:', memErr.message);
    }
  }
};

module.exports = connectDB;
