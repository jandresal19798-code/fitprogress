const User = require('../models/User');

const exerciseDatabase = {
  fuerza: {
    principiante: [
      { name: 'Flexiones de pared', sets: 3, reps: '10-12', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=flexiones+de+pared+tecnica' },
      { name: 'Sentadillas asistidas', sets: 3, reps: '12-15', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155', youtubeLink: 'https://www.youtube.com/results?search_query=sentadillas+asistidas+tecnica' },
      { name: 'Peso muerto rumano con mancuernas', sets: 3, reps: '10-12', image: 'https://images.unsplash.com/photo-1567598008481-a6399db9f4e1', youtubeLink: 'https://www.youtube.com/results?search_query=peso+muerto+rumano+mancuernas+tecnica' },
      { name: 'Press de hombros sentado', sets: 3, reps: '10-12', image: 'https://images.unsplash.com/photo-1532029837066-6e53e7505e54', youtubeLink: 'https://www.youtube.com/results?search_query=press+hombros+sentado+mancuernas' },
      { name: 'Plancha', sets: 3, reps: '30 seg', image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1', youtubeLink: 'https://www.youtube.com/results?search_query=plancha+abdominal+tecnica' }
    ],
    intermedio: [
      { name: 'Flexiones', sets: 4, reps: '12-15', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=flexiones+perfectas+tecnica' },
      { name: 'Sentadillas con peso', sets: 4, reps: '10-12', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+goblet+tecnica' },
      { name: 'Peso muerto convencional', sets: 4, reps: '8-10', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', youtubeLink: 'https://www.youtube.com/results?search_query=peso+muerto+convencional+tecnica' },
      { name: 'Press de banca', sets: 4, reps: '8-12', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b', youtubeLink: 'https://www.youtube.com/results?search_query=press+banca+tecnica' },
      { name: 'Dominadas asistidas', sets: 3, reps: '8-10', image: 'https://images.unsplash.com/photo-1598971639058-21151f16f363', youtubeLink: 'https://www.youtube.com/results?search_query=dominadas+asistidas+tecnica' },
      { name: 'Plancha', sets: 4, reps: '45 seg', image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1', youtubeLink: 'https://www.youtube.com/results?search_query=plancha+abdominal+perfecta' }
    ],
    avanzado: [
      { name: 'Flexiones con peso', sets: 4, reps: '12-15', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=weighted+pushups+technique' },
      { name: 'Sentadillas con barra', sets: 5, reps: '8-10', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', youtubeLink: 'https://www.youtube.com/results?search_query=barbell+squat+technique' },
      { name: 'Peso muerto convencional', sets: 5, reps: '5-8', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', youtubeLink: 'https://www.youtube.com/results?search_query=deadlift+technique' },
      { name: 'Press de banca con barra', sets: 5, reps: '6-10', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b', youtubeLink: 'https://www.youtube.com/results?search_query=bench+press+technique' },
      { name: 'Dominadas', sets: 4, reps: '8-12', image: 'https://images.unsplash.com/photo-1598971639058-21151f16f363', youtubeLink: 'https://www.youtube.com/results?search_query=pullups+form' },
      { name: 'Press militar', sets: 4, reps: '8-10', image: 'https://images.unsplash.com/photo-1532029837066-6e53e7505e54', youtubeLink: 'https://www.youtube.com/results?search_query=overhead+press+form' },
      { name: 'Plancha', sets: 4, reps: '60 seg', image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1', youtubeLink: 'https://www.youtube.com/results?search_query=plank+hold+form' }
    ]
  },
  cardio: {
    principiante: [
      { name: 'Caminata rápida', sets: 1, reps: '20 min', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', youtubeLink: 'https://www.youtube.com/results?search_query=caminata+rapida+beneficios' },
      { name: 'Saltos de tijera', sets: 3, reps: '30 seg', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=jumping+jacks+technique' },
      { name: 'Mountain climbers', sets: 3, reps: '20 seg', image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded', youtubeLink: 'https://www.youtube.com/results?search_query=mountain+climbers+technique' },
      { name: 'Burpees simplificados', sets: 3, reps: '8-10', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=burpees+principiantes' },
      { name: 'Carrera en lugar', sets: 3, reps: '30 seg', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', youtubeLink: 'https://www.youtube.com/results?search_query=jogging+in+place' }
    ],
    intermedio: [
      { name: 'Trote ligero', sets: 1, reps: '25 min', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', youtubeLink: 'https://www.youtube.com/results?search_query=jogging+technique' },
      { name: 'Saltos de tijera', sets: 4, reps: '45 seg', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=jumping+jacks+cardio' },
      { name: 'Burpees completos', sets: 4, reps: '12-15', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=burpees+technique' },
      { name: 'Mountain climbers', sets: 4, reps: '30 seg', image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded', youtubeLink: 'https://www.youtube.com/results?search_query=mountain+climbers' },
      { name: 'Saltos al cajón', sets: 4, reps: '12 cada pierna', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155', youtubeLink: 'https://www.youtube.com/results?search_query=box+jumps+technique' },
      { name: 'Sprint en lugar', sets: 5, reps: '20 seg', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', youtubeLink: 'https://www.youtube.com/results?search_query=high+knees+technique' }
    ],
    avanzado: [
      { name: 'Carrera continua', sets: 1, reps: '30 min', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', youtubeLink: 'https://www.youtube.com/results?search_query=running+technique' },
      { name: 'HIIT: Burpees', sets: 5, reps: '45 seg', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=hiit+burpees' },
      { name: 'HIIT: Saltos de tijera', sets: 5, reps: '45 seg', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=jumping+jacks+hiit' },
      { name: 'Mountain climbers velocidad', sets: 5, reps: '40 seg', image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded', youtubeLink: 'https://www.youtube.com/results?search_query=fast+mountain+climbers' },
      { name: 'Saltos con sentadilla', sets: 5, reps: '15', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155', youtubeLink: 'https://www.youtube.com/results?search_query=squat+jumps+technique' },
      { name: 'Sprint intervals', sets: 6, reps: '30 seg', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', youtubeLink: 'https://www.youtube.com/results?search_query=sprint+intervals' }
    ]
  },
  flexibilidad: {
    principiante: [
      { name: 'Estiramiento de cuello', sets: 2, reps: '30 seg cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=neck+stretches' },
      { name: 'Estiramiento de hombros', sets: 2, reps: '30 seg cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=shoulder+stretches' },
      { name: 'Estiramiento de isquiotibiales', sets: 2, reps: '45 seg', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=hamstring+stretches' },
      { name: 'Gato-vaca', sets: 2, reps: '10 repeticiones', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=cat+cow+stretch' },
      { name: 'Pierna extendida', sets: 2, reps: '45 seg cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=leg+stretches' }
    ],
    intermedio: [
      { name: 'Postura del niño', sets: 3, reps: '60 seg', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=childs+pose' },
      { name: 'Estiramiento profundo de isquiotibiales', sets: 3, reps: '60 seg', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=deep+hamstring+stretch' },
      { name: 'Rotación de columna', sets: 3, reps: '30 seg cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=spine+rotation+stretch' },
      { name: 'Splits parciales', sets: 3, reps: '45 seg cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=partial+splits' },
      { name: 'Puente', sets: 3, reps: '30 seg', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=bridge+pose+yoga' },
      { name: 'Perro boca abajo', sets: 3, reps: '45 seg', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=downward+dog' }
    ],
    avanzado: [
      { name: 'Postura del puente completo', sets: 4, reps: '45 seg', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=full+bridge+pose' },
      { name: 'Splits completos', sets: 4, reps: '60 seg cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=full+splits' },
      { name: 'Postura del baile', sets: 4, reps: '30 seg cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=dancer+pose' },
      { name: 'King Pigeon', sets: 4, reps: '45 seg cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=king+pigeon+pose' },
      { name: 'Cobra profunda', sets: 4, reps: '45 seg', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=deep+cobra+pose' },
      { name: 'Estiramiento de splits', sets: 4, reps: '90 seg cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=splits+stretching' }
    ]
  },
  funcional: {
    principiante: [
      { name: 'Sentadillas asistidas', sets: 3, reps: '12-15', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155', youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+asistida' },
      { name: 'Zancadas frontales', sets: 3, reps: '10 cada pierna', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155', youtubeLink: 'https://www.youtube.com/results?search_query=zancadas+frontales' },
      { name: 'Plancha', sets: 3, reps: '30 seg', image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1', youtubeLink: 'https://www.youtube.com/results?search_query=plancha+abdominal' },
      { name: 'Push press ligero', sets: 3, reps: '10-12', image: 'https://images.unsplash.com/photo-1532029837066-6e53e7505e54', youtubeLink: 'https://www.youtube.com/results?search_query=push+press+technique' },
      { name: 'Bird dog', sets: 3, reps: '10 cada lado', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd', youtubeLink: 'https://www.youtube.com/results?search_query=bird+dog+exercise' }
    ],
    intermedio: [
      { name: 'Sentadillas con salto', sets: 4, reps: '12-15', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155', youtubeLink: 'https://www.youtube.com/results?search_query=jump+squats' },
      { name: 'Zancadas con salto', sets: 4, reps: '10 cada pierna', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155', youtubeLink: 'https://www.youtube.com/results?search_query=jumping+lunges' },
      { name: 'Kettlebell swing', sets: 4, reps: '15-20', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', youtubeLink: 'https://www.youtube.com/results?search_query=kettlebell+swing+technique' },
      { name: 'Press de arco', sets: 4, reps: '10-12', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff', youtubeLink: 'https://www.youtube.com/results?search_query=archer+pushups' },
      { name: 'Turkish get up', sets: 3, reps: '5 cada lado', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', youtubeLink: 'https://www.youtube.com/results?search_query=turkish+get+up+technique' },
      { name: 'Plancha dinámica', sets: 4, reps: '45 seg', image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1', youtubeLink: 'https://www.youtube.com/results?search_query=dynamic+plank' }
    ],
    avanzado: [
      { name: 'Sentadilla olimpica', sets: 5, reps: '8-10', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', youtubeLink: 'https://www.youtube.com/results?search_query=olympic+squat' },
      { name: 'Peso muerto con una mano', sets: 4, reps: '8 cada lado', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', youtubeLink: 'https://www.youtube.com/results?search_query=one+arm+deadlift' },
      { name: 'Kettlebell snatch', sets: 4, reps: '12 cada lado', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', youtubeLink: 'https://www.youtube.com/results?search_query=kettlebell+snatch' },
      { name: 'Muscle up asistido', sets: 4, reps: '6-8', image: 'https://images.unsplash.com/photo-1598971639058-21151f16f363', youtubeLink: 'https://www.youtube.com/results?search_query=assisted+muscle+up' },
      { name: 'Turkish get up con peso', sets: 4, reps: '5 cada lado', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', youtubeLink: 'https://www.youtube.com/results?search_query=heavy+turkish+get+up' },
      { name: 'Plancha con movimiento', sets: 4, reps: '60 seg', image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1', youtubeLink: 'https://www.youtube.com/results?search_query=moving+plank' },
      { name: 'Sprint con resistencia', sets: 5, reps: '30 seg', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', youtubeLink: 'https://www.youtube.com/results?search_query=resisted+sprint' }
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
