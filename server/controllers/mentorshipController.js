const MentorshipRequest = require('../models/MentorshipRequest');
const Profile = require('../models/Profile');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Send mentorship request (Student only)
// @route   POST /api/mentorship/request
// @access  Private (Student)
const createMentorshipRequest = async (req, res) => {
  try {
    const { alumniId, message } = req.body;

    if (!alumniId || !message) {
      return res.status(400).json({ message: 'Alumni ID and message are required' });
    }

    const alumniUser = await User.findById(alumniId);
    if (!alumniUser || alumniUser.role !== 'alumni') {
      return res.status(404).json({ message: 'Target alumni user not found' });
    }

    // Check if existing request
    const existing = await MentorshipRequest.findOne({
      student: req.user._id,
      alumni: alumniId,
    });

    if (existing) {
      return res.status(400).json({ message: `You have already sent a mentorship request (Status: ${existing.status})` });
    }

    const mentorshipReq = await MentorshipRequest.create({
      student: req.user._id,
      alumni: alumniId,
      message,
    });

    // Create Notification for Alumni
    await Notification.create({
      recipient: alumniId,
      sender: req.user._id,
      title: 'New Mentorship Request',
      message: `${req.user.name} sent you a mentorship request.`,
      type: 'mentorship',
      link: '/alumni/mentorship-requests',
    });

    res.status(201).json(mentorshipReq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mentorship requests for logged in student
// @route   GET /api/mentorship/my-requests
// @access  Private (Student)
const getStudentRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ student: req.user._id })
      .populate({
        path: 'alumni',
        select: 'name email avatar',
      })
      .sort({ createdAt: -1 });

    // Attach alumni profiles
    const requestsWithProfiles = await Promise.all(
      requests.map(async (r) => {
        const alumniProfile = await Profile.findOne({ user: r.alumni._id });
        return {
          ...r.toObject(),
          alumniProfile,
        };
      })
    );

    res.json(requestsWithProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mentorship requests received by logged in alumni
// @route   GET /api/mentorship/incoming
// @access  Private (Alumni)
const getAlumniIncomingRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ alumni: req.user._id })
      .populate({
        path: 'student',
        select: 'name email avatar',
      })
      .sort({ createdAt: -1 });

    const requestsWithProfiles = await Promise.all(
      requests.map(async (r) => {
        const studentProfile = await Profile.findOne({ user: r.student._id });
        return {
          ...r.toObject(),
          studentProfile,
        };
      })
    );

    res.json(requestsWithProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to mentorship request (Accept/Reject)
// @route   PUT /api/mentorship/respond/:id
// @access  Private (Alumni)
const respondMentorshipRequest = async (req, res) => {
  try {
    const { status, responseNotes } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'accepted' or 'rejected'" });
    }

    const mentorshipReq = await MentorshipRequest.findById(req.params.id);
    if (!mentorshipReq) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (mentorshipReq.alumni.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    mentorshipReq.status = status;
    if (responseNotes) mentorshipReq.responseNotes = responseNotes;
    await mentorshipReq.save();

    // Create Notification for Student
    await Notification.create({
      recipient: mentorshipReq.student,
      sender: req.user._id,
      title: `Mentorship Request ${status.toUpperCase()}`,
      message: `${req.user.name} has ${status} your mentorship request.`,
      type: 'mentorship',
      link: '/student/mentorship-requests',
    });

    res.json(mentorshipReq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's accepted mentors
// @route   GET /api/mentorship/my-mentors
// @access  Private (Student)
const getAcceptedMentors = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ student: req.user._id, status: 'accepted' })
      .populate('alumni', 'name email avatar')
      .sort({ updatedAt: -1 });

    const mentors = await Promise.all(
      requests.map(async (r) => {
        const profile = await Profile.findOne({ user: r.alumni._id });
        return {
          request: r,
          alumni: r.alumni,
          profile,
        };
      })
    );

    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get alumni's active mentees
// @route   GET /api/mentorship/my-mentees
// @access  Private (Alumni)
const getActiveMentees = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ alumni: req.user._id, status: 'accepted' })
      .populate('student', 'name email avatar')
      .sort({ updatedAt: -1 });

    const mentees = await Promise.all(
      requests.map(async (r) => {
        const profile = await Profile.findOne({ user: r.student._id });
        return {
          request: r,
          student: r.student,
          profile,
        };
      })
    );

    res.json(mentees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all mentorship requests (Admin only)
// @route   GET /api/mentorship/admin/all
// @access  Private (Admin)
const getAllRequestsAdmin = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find()
      .populate('student', 'name email')
      .populate('alumni', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMentorshipRequest,
  getStudentRequests,
  getAlumniIncomingRequests,
  respondMentorshipRequest,
  getAcceptedMentors,
  getActiveMentees,
  getAllRequestsAdmin,
};
