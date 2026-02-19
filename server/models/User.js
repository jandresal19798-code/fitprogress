const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true }, // kg
  height: { type: Number, default: 170 }, // cm
  goal: { type: String, enum: ['perder_peso', 'ganar_musculo', 'mantener', 'resistencia'], required: true },
  experienceLevel: { type: String, enum: ['sedentario', 'principiante', 'intermedio', 'avanzado'], default: 'principiante' },
  equipment: { type: String, enum: ['sin_equipo', 'mancuernas', 'gimnasio_completo'], default: 'sin_equipo' },
  parqPassed: { type: Boolean, default: true }, // false = must see doctor first
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  sessionCount: { type: Number, default: 0 }, // for progressive overload tracking
  currentRoutine: {
    profile: { type: String }, // e.g. "normal_adulto_intermedio"
    bmi: { type: Number },
    bmiCategory: { type: String },
    trainingType: { type: String },
    warmup: [{ name: String, duration: String, description: String }],
    core: [{ name: String, sets: Number, reps: String, description: String }],
    main: [{ name: String, sets: Number, reps: String, image: String, youtubeLink: String, description: String, muscleGroup: String }],
    cooldown: [{ name: String, duration: String, description: String }],
    totalDuration: { type: Number }, // minutes
    notes: { type: String },
    generatedAt: { type: Date, default: Date.now }
  },
  workouts: [{
    date: { type: Date, default: Date.now },
    type: { type: String },
    duration: Number,
    rpe: { type: Number, min: 1, max: 10 }, // Rate of Perceived Exertion
    notes: String
  }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
