const User = require('../models/User');

// ========== SCIENTIFIC EXERCISE DATABASE ==========
// Organized by: Phase > Profile > Equipment
// Each exercise has: name, sets, reps, duration, image, youtubeLink, description, muscleGroup

const WARMUP_EXERCISES = [
  { name: 'Rotaciones de cuello', duration: '30 seg c/lado', description: 'Gira el cuello suavemente en ambas direcciones para liberar tensión cervical.' },
  { name: 'Círculos de hombros', duration: '30 seg', description: 'Rota los hombros hacia adelante y hacia atrás, ampliando el rango de movimiento.' },
  { name: 'Movilidad de cadera (círculos)', duration: '30 seg c/lado', description: 'De pie, traza círculos amplios con la cadera para lubricar la articulación.' },
  { name: 'Sentadilla profunda de movilidad', duration: '5 reps lentas', description: 'Baja despacio hasta el fondo, sosteniendo 2 seg en el punto más bajo.' },
  { name: 'Giros de torso', duration: '10 reps c/lado', description: 'Con pies al ancho de hombros, gira el torso lentamente. Activa la columna torácica.' },
  { name: 'Marcha elevando rodillas', duration: '60 seg', description: 'Marcha en su sitio elevando rodillas a la altura de la cadera. Activa el cardio suavemente.' },
  { name: 'Círculos de tobillo', duration: '20 seg c/lado', description: 'Crucial para seniors y personas con sobrepeso. Reduce el riesgo de esguinces.' },
  { name: 'Apertura de pecho con brazos', duration: '10 reps', description: 'Extiende los brazos al frente y llévalos atrás abriendo el pecho. Contrarresta el pecho cerrado.' }
];

const CORE_EXERCISES = {
  beginner: [
    { name: 'Plancha de rodillas', sets: 3, reps: '20-30 seg', description: 'Apoya rodillas en el suelo. Cuerpo recto desde rodilla a cabeza. Activa el ombligo hacia la columna.' },
    { name: 'Puente de glúteos', sets: 3, reps: '12 reps', description: 'Tumbado boca arriba, eleva las caderas apretando glúteos. Protege la zona lumbar.' },
    { name: 'Bird-dog', sets: 3, reps: '8 reps c/lado', description: 'A cuatro patas, extiende el brazo derecho y pierna izquierda simultáneamente. Máximo control.' }
  ],
  intermediate: [
    { name: 'Plancha frontal', sets: 3, reps: '30-45 seg', description: 'Mantén el cuerpo perfectamente recto. No dejes caer las caderas ni elevarlas.' },
    { name: 'Plancha lateral', sets: 3, reps: '25 seg c/lado', description: 'Apoya en el antebrazo y el borde del pie. El cuerpo forma una línea diagonal.' },
    { name: 'Dead Bug', sets: 3, reps: '8 reps c/lado', description: 'Tumbado boca arriba, baja brazo y pierna opuestos sin perder contacto lumbar con el suelo.' }
  ],
  advanced: [
    { name: 'Plancha con toque de hombro', sets: 3, reps: '10 reps c/lado', description: 'En plancha alta, toca el hombro opuesto sin rotar la cadera. Máxima antirotación.' },
    { name: 'Rueda abdominal', sets: 3, reps: '8-10 reps', description: 'Con la rueda abdominal, extiéndete al frente controlando la vuelta. Avanzado.' },
    { name: 'Plancha en deslizamiento', sets: 3, reps: '8 reps c/lado', description: 'En plancha, desliza una pierna hacia afuera y vuelve. Requiere mucha estabilidad.' }
  ]
};

const COOLDOWN_EXERCISES = [
  { name: 'Estiramiento de isquiotibiales acostado', duration: '30 seg c/lado', description: 'Tumbado, lleva una pierna al pecho con la rodilla extendida. Relajación del tren inferior.' },
  { name: 'Estiramiento de pecho en puerta', duration: '30 seg', description: 'Apoya el antebrazo en el marco de una puerta y gira el cuerpo suavemente. Abre el pecho.' },
  { name: 'Postura del niño (yoga)', duration: '45 seg', description: 'Rodillas al suelo, siéntate sobre talones y extiende los brazos al frente. Relaja la columna.' },
  { name: 'Torsión espinal acostada', duration: '30 seg c/lado', description: 'Tumbado, lleva una rodilla al pecho y gírala al lado contrario. Libera la zona lumbar.' },
  { name: 'Respiración diafragmática', duration: '2 min', description: 'Inspira 4 seg, retén 2 seg, exhala 6 seg. Activa el sistema nervioso parasimpático. Esencial.' },
  { name: 'Estiramiento de cuádriceps de pie', duration: '30 seg c/lado', description: 'De pie, lleva el talón hacia el glúteo. Apoya en la pared si hay problemas de equilibrio.' }
];

// ========== BMI CALCULATOR ==========
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

const getBMICategory = (bmi, age) => {
  if (age >= 60) {
    // Seniors have different healthy BMI ranges
    if (bmi < 22) return 'bajo_peso';
    if (bmi <= 27) return 'normal';
    if (bmi <= 32) return 'sobrepeso';
    return 'obesidad';
  }
  if (bmi < 18.5) return 'bajo_peso';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'sobrepeso';
  return 'obesidad';
};

// ========== MAIN EXERCISE BLOCKS ==========
// Organized by profile
const getMainBlock = (bmiCategory, age, experienceLevel, equipment, goal, sessionCount) => {
  const isSenior = age >= 60;
  const progressBonus = Math.floor(sessionCount / 4); // Progressive overload every 4 sessions

  // ---- SENIOR PROFILE: Functional Strength + Balance ----
  if (isSenior) {
    return {
      trainingType: 'Fuerza Funcional + Equilibrio (Perfil Senior)',
      exercises: [
        {
          name: 'Sentadilla a silla', sets: 3, reps: `${10 + progressBonus}-12 reps`,
          description: 'Baja lentamente hacia la silla sin sentarte del todo. Fortalece cuádriceps y glúteos para la vida diaria.',
          muscleGroup: 'Piernas', image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+a+silla+adultos+mayores'
        },
        {
          name: 'Elevación de pantorrillas (de pie)', sets: 3, reps: `${12 + progressBonus}-15 reps`,
          description: 'Sube en puntillas sosteniéndote de una silla. Previene caídas y mejora la circulación.',
          muscleGroup: 'Pantorrillas', image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=elevacion+pantorrillas+senior'
        },
        {
          name: 'Press de pared (push-up de pie)', sets: 3, reps: `${10 + progressBonus}-15 reps`,
          description: 'Apoya las manos en la pared e inclínate. Sin impacto articular. Trabaja pectoral y tríceps.',
          muscleGroup: 'Pecho/Brazos', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=flexiones+de+pared+adultos+mayores'
        },
        {
          name: 'Equilibrio en un pie', sets: 3, reps: '20-30 seg c/lado',
          description: 'Sostente en un pie apoyando en la silla si hace falta. Vital para prevenir caídas.',
          muscleGroup: 'Equilibrio', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=ejercicios+equilibrio+adultos+mayores'
        },
        {
          name: 'Remo con banda resistencia', sets: 3, reps: `${10 + progressBonus}-12 reps`,
          description: 'Tira de la banda hacia el abdomen. Combate la sarcopenia y mejora la postura.',
          muscleGroup: 'Espalda', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=remo+banda+elastica+senior'
        }
      ]
    };
  }

  // ---- OBESITY PROFILE: Low Impact + Strength Focus ----
  if (bmiCategory === 'obesidad') {
    return {
      trainingType: 'Bajo Impacto + Fuerza Metabólica (Perfil Obesidad)',
      exercises: [
        {
          name: 'Marcha en el lugar', sets: 1, reps: '3-5 minutos',
          description: 'Marcha elevando rodillas suavemente. Sin impacto. Activa el metabolismo sin estrés articular.',
          muscleGroup: 'Cardio', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=marcha+en+sitio+bajo+impacto'
        },
        {
          name: 'Sentadilla a silla asistida', sets: 3, reps: `${8 + progressBonus}-10 reps`,
          description: 'Usa la silla de apoyo. Fortalece piernas y eleva el metabolismo basal. Cuida las rodillas.',
          muscleGroup: 'Piernas', image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+asistida+silla+principiante'
        },
        {
          name: 'Press de pared', sets: 3, reps: `${10 + progressBonus}-15 reps`,
          description: 'Push-up contra la pared. Sin carga sobre las rodillas ni muñecas. Trabaja pecho y brazos.',
          muscleGroup: 'Pecho', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=press+pared+flexiones+pared'
        },
        {
          name: 'Remo de pie con botella de agua', sets: 3, reps: `${12 + progressBonus} reps`,
          description: 'Inclínate ligeramente y tira hacia el abdomen. Activa espalda y bíceps sin impacto.',
          muscleGroup: 'Espalda', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=remo+de+pie+sin+equipo'
        },
        {
          name: 'Stepping lateral', sets: 3, reps: '30 seg',
          description: 'Pasos laterales continuos. Cardio de bajo impacto que activa abductores y glúteos.',
          muscleGroup: 'Cardio/Piernas', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
          youtubeLink: 'https://www.youtube.com/results?search_query=stepping+lateral+cardio+bajo+impacto'
        }
      ]
    };
  }

  // ---- UNDERWEIGHT PROFILE: Hypertrophy Focus ----
  if (bmiCategory === 'bajo_peso') {
    const exercises = {
      sin_equipo: [
        { name: 'Flexiones estándar', sets: 4, reps: `${8 + progressBonus}-12 reps`, description: 'Baja hasta casi tocar el suelo. Pausa 1 seg abajo. Máxima tensión muscular para hipertrofia.', muscleGroup: 'Pecho/Tríceps', image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=flexiones+tecnica+correcta+hipertrofia' },
        { name: 'Sentadillas búlgaras (pie en silla)', sets: 4, reps: `${6 + progressBonus}-10 reps c/lado`, description: 'Multiarticular de alto estímulo. Pon el pie trasero en la silla. Baja hasta 90° de rodilla.', muscleGroup: 'Piernas/Glúteos', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+bulgara+tecnica' },
        { name: 'Dominadas (si hay barra)', sets: 4, reps: `${5 + progressBonus}-8 reps`, description: 'El mejor ejercicio para espalda. Si no tienes barra, sustituye por remo invertido en mesa.', muscleGroup: 'Espalda/Bíceps', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=dominadas+tecnica+corporal' },
        { name: 'Fondos de tríceps en silla', sets: 3, reps: `${10 + progressBonus}-12 reps`, description: 'Apoya manos en el borde de la silla. Baja doblando codos 90°. Aísla el tríceps.', muscleGroup: 'Tríceps', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=fondos+triceps+silla+tecnica' }
      ],
      mancuernas: [
        { name: 'Press banca con mancuernas', sets: 4, reps: `${8 + progressBonus}-12 reps`, description: 'Acostado, baja las mancuernas hasta el pecho. Mayor rango que la barra.', muscleGroup: 'Pecho', image: 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=press+mancuernas+banca+tecnica' },
        { name: 'Sentadilla goblet', sets: 4, reps: `${8 + progressBonus}-12 reps`, description: 'Sostén una mancuerna frente al pecho. Espalda recta, baja hasta paralelo.', muscleGroup: 'Piernas', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+goblet+mancuerna' },
        { name: 'Remo con mancuerna', sets: 4, reps: `${8 + progressBonus}-12 reps c/lado`, description: 'Apoya rodilla y mano en banco. Tira la mancuerna hacia la cadera. Espalda plana.', muscleGroup: 'Espalda', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=remo+mancuerna+tecnica' },
        { name: 'Curl de bíceps con mancuernas', sets: 3, reps: `${10 + progressBonus}-12 reps`, description: 'Codos pegados al cuerpo. Sube controlando la subida y la bajada. No balancees el torso.', muscleGroup: 'Bíceps', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=curl+biceps+mancuernas+tecnica' }
      ],
      gimnasio_completo: [
        { name: 'Press banca plano (barra)', sets: 4, reps: `${6 + progressBonus}-10 reps`, description: 'Rey de pecho. Agarre a la anchura de hombros. Baja la barra a la línea del pecho.', muscleGroup: 'Pecho', image: 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=press+banca+barra+tecnica' },
        { name: 'Sentadilla libre (barra)', sets: 4, reps: `${5 + progressBonus}-8 reps`, description: 'La reina de los multiarticulares. Mayor estímulo hormonal (testosterona/GH) para ganar masa.', muscleGroup: 'Piernas/Glúteos', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+libre+barra+tecnica' },
        { name: 'Peso muerto (barra)', sets: 4, reps: `${4 + progressBonus}-6 reps`, description: 'El ejercicio de mayor masa muscular reclutada. Espalda neutral, cadenas hacia atrás.', muscleGroup: 'Cadena posterior', image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=peso+muerto+tecnica+correcta' },
        { name: 'Jalón al pecho polea alta', sets: 4, reps: `${8 + progressBonus}-12 reps`, description: 'Agarre prono a la anchura de hombros. Baja hasta la barbilla. Activa el dorsal completamente.', muscleGroup: 'Espalda/Bíceps', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=jalon+polea+alta+tecnica' }
      ]
    };
    return {
      trainingType: 'Hipertrofia y Fuerza (Perfil Bajo Peso)',
      exercises: exercises[equipment] || exercises['sin_equipo']
    };
  }

  // ---- NORMAL & OVERWEIGHT PROFILES: Mixed Periodization ----
  const getIntensityLevel = () => {
    if (experienceLevel === 'sedentario' || experienceLevel === 'principiante') return 'beginner';
    if (experienceLevel === 'intermedio') return 'intermediate';
    return 'advanced';
  };
  const level = getIntensityLevel();

  const normalExercises = {
    beginner: {
      sin_equipo: [
        { name: 'Flexiones de rodillas', sets: 3, reps: `${8 + progressBonus}-12 reps`, description: 'Rodillas apoyadas. Cuerpo recto. Baja hasta casi tocar el suelo. Perfecto para empezar.', muscleGroup: 'Pecho/Tríceps', image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=flexiones+de+rodillas+principiante' },
        { name: 'Sentadilla corporal', sets: 3, reps: `${10 + progressBonus}-15 reps`, description: 'Pies al ancho de hombros. Baja como si fueras a sentarte. Rodillas no pasan los pies.', muscleGroup: 'Piernas', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+corporal+tecnica+principiante' },
        { name: 'Zancada en el lugar', sets: 3, reps: `${8 + progressBonus} reps c/lado`, description: 'Da un paso al frente y baja la rodilla trasera hacia el suelo. Buen eje de columna.', muscleGroup: 'Piernas/Glúteos', image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=zancada+estacionaria+tecnica' },
        { name: 'Cardio: Saltos de tijera modificados', sets: 3, reps: '30 seg', description: 'Versión sin salto: abre y cierra brazos y piernas dando pasos. Eleva la frecuencia cardíaca.', muscleGroup: 'Cardio', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=jumping+jacks+sin+salto+principiante' }
      ],
      mancuernas: [
        { name: 'Press de hombros con mancuernas (sentado)', sets: 3, reps: `${10 + progressBonus}-12 reps`, description: 'Sentado, sube las mancuernas por encima de la cabeza. Activa deltoides y tríceps.', muscleGroup: 'Hombros', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=press+hombros+mancuernas+sentado' },
        { name: 'Sentadilla goblet', sets: 3, reps: `${10 + progressBonus}-12 reps`, description: 'Mancuerna al pecho. Añade carga progresiva a la sentadilla corporal.', muscleGroup: 'Piernas', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+goblet+principiante' },
        { name: 'Remo con mancuerna', sets: 3, reps: `${10 + progressBonus}-12 reps c/lado`, description: 'Espalda plana, tira hacia la cadera. Uno de los mejores ejercicios de espalda.', muscleGroup: 'Espalda', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=remo+mancuerna+principiante' }
      ],
      gimnasio_completo: [
        { name: 'Prensa de piernas', sets: 3, reps: `${12 + progressBonus}-15 reps`, description: 'Máquina guiada. Ideal para empezar con carga en piernas sin riesgo postural.', muscleGroup: 'Piernas', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=prensa+piernas+tecnica+principiante' },
        { name: 'Jalón al pecho en polea', sets: 3, reps: `${12 + progressBonus}-15 reps`, description: 'Polea alta. Baja la barra hasta la barbilla con control.', muscleGroup: 'Espalda', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=jalon+polea+principiante' },
        { name: 'Press pecho en máquina', sets: 3, reps: `${12 + progressBonus}-15 reps`, description: 'Máquina guiada. Empuja hasta la extensión completa. Sin perder el arco natural de la espalda.', muscleGroup: 'Pecho', image: 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=press+pecho+maquina+principiante' }
      ]
    },
    intermediate: {
      sin_equipo: [
        { name: 'Flexiones estándar', sets: 4, reps: `${12 + progressBonus}-15 reps`, description: 'Progresión de las flexiones de rodillas. Cuerpo en línea recta de cabeza a talones.', muscleGroup: 'Pecho/Tríceps', image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=flexiones+estandar+tecnica+intermedio' },
        { name: 'Sentadilla búlgara', sets: 4, reps: `${8 + progressBonus}-10 reps c/lado`, description: 'Pie trasero en silla. Gran hipertrofia de cuádriceps y glúteos. Más difícil que la sentadilla normal.', muscleGroup: 'Piernas/Glúteos', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+bulgara+sin+equipo' },
        { name: 'Burpee modificado (sin salto)', sets: 3, reps: `${8 + progressBonus}-10 reps`, description: 'Bajada a posición de plancha, vuelta arriba. Sin el salto final para más control.', muscleGroup: 'Cardio/Cuerpo completo', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=burpee+sin+salto+intermedio' }
      ],
      mancuernas: [
        { name: 'Press inclinado con mancuernas', sets: 4, reps: `${10 + progressBonus}-12 reps`, description: 'Banco inclinado 30-45°. Trabaja la porción clavicular del pecho. Mancuernas al pecho y arriba.', muscleGroup: 'Pecho superior', image: 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=press+inclinado+mancuernas+tecnica' },
        { name: 'Peso muerto rumano con mancuernas', sets: 4, reps: `${10 + progressBonus}-12 reps`, description: 'Piernas semirrectas. Baja las mancuernas por las piernas sintiendo el estiramiento de isquiotibiales.', muscleGroup: 'Isquiotibiales/Glúteos', image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=peso+muerto+rumano+mancuernas+tecnica' },
        { name: 'Elevaciones laterales', sets: 3, reps: `${12 + progressBonus}-15 reps`, description: 'Codos ligeramente flexionados. Sube hasta la altura de los hombros. Activa deltoides lateral.', muscleGroup: 'Hombros', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=elevaciones+laterales+mancuernas+tecnica' }
      ],
      gimnasio_completo: [
        { name: 'Sentadilla libre (barra)', sets: 4, reps: `${8 + progressBonus}-10 reps`, description: 'Nivel intermedio: foco en la técnica es clave. Profundidad mínima hasta paralelo.', muscleGroup: 'Piernas/Glúteos', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=sentadilla+libre+intermedio+tecnica' },
        { name: 'Remo en barra T', sets: 4, reps: `${8 + progressBonus}-12 reps`, description: 'Espalda plana paralela al suelo. Tira de la barra hacia el abdomen. Gran volumen de espalda.', muscleGroup: 'Espalda media', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=remo+barra+T+tecnica' },
        { name: 'Press militar (barra, de pie)', sets: 4, reps: `${8 + progressBonus}-10 reps`, description: 'De pie, empuja la barra sobre la cabeza. Activa hombros, tríceps y core estabilizador.', muscleGroup: 'Hombros', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=press+militar+barra+tecnica' }
      ]
    },
    advanced: {
      sin_equipo: [
        { name: 'Flexiones con palmada', sets: 4, reps: `${8 + progressBonus}-10 reps`, description: 'Explosividad en la subida para separar las manos. Máximo reclutamiento de fibras rápidas.', muscleGroup: 'Pecho/Potencia', image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=flexiones+palmada+tecnica+avanzado' },
        { name: 'Pistol Squat (sentadilla a una pierna)', sets: 4, reps: `${5 + progressBonus}-8 reps c/lado`, description: 'El pináculo de la sentadilla sin equipo. Requiere fuerza, flexibilidad y equilibrio extremos.', muscleGroup: 'Piernas/Equilibrio', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=pistol+squat+progresion+tecnica' },
        { name: 'Burpee completo', sets: 4, reps: `${10 + progressBonus}-12 reps`, description: 'Plancha, flexión, salto. El ejercicio metabólico por excelencia. Máxima intensidad.', muscleGroup: 'Cuerpo completo', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=burpee+tecnica+avanzado' }
      ],
      mancuernas: [
        { name: 'Press Arnold', sets: 4, reps: `${8 + progressBonus}-12 reps`, description: 'Rotación de muñeca durante el movimiento. Activa las 3 cabezas del deltoides simultáneamente.', muscleGroup: 'Hombros completos', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=press+arnold+tecnica+correcta' },
        { name: 'Romanian Deadlift a una pierna', sets: 4, reps: `${8 + progressBonus}-10 reps c/lado`, description: 'Máximo aislamiento de isquiotibiales y glúteo. Alta coordinación. Mantén la cadera nivelada.', muscleGroup: 'Isquiotibiales/Glúteo', image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=peso+muerto+una+pierna+mancuerna' },
        { name: 'Curl martillo + extensión tríceps sobre cabeza', sets: 3, reps: `${10 + progressBonus}-12 reps`, description: 'Superserie de brazos. Máxima eficiencia de tiempo. Bíceps braquial + cabeza larga del tríceps.', muscleGroup: 'Brazos', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=curl+martillo+extension+triceps+superserie' }
      ],
      gimnasio_completo: [
        { name: 'Peso muerto convencional (barra)', sets: 5, reps: `${3 + progressBonus}-5 reps`, description: 'Máxima carga. El ejercicio de mayor activación neurológica. Técnica perfecta es no negociable.', muscleGroup: 'Cadena posterior completa', image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=peso+muerto+avanzado+tecnica+perfecta' },
        { name: 'Press banca plano (barra) - Periodización', sets: 5, reps: `${3 + progressBonus}-6 reps`, description: 'Fase de fuerza máxima. Carga al 80-90% del 1RM. Descanso de 2-3 min entre series.', muscleGroup: 'Pecho/Tríceps', image: 'https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=press+banca+fuerza+maxima+avanzado' },
        { name: 'Clean y press (potencia olímpica)', sets: 4, reps: `${4 + progressBonus}-6 reps`, description: 'Levantamiento de potencia. Recluta el 75% de la musculatura total. Solo para avanzados con técnica.', muscleGroup: 'Cuerpo completo/Potencia', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400', youtubeLink: 'https://www.youtube.com/results?search_query=clean+press+tecnica+powerlifting' }
      ]
    }
  };

  const levelExercises = normalExercises[level] || normalExercises['beginner'];
  const equipmentExercises = levelExercises[equipment] || levelExercises['sin_equipo'];

  const trainingTypes = {
    beginner: 'Fuerza + Resistencia (Periodización Mixta - Principiante)',
    intermediate: 'Periodización Mixta - Intermedio (Fuerza + Cardio)',
    advanced: 'Entrenamiento de Fuerza + Potencia (Avanzado)'
  };

  return {
    trainingType: trainingTypes[level],
    exercises: equipmentExercises
  };
};

// ========== GENERATE ROUTINE ==========
exports.generateRoutine = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // PAR-Q Safety Check
    if (user.parqPassed === false) {
      return res.status(403).json({
        msg: 'Por tu seguridad, debes consultar con un médico antes de comenzar un programa de ejercicios. Responde "Sí" a las preguntas del PAR-Q que indican riesgo.',
        parqBlocked: true
      });
    }

    const { weight, height, age, experienceLevel, equipment, goal } = user;

    // Calculate BMI
    const bmi = calculateBMI(weight, height || 170);
    const bmiCategory = getBMICategory(bmi, age);

    // Get session structure
    const warmupExercises = WARMUP_EXERCISES.slice(0, 4);
    const coreLevel = (experienceLevel === 'avanzado') ? 'advanced' : (experienceLevel === 'intermedio') ? 'intermediate' : 'beginner';
    const coreExercises = CORE_EXERCISES[coreLevel];
    const { trainingType, exercises: mainExercises } = getMainBlock(bmiCategory, age, experienceLevel || 'principiante', equipment || 'sin_equipo', goal, user.sessionCount || 0);
    const cooldownExercises = COOLDOWN_EXERCISES.slice(0, 4);

    // Calculate total duration
    const warmupTime = 10;
    const coreTime = 5;
    const mainTime = mainExercises.length * 6;
    const cooldownTime = 8;
    const totalDuration = warmupTime + coreTime + mainTime + cooldownTime;

    // Build profile key
    const profile = `${bmiCategory}_${age >= 60 ? 'senior' : 'adulto'}_${experienceLevel || 'principiante'}`;

    // Progressive notes
    const notes = user.sessionCount > 0 && user.sessionCount % 4 === 0
      ? `🎉 ¡Semana de sobrecarga progresiva! Has completado ${user.sessionCount} sesiones. Las repeticiones han aumentado para continuar tu progresión.`
      : null;

    const routine = {
      profile,
      bmi,
      bmiCategory,
      trainingType,
      warmup: warmupExercises,
      core: coreExercises,
      main: mainExercises,
      cooldown: cooldownExercises,
      totalDuration,
      notes,
      generatedAt: new Date()
    };

    // Save to user and increment session count
    user.currentRoutine = routine;
    user.sessionCount = (user.sessionCount || 0) + 1;
    await user.save();

    res.json(routine);
  } catch (err) {
    console.error('Generate Routine Error:', err.message);
    res.status(500).json({ msg: 'Error al generar rutina', error: err.message });
  }
};

// ========== GET CURRENT ROUTINE ==========
exports.getRoutine = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.currentRoutine || !user.currentRoutine.main || user.currentRoutine.main.length === 0) {
      return res.status(404).json({ msg: 'No tienes una rutina generada aún.' });
    }
    res.json(user.currentRoutine);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener rutina', error: err.message });
  }
};

// ========== SAVE RPE FEEDBACK ==========
exports.saveRPE = async (req, res) => {
  try {
    const { rpe, duration } = req.body;
    const user = await User.findById(req.user.id);

    user.workouts.push({
      date: new Date(),
      type: user.currentRoutine?.trainingType || 'General',
      duration: duration || user.currentRoutine?.totalDuration,
      rpe,
    });

    await user.save();
    res.json({ msg: 'Esfuerzo registrado. ¡Buen trabajo!' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al guardar RPE' });
  }
};
