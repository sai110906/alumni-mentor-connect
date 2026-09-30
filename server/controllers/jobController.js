const Job = require('../models/Job');
const Profile = require('../models/Profile');

// @desc    Get all active jobs with search & filters
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const { search, domain, type } = req.query;

    let query = { isActive: true };

    if (domain && domain !== 'All') {
      query.domain = domain;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    let jobs = await Job.find(query)
      .populate('postedBy', 'name email avatar role')
      .sort({ createdAt: -1 });

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      jobs = jobs.filter(
        (j) =>
          j.title.match(searchRegex) ||
          j.company.match(searchRegex) ||
          j.location.match(searchRegex) ||
          j.domain.match(searchRegex) ||
          j.description.match(searchRegex) ||
          j.requirements.some((r) => r.match(searchRegex))
      );
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email avatar role');

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Attach poster profile details
    const posterProfile = await Profile.findOne({ user: job.postedBy._id });

    res.json({
      job,
      posterProfile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create job post (Alumni & Admin)
// @route   POST /api/jobs
// @access  Private (Alumni, Admin)
const createJob = async (req, res) => {
  try {
    const { title, company, location, type, domain, description, requirements, salary, deadline } = req.body;

    const reqList = typeof requirements === 'string'
      ? requirements.split(',').map((r) => r.trim()).filter(Boolean)
      : requirements || [];

    const job = await Job.create({
      postedBy: req.user._id,
      title,
      company,
      location,
      type: type || 'Full-time',
      domain: domain || 'Software Engineering',
      description,
      requirements: reqList,
      salary: salary || 'Competitive',
      deadline: deadline || null,
    });

    const populatedJob = await job.populate('postedBy', 'name email avatar role');

    res.status(201).json(populatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs posted by current Alumni
// @route   GET /api/jobs/my-jobs
// @access  Private (Alumni)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job post
// @route   PUT /api/jobs/:id
// @access  Private (Alumni / Admin)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job posting' });
    }

    const { title, company, location, type, domain, description, requirements, salary, deadline, isActive } = req.body;

    if (requirements) {
      job.requirements = typeof requirements === 'string'
        ? requirements.split(',').map((r) => r.trim()).filter(Boolean)
        : requirements;
    }

    if (title) job.title = title;
    if (company) job.company = company;
    if (location) job.location = location;
    if (type) job.type = type;
    if (domain) job.domain = domain;
    if (description) job.description = description;
    if (salary) job.salary = salary;
    if (deadline) job.deadline = deadline;
    if (typeof isActive !== 'undefined') job.isActive = isActive;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job post
// @route   DELETE /api/jobs/:id
// @access  Private (Alumni / Admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job posting' });
    }

    await job.deleteOne();
    res.json({ message: 'Job posting removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
};
