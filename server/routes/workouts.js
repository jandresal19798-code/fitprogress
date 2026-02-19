const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { logWorkout, getWorkouts, getStats } = require('../controllers/workoutController');

router.post('/', auth, logWorkout);
router.get('/', auth, getWorkouts);
router.get('/stats', auth, getStats);

module.exports = router;
