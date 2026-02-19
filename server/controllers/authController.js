const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, age, weight, goal } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'El usuario ya existe' });

    const user = new User({ name, email, password, age, weight, goal });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, age, weight, goal } 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = generateToken(user._id);
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, age: user.age, weight: user.weight, goal: user.goal } 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { age, weight, goal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { age, weight, goal },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};
