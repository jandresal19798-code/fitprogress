const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { toggleDay, getCalendar, getWeeklyPlan, getMonthlyPlan, getAnnualPlan } = require('../controllers/planController');

router.post('/calendar/toggle', auth, toggleDay);
router.get('/calendar', auth, getCalendar);
router.get('/weekly', auth, getWeeklyPlan);
router.get('/monthly', auth, getMonthlyPlan);
router.get('/annual', auth, getAnnualPlan);

module.exports = router;
