const User = require('../models/User');

const exerciseDatabase = {
  fuerza: {
    principiante: [
      { name: 'Flexiones de pared', sets: 3, reps: '10-12' },
      { name: 'Sentencias asistidas', sets: 3, reps: '12-15' },
      { name: 'Peso muerto rumano con mancuernas', sets: 3, reps: '10-12' },
      { name: 'Press de hombros sentado', sets: 3, reps: '10-12' },
      { name: 'Plancha', sets: 3, reps: '30 seg' }
    ],
    intermedio: [
      { name: 'Flexiones', sets: 4, reps: '12-15' },
      { name: 'Sentadillas con peso', sets: 4, reps: '10-12' },
      { name: 'Peso muerto convencional', sets: 4, reps: '8-10' },
      { name: 'Press de banca', sets: 4, reps: '8-12' },
      { name: 'Dominadas asistidas', sets: 3, reps: '8-10' },
      { name: 'Plancha', sets: 4, reps: '45 seg' }
    ],
    avanzado: [
      { name: 'Flexiones con peso', sets: 4, reps: '12-15' },
      { name: 'Sentadillas con barra', sets: 5, reps: '8-10' },
      { name: 'Peso muerto convencional', sets: 5, reps: '5-8' },
      { name: 'Press de banca con barra', sets: 5, reps: '6-10' },
      { name: 'Dominadas', sets: 4, reps: '8-12' },
      { name: 'Press militar', sets: 4, reps: '8-10' },
      { name: 'Plancha', sets: 4, reps: '60 seg' }
    ]
  },
  cardio: {
    principiante: [
      { name: 'Caminata rápida', sets: 1, reps: '20 min' },
      { name: 'Saltos de tijera', sets: 3, reps: '30 seg' },
      { name: 'Mountain climbers', sets: 3, reps: '20 seg' },
      { name: 'Burpees simplificados', sets: 3, reps: '8-10' },
      { name: 'Carrera en lugar', sets: 3, reps: '30 seg' }
    ],
    intermedio: [
      { name: 'Trote ligero', sets: 1, reps: '25 min' },
      { name: 'Saltos de tijera', sets: 4, reps: '45 seg' },
      { name: 'Burpees completos', sets: 4, reps: '12-15' },
      { name: 'Mountain climbers', sets: 4, reps: '30 seg' },
      { name: 'Saltos al cajón', sets: 4, reps: '12 cada pierna' },
      { name: 'Sprint en lugar', sets: 5, reps: '20 seg' }
    ],
    avanzado: [
      { name: 'Carrera continua', sets: 1, reps: '30 min' },
      { name: 'HIIT: Burpees', sets: 5, reps: '45 seg' },
      { name: 'HIIT: Saltos de tijera', sets: 5, reps: '45 seg' },
      { name: 'Mountain climbers velocidad', sets: 5, reps: '40 seg' },
      { name: 'Saltos con sentadilla', sets: 5, reps: '15' },
      { name: 'Sprint intervals', sets: 6, reps: '30 seg' }
    ]
  },
  flexibilidad: {
    principiante: [
      { name: 'Estiramiento de cuello', sets: 2, reps: '30 seg cada lado' },
      { name: 'Estiramiento de hombros', sets: 2, reps: '30 seg cada lado' },
      { name: 'Estiramiento de isquiotibiales', sets: 2, reps: '45 seg' },
      { name: 'Gato-vaca', sets: 2, reps: '10 repeticiones' },
      { name: 'Pierna extendida', sets: 2, reps: '45 seg cada lado' }
    ],
    intermedio: [
      { name: 'Postura del niño', sets: 3, reps: '60 seg' },
      { name: 'Estiramiento profundo de isquiotibiales', sets: 3, reps: '60 seg' },
      { name: 'Rotación de columna', sets: 3, reps: '30 seg cada lado' },
      { name: 'Splits parciales', sets: 3, reps: '45 seg cada lado' },
      { name: 'Puente', sets: 3, reps: '30 seg' },
      { name: 'Perro boca abajo', sets: 3, reps: '45 seg' }
    ],
    avanzado: [
      { name: 'Postura del puente completo', sets: 4, reps: '45 seg' },
      { name: 'Splits completos', sets: 4, reps: '60 seg cada lado' },
      { name: 'Postura del baile', sets: 4, reps: '30 seg cada lado' },
      { name: 'King Pigeon', sets: 4, reps: '45 seg cada lado' },
      { name: 'Cobra profunda', sets: 4, reps: '45 seg' },
      { name: 'Estiramiento de splits', sets: 4, reps: '90 seg cada lado' }
    ]
  },
  funcional: {
    principiante: [
      { name: 'Sentadillas asistidas', sets: 3, reps: '12-15' },
      { name: 'Zancadas frontales', sets: 3, reps: '10 cada pierna' },
      { name: 'Plancha', sets: 3, reps: '30 seg' },
      { name: 'Push press ligero', sets: 3, reps: '10-12' },
      { name: 'Bird dog', sets: 3, reps: '10 cada lado' }
    ],
    intermedio: [
      { name: 'Sentadillas con salto', sets: 4, reps: '12-15' },
      { name: 'Zancadas con salto', sets: 4, reps: '10 cada pierna' },
      { name: 'Kettlebell swing', sets: 4, reps: '15-20' },
      { name: 'Press de arco', sets: 4, reps: '10-12' },
      { name: 'Turkish get up', sets: 3, reps: '5 cada lado' },
      { name: 'Plancha dinámica', sets: 4, reps: '45 seg' }
    ],
    avanzado: [
      { name: 'Sentadilla olimpica', sets: 5, reps: '8-10' },
      { name: 'Peso muerto con una mano', sets: 4, reps: '8 cada lado' },
      { name: 'Kettlebell snatch', sets: 4, reps: '12 cada lado' },
      { name: 'Muscle up asistido', sets: 4, reps: '6-8' },
      { name: 'Turkish get up con peso', sets: 4, reps: '5 cada lado' },
      { name: 'Plancha con movimiento', sets: 4, reps: '60 seg' },
      { name: 'Sprint con resistencia', sets: 5, reps: '30 seg' }
    ]
  }
};

const getIntensityByAge = (age, userIntensity) => {
  if (age > 60) return 'principiante';
  if (age >= 40 && age <= 60) {
    return userIntensity === 'avanzado' ? 'intermedio' : userIntensity;
  }
  return userIntensity;
};

exports.generateRoutine = async (req, res) => {
  try {
    const { type, intensity: userIntensity } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const intensity = getIntensityByAge(user.age, userIntensity);
    const exercises = exerciseDatabase[type]?.[intensity] || exerciseDatabase[type]?.principiante;
    
    const routine = {
      type,
      intensity,
      exercises,
      generatedAt: new Date()
    };

    user.currentRoutine = routine;
    await user.save();

    res.json(routine);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
};

exports.getRoutine = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.currentRoutine) {
      return res.status(404).json({ msg: 'No tienes una rutina asignada' });
    }
    res.json(user.currentRoutine);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};
