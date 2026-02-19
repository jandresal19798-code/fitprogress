const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateRoutine, getRoutine, saveRPE } = require('../controllers/routineController');

router.post('/generate', auth, generateRoutine);
router.get('/', auth, getRoutine);
router.post('/rpe', auth, saveRPE);

module.exports = router;
