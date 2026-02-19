const User = require('../models/User');

exports.logWorkout = async (req, res) => {
  try {
    const { type, duration, notes } = req.body;
    
    const user = await User.findById(req.user.id);
    user.workouts.push({ type, duration, notes });
    await user.save();

    res.json(user.workouts);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const workouts = user.workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentWorkouts = user.workouts.filter(w => new Date(w.date) >= weekAgo);
    
    const dailyStats = {};
    recentWorkouts.forEach(w => {
      const date = new Date(w.date).toLocaleDateString('es-ES', { weekday: 'short' });
      dailyStats[date] = (dailyStats[date] || 0) + w.duration;
    });

    const totalMinutes = recentWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const totalWorkouts = recentWorkouts.length;

    res.json({
      dailyStats,
      totalMinutes,
      totalWorkouts,
      goalProgress: user.goal
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};
