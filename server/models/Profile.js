const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
    },
    graduationYear: {
      type: Number,
    },
    degree: {
      type: String,
      default: 'B.Tech',
    },
    // Alumni specific fields
    company: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'San Francisco, CA / Remote',
    },
    bio: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    domain: {
      type: String,
      default: 'Software Engineering',
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    isAvailableForMentorship: {
      type: Boolean,
      default: true,
    },
    maxMentees: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
