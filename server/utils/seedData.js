const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedDatabase = require('./seedHelper');

dotenv.config();

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumni_mentorship_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to local MongoDB for seeding...');
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error(`Error connecting for seed: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
