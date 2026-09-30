const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getJobs);
router.get('/my-jobs', protect, authorize('alumni', 'admin'), getMyJobs);
router.get('/:id', protect, getJobById);

router.post('/', protect, authorize('alumni', 'admin'), createJob);
router.put('/:id', protect, authorize('alumni', 'admin'), updateJob);
router.delete('/:id', protect, authorize('alumni', 'admin'), deleteJob);

module.exports = router;
