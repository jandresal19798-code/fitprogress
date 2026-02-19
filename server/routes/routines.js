const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateRoutine, getRoutine } = require('../controllers/routineController');

router.post('/generate', auth, generateRoutine);
router.get('/', auth, getRoutine);

module.exports = router;
