require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const routineRoutes = require('./routes/routines');
const workoutRoutes = require('./routes/workouts');
const adminRoutes = require('./routes/admin');
const planRoutes = require('./routes/plan');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/plan', planRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ msg: 'FitProgress API running' });
  });
}

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;

const startServer = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.log('No se pudo conectar a MongoDB local/remoto. Iniciando base de datos en memoria...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Conectado a MongoDB en memoria (Volátil)');
    } catch (memErr) {
      console.error('Error fatal: No se pudo iniciar ninguna base de datos', memErr);
      process.exit(1);
    }
  }

  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
};

startServer();

module.exports = app;
