const express = require('express');
const router = express.Router();
const {
  createMentorshipRequest,
  getStudentRequests,
  getAlumniIncomingRequests,
  respondMentorshipRequest,
  getAcceptedMentors,
  getActiveMentees,
  getAllRequestsAdmin,
} = require('../controllers/mentorshipController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/request', protect, authorize('student'), createMentorshipRequest);
router.get('/my-requests', protect, authorize('student'), getStudentRequests);
router.get('/my-mentors', protect, authorize('student'), getAcceptedMentors);

router.get('/incoming', protect, authorize('alumni'), getAlumniIncomingRequests);
router.put('/respond/:id', protect, authorize('alumni'), respondMentorshipRequest);
router.get('/my-mentees', protect, authorize('alumni'), getActiveMentees);

router.get('/admin/all', protect, authorize('admin'), getAllRequestsAdmin);

module.exports = router;
