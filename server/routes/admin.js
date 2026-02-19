const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { getAllUsers, toggleBlockUser, resetUserPassword } = require('../controllers/adminController');

// Middleware to check admin role
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ msg: 'Error de servidor' });
    }
};

router.get('/users', auth, isAdmin, getAllUsers);
router.put('/users/:id/block', auth, isAdmin, toggleBlockUser);
router.put('/users/:id/reset-password', auth, isAdmin, resetUserPassword);

module.exports = router;
