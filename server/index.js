require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const routineRoutes = require('./routes/routines');
const workoutRoutes = require('./routes/workouts');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/workouts', workoutRoutes);

app.get('/', (req, res) => {
  res.json({ msg: 'FitProgress API running' });
});

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
  });

module.exports = app;
