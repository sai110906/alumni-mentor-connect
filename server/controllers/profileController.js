const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get user profile by user ID
// @route   GET /api/profiles/user/:userId
// @access  Private
const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'name email role avatar createdAt');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/profiles/me
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      department,
      graduationYear,
      degree,
      company,
      designation,
      location,
      bio,
      skills,
      domain,
      experienceYears,
      linkedinUrl,
      githubUrl,
      resumeUrl,
      isAvailableForMentorship,
    } = req.body;

    // Update User name if provided
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    let profile = await Profile.findOne({ user: req.user._id });

    const formattedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : profile?.skills || [];

    const profileFields = {
      department: department ?? profile?.department,
      graduationYear: graduationYear ?? profile?.graduationYear,
      degree: degree ?? profile?.degree,
      company: company ?? profile?.company,
      designation: designation ?? profile?.designation,
      location: location ?? profile?.location,
      bio: bio ?? profile?.bio,
      skills: formattedSkills,
      domain: domain ?? profile?.domain,
      experienceYears: experienceYears ?? profile?.experienceYears,
      linkedinUrl: linkedinUrl ?? profile?.linkedinUrl,
      githubUrl: githubUrl ?? profile?.githubUrl,
      resumeUrl: resumeUrl ?? profile?.resumeUrl,
      isAvailableForMentorship: isAvailableForMentorship ?? profile?.isAvailableForMentorship,
    };

    if (profile) {
      profile = await Profile.findOneAndUpdate({ user: req.user._id }, { $set: profileFields }, { new: true }).populate(
        'user',
        'name email role avatar'
      );
    } else {
      profile = await Profile.create({ user: req.user._id, ...profileFields });
      profile = await profile.populate('user', 'name email role avatar');
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search and list Alumni profiles
// @route   GET /api/profiles/alumni
// @access  Private
const getAlumniProfiles = async (req, res) => {
  try {
    const { search, domain, skill } = req.query;

    // First find users with role 'alumni'
    const alumniUsers = await User.find({ role: 'alumni', isActive: true }).select('_id name email avatar');
    const alumniUserIds = alumniUsers.map((u) => u._id);

    let query = { user: { $in: alumniUserIds } };

    if (domain && domain !== 'All') {
      query.domain = domain;
    }

    if (skill) {
      query.skills = { $regex: skill, $options: 'i' };
    }

    let profiles = await Profile.find(query).populate('user', 'name email role avatar');

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      profiles = profiles.filter(
        (p) =>
          p.user?.name.match(searchRegex) ||
          p.company.match(searchRegex) ||
          p.designation.match(searchRegex) ||
          p.domain.match(searchRegex) ||
          p.skills.some((s) => s.match(searchRegex))
      );
    }

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfileByUserId,
  updateMyProfile,
  getAlumniProfiles,
};
