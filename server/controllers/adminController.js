const User = require('../models/User');
const Profile = require('../models/Profile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const MentorshipRequest = require('../models/MentorshipRequest');

// @desc    Get dashboard metrics & statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const totalMentorshipRequests = await MentorshipRequest.countDocuments();
    const acceptedMentorships = await MentorshipRequest.countDocuments({ status: 'accepted' });

    // Recent registrations
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalStudents,
      totalAlumni,
      totalJobs,
      activeJobs,
      totalApplications,
      totalMentorshipRequests,
      acceptedMentorships,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users filtered by role
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let query = {};
    if (role && role !== 'All') {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    const usersWithProfiles = await Promise.all(
      users.map(async (u) => {
        const profile = await Profile.findOne({ user: u._id });
        return {
          ...u.toObject(),
          profile,
        };
      })
    );

    res.json(usersWithProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user status (Activate/Deactivate)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot deactivate admin accounts' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User status changed to ${user.isActive ? 'Active' : 'Inactive'}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account and profiles
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin accounts' });
    }

    await Profile.deleteOne({ user: user._id });
    await MentorshipRequest.deleteMany({ $or: [{ student: user._id }, { alumni: user._id }] });
    await Application.deleteMany({ student: user._id });
    await Job.deleteMany({ postedBy: user._id });
    await user.deleteOne();

    res.json({ message: 'User and all related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all job postings (Admin)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email role').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all job applications (Admin)
// @route   GET /api/admin/applications
// @access  Private (Admin)
const getAllApplicationsAdmin = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  toggleUserStatus,
  deleteUser,
  getAllJobsAdmin,
  getAllApplicationsAdmin,
};
