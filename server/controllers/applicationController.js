const Application = require('../models/Application');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const Notification = require('../models/Notification');

// @desc    Apply for a job (Student)
// @route   POST /api/applications/apply
// @access  Private (Student)
const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job posting is inactive or not found' });
    }

    const existingApp = await Application.findOne({
      job: jobId,
      student: req.user._id,
    });

    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this position' });
    }

    // Get student profile resumeUrl if not provided
    let finalResume = resumeUrl;
    if (!finalResume) {
      const studentProfile = await Profile.findOne({ user: req.user._id });
      finalResume = studentProfile?.resumeUrl || 'https://drive.google.com/demo-resume.pdf';
    }

    const application = await Application.create({
      job: jobId,
      student: req.user._id,
      resumeUrl: finalResume,
      coverLetter: coverLetter || '',
    });

    // Notify job poster (Alumni)
    await Notification.create({
      recipient: job.postedBy,
      sender: req.user._id,
      title: 'New Job Application',
      message: `${req.user.name} applied for "${job.title}" at ${job.company}.`,
      type: 'application',
      link: '/alumni/applicants',
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's submitted applications
// @route   GET /api/applications/my-applications
// @access  Private (Student)
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'job',
        populate: {
          path: 'postedBy',
          select: 'name email company',
        },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for Alumni's posted jobs
// @route   GET /api/applications/job-applicants
// @access  Private (Alumni / Admin)
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.query;

    let jobIds = [];
    if (jobId) {
      jobIds = [jobId];
    } else {
      // Find all jobs posted by current Alumni
      const alumniJobs = await Job.find({ postedBy: req.user._id }).select('_id');
      jobIds = alumniJobs.map((j) => j._id);
    }

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company type location')
      .populate('student', 'name email avatar')
      .sort({ createdAt: -1 });

    const appsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const studentProfile = await Profile.findOne({ user: app.student._id });
        return {
          ...app.toObject(),
          studentProfile,
        };
      })
    );

    res.json(appsWithProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Alumni / Admin)
// @route   PUT /api/applications/:id/status
// @access  Private (Alumni / Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['applied', 'under_review', 'interviewing', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    // Notify Student
    await Notification.create({
      recipient: application.student,
      sender: req.user._id,
      title: 'Application Status Updated',
      message: `Your application for "${application.job?.title}" status updated to: ${status.toUpperCase().replace('_', ' ')}.`,
      type: 'application',
      link: '/student/my-applications',
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForJob,
  getStudentApplications,
  getJobApplicants,
  updateApplicationStatus,
};
