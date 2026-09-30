const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please add company name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please specify location'],
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    domain: {
      type: String,
      default: 'Software Engineering',
    },
    description: {
      type: String,
      required: [true, 'Please add job description'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      default: 'Competitive',
    },
    deadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
