const express = require('express');
const router = express.Router();
const { getProfileByUserId, updateMyProfile, getAlumniProfiles } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/alumni', protect, getAlumniProfiles);
router.get('/user/:userId', protect, getProfileByUserId);
router.put('/me', protect, updateMyProfile);

module.exports = router;
