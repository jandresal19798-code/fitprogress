const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  goal: { type: String, enum: ['perder_peso', 'ganar_musculo', 'mantener', 'resistencia'], required: true },
  currentRoutine: {
    type: { type: String },
    intensity: { type: String },
    exercises: [{ name: String, sets: Number, reps: String }]
  },
  workouts: [{
    date: { type: Date, default: Date.now },
    type: { type: String },
    duration: Number,
    notes: String
  }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
