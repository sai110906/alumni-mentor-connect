const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getStudentApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/apply', protect, authorize('student'), applyForJob);
router.get('/my-applications', protect, authorize('student'), getStudentApplications);
router.get('/job-applicants', protect, authorize('alumni', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorize('alumni', 'admin'), updateApplicationStatus);

module.exports = router;
