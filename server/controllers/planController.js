const User = require('../models/User');

// ── HELPERS ──────────────────────────────────────────────────────────────────
const toDateStr = (date) => date.toISOString().split('T')[0]; // "YYYY-MM-DD"

const calcStreak = (completedDays) => {
    if (!completedDays || completedDays.length === 0) return 0;
    const sorted = [...completedDays].sort().reverse();
    const today = toDateStr(new Date());
    const yesterday = toDateStr(new Date(Date.now() - 86400000));

    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1]);
        const curr = new Date(sorted[i]);
        const diff = (prev - curr) / 86400000;
        if (diff === 1) streak++;
        else break;
    }
    return streak;
};

// ── MARK DAY AS COMPLETE / INCOMPLETE ────────────────────────────────────────
exports.toggleDay = async (req, res) => {
    try {
        const { date } = req.body; // "YYYY-MM-DD"
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ msg: 'Fecha inválida. Formato: YYYY-MM-DD' });
        }

        const user = await User.findById(req.user.id);
        const completed = user.completedDays || [];
        const idx = completed.indexOf(date);

        if (idx > -1) {
            completed.splice(idx, 1); // unmark
        } else {
            completed.push(date); // mark
        }

        user.completedDays = completed;
        user.currentStreak = calcStreak(completed);
        await user.save();

        res.json({
            completedDays: user.completedDays,
            currentStreak: user.currentStreak,
            marked: idx === -1
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error al actualizar día', error: err.message });
    }
};

// ── GET CALENDAR DATA ─────────────────────────────────────────────────────────
exports.getCalendar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('completedDays currentStreak workouts');
        const completedDays = user.completedDays || [];
        const streak = calcStreak(completedDays);

        // Stats
        const now = new Date();
        const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const thisYear = `${now.getFullYear()}`;

        const totalDays = completedDays.length;
        const monthDays = completedDays.filter(d => d.startsWith(thisMonth)).length;
        const yearDays = completedDays.filter(d => d.startsWith(thisYear)).length;

        res.json({
            completedDays,
            currentStreak: streak,
            stats: { totalDays, monthDays, yearDays }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener calendario', error: err.message });
    }
};

// ── GENERATE WEEKLY PLAN ──────────────────────────────────────────────────────
exports.getWeeklyPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { experienceLevel, age, goal } = user;

        // Determine training days per week by experience
        const trainingDaysMap = {
            sedentario: { days: 2, rest: 'Mi·Vi o Ma·Ju', note: 'Empezar despacio. El cuerpo necesita adaptarse.' },
            principiante: { days: 3, rest: 'Lu·Mi·Vi', note: 'Clásico para principiantes. Un día de entrada entre sesiones.' },
            intermedio: { days: 4, rest: 'Lu·Ma·Ju·Vi', note: '4 días permite periodización por grupos musculares.' },
            avanzado: { days: 5, rest: 'Lu·Ma·Mi·Ju·Vi', note: '5 días con doble división de grupos musculares.' }
        };

        const isSenior = age >= 60;
        const config = isSenior
            ? { days: 3, rest: 'Lu·Mi·Vi', note: 'Prioritad: equilibrio, fuerza funcional y movilidad articular.' }
            : (trainingDaysMap[experienceLevel] || trainingDaysMap['principiante']);

        // Weekly structure
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const fociByGoal = {
            perder_peso: ['Cardio LISS', 'Fuerza Full Body', 'Cardio HIIT', 'Fuerza Upper', 'Fuerza Lower', 'Cardio Suave', 'Descanso Activo'],
            ganar_musculo: ['Pecho + Tríceps', 'Espalda + Bíceps', 'Piernas + Glúteos', 'Hombros + Core', 'Full Body', 'Cardio Ligero', 'Descanso'],
            mantener: ['Full Body A', 'Cardio 30min', 'Full Body B', 'Movilidad', 'Full Body C', 'Cardio Suave', 'Descanso'],
            resistencia: ['Cardio 45min', 'Fuerza Full Body', 'Intervals HIIT', 'Cardio 30min', 'Fuerza + Core', 'Cardio Largo', 'Descanso']
        };
        const foci = fociByGoal[goal] || fociByGoal['mantener'];

        // Build plan: mark rest days
        const totalTraining = config.days;
        const schedule = [];
        let trainCount = 0;

        // Distribute training days evenly
        const trainingSlots = [0, 2, 4, 1, 3]; // Mon, Wed, Fri, Tue, Thu priority
        const trainDays = new Set(trainingSlots.slice(0, totalTraining));

        dayNames.forEach((name, idx) => {
            const isTraining = trainDays.has(idx);
            const isSat = idx === 5;
            const isSun = idx === 6;

            let type, focus, intensity, color;
            if (isSun) {
                type = 'Descanso Total'; focus = 'Recuperación completa'; intensity = null; color = 'slate';
            } else if (isSat && totalTraining < 5) {
                type = 'Descanso Activo'; focus = 'Caminata suave, stretching, yoga'; intensity = '2/10 RPE'; color = 'blue';
            } else if (isTraining) {
                type = 'Entrenamiento'; focus = foci[trainCount % foci.length];
                intensity = experienceLevel === 'avanzado' ? '7-8/10 RPE' : experienceLevel === 'intermedio' ? '6-7/10 RPE' : '5-6/10 RPE';
                color = 'green'; trainCount++;
            } else {
                type = 'Descanso'; focus = 'El músculo crece en reposo'; intensity = null; color = 'slate';
            }

            schedule.push({ day: name, dayIdx: idx, type, focus, intensity, color, isTraining: type === 'Entrenamiento' });
        });

        res.json({ schedule, config, experienceLevel, goal, totalTraining });
    } catch (err) {
        res.status(500).json({ msg: 'Error al generar plan semanal', error: err.message });
    }
};

// ── GENERATE MONTHLY PLAN ─────────────────────────────────────────────────────
exports.getMonthlyPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-11

        // 4-week periodization cycle
        const weeks = [
            {
                week: 1,
                phase: 'Adaptación',
                icon: '🌱',
                volume: 'Bajo',
                intensity: 'Moderada',
                rpe: '5-6',
                focus: 'Aprender la técnica. Trabajar en el rango de movimiento completo. Series de 15-20 repeticiones.',
                color: 'blue'
            },
            {
                week: 2,
                phase: 'Desarrollo',
                icon: '📈',
                volume: 'Moderado',
                intensity: 'Media-Alta',
                rpe: '6-7',
                focus: 'Aumentar el peso o las reps respecto a la semana 1. Empezar a sentir la sobrecarga progresiva.',
                color: 'green'
            },
            {
                week: 3,
                phase: 'Intensificación',
                icon: '⚡',
                volume: 'Alto',
                intensity: 'Alta',
                rpe: '7-8',
                focus: 'Maximum Challenge. Reducir el descanso entre series. Agregar técnicas avanzadas (supersets, drop sets).',
                color: 'orange'
            },
            {
                week: 4,
                phase: 'Descarga (Deload)',
                icon: '❄️',
                volume: 'Muy Bajo',
                intensity: 'Ligera',
                rpe: '4-5',
                focus: 'Recuperación activa. Reducir el volumen al 50%. El cuerpo consolida las adaptaciones aquí.',
                color: 'purple'
            }
        ];

        // Monthly stats from completed days
        const thisMonth = `${now.getFullYear()}-${String(currentMonth + 1).padStart(2, '0')}`;
        const completedThisMonth = (user.completedDays || []).filter(d => d.startsWith(thisMonth)).length;

        res.json({
            weeks,
            currentMonth: months[currentMonth],
            completedThisMonth,
            note: 'El ciclo de 4 semanas se reinicia automáticamente cada mes. Esta periodización evita el estancamiento y maximiza la adaptación muscular.'
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error al generar plan mensual', error: err.message });
    }
};

// ── GENERATE ANNUAL PLAN ──────────────────────────────────────────────────────
exports.getAnnualPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const now = new Date();
        const currentMonth = now.getMonth();

        const quarters = [
            {
                id: 'Q1',
                months: 'Enero · Febrero · Marzo',
                phase: 'Fase Base — Construir el Hábito',
                icon: '🌱',
                color: 'blue',
                objective: 'Crear la base de acondicionamiento físico. Establecer la consistencia como hábito no negociable.',
                focus: ['Movimientos fundamentales', 'Técnica perfecta', 'Consistencia sobre intensidad', 'Crear el hábito de registrar'],
                kpi: '3 sesiones/semana sin falta',
                training: 'Volumen bajo, intensidad moderada. Full body 3x/semana.'
            },
            {
                id: 'Q2',
                months: 'Abril · Mayo · Junio',
                phase: 'Fase Desarrollo — Aumentar el Volumen',
                icon: '📈',
                color: 'green',
                objective: 'Aumentar el volumen de entrenamiento. El cuerpo ya adaptó la base, ahora se puede exigir más.',
                focus: ['Aumentar series por grupo muscular', 'Introducir técnicas avanzadas', 'Periodización ondulante', 'Primeras mediciones de progreso'],
                kpi: '4 sesiones/semana + registro RPE',
                training: 'Volumen medio-alto. División por grupos musculares.'
            },
            {
                id: 'Q3',
                months: 'Julio · Agosto · Septiembre',
                phase: 'Fase Pico — Máximo Rendimiento',
                icon: '⚡',
                color: 'orange',
                objective: 'El trimestre de máximo esfuerzo. Se busca alcanzar el mejor estado físico del año.',
                focus: ['Alta intensidad con buena técnica', 'HIIT y cardio avanzado', 'Descanso y nutrición como variables', 'Medir 1RM o resistencia máxima'],
                kpi: 'Lograr récord personal en al menos 1 ejercicio',
                training: 'Volumen alto, alta intensidad. +5 sesiones/semana para avanzados.'
            },
            {
                id: 'Q4',
                months: 'Octubre · Noviembre · Diciembre',
                phase: 'Fase Mantenimiento — Consolidar Ganancias',
                icon: '🛡️',
                color: 'purple',
                objective: 'No perder lo ganado. Mantener la forma, recuperarse del Q3 y preparar el próximo año.',
                focus: ['Reducir volumen, no intensidad', 'Priorizar movilidad y flexibilidad', 'Planificación del año siguiente', 'Celebrar el progreso anual'],
                kpi: 'Mantener ≥ 80% de la condición del Q3',
                training: 'Volumen reducido. 3 sesiones/semana. Énfasis en descanso activo.'
            }
        ];

        // Annual stats
        const thisYear = `${now.getFullYear()}`;
        const completedThisYear = (user.completedDays || []).filter(d => d.startsWith(thisYear)).length;
        const currentQuarterIdx = Math.floor(currentMonth / 3);

        res.json({
            quarters,
            currentQuarter: quarters[currentQuarterIdx]?.id || 'Q1',
            year: now.getFullYear(),
            completedThisYear,
            streakRecord: user.currentStreak || 0
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error al generar plan anual', error: err.message });
    }
};
