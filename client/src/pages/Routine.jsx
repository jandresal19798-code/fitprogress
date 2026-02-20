import { useState, useEffect } from 'react';
import { api } from '../services/api';

const BMI_INFO = {
  bajo_peso: { label: 'Bajo Peso', color: 'text-neon-blue', bg: 'bg-neon-blue/10 border-neon-blue/20', desc: 'Enfoque en hipertrofia y fuerza multiarticular' },
  normal: { label: 'Normal', color: 'text-neon-green', bg: 'bg-neon-green/10 border-neon-green/20', desc: 'Periodización mixta: fuerza + resistencia + flexibilidad' },
  sobrepeso: { label: 'Sobrepeso', color: 'text-neon-orange', bg: 'bg-neon-orange/10 border-neon-orange/20', desc: 'Fuerza metabólica + cardio moderado' },
  obesidad: { label: 'Obesidad', color: 'text-neon-pink', bg: 'bg-neon-pink/10 border-neon-pink/20', desc: 'Bajo impacto. Fuerza para elevar metabolismo basal' }
};

const PhaseIcon = ({ phase }) => {
  const icons = {
    warmup: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />,
    core: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    main: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    cooldown: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  };
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[phase]}
    </svg>
  );
};

const ExerciseCard = ({ exercise, index }) => (
  <div className="group card !p-0 overflow-hidden hover:border-neon-green/30">
    <div className="relative h-48">
      <img
        src={exercise.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop"}
        alt={exercise.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      <div className="absolute top-4 left-4 w-8 h-8 bg-neon-green text-black rounded-lg flex items-center justify-center font-black text-sm shadow-glow-green">
        {index + 1}
      </div>
      {exercise.muscleGroup && (
        <span className="absolute top-4 right-4 text-[10px] font-black bg-black/60 backdrop-blur-md text-neon-green px-3 py-1 rounded-full border border-neon-green/30 uppercase tracking-widest">
          {exercise.muscleGroup}
        </span>
      )}
    </div>
    <div className="p-6 space-y-4">
      <h4 className="font-display font-black text-white text-lg leading-tight uppercase tracking-tight">{exercise.name}</h4>
      <div className="flex flex-wrap gap-2">
        {exercise.sets && <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-3 py-1 rounded-lg uppercase tracking-widest">{exercise.sets} SERIES</span>}
        {exercise.reps && <span className="text-[10px] font-black bg-neon-green/10 text-neon-green px-3 py-1 rounded-lg uppercase tracking-widest border border-neon-green/20">{exercise.reps}</span>}
      </div>
      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{exercise.description || 'Enfoque en técnica perfecta y control muscular.'}</p>
      {exercise.youtubeLink && (
        <a href={exercise.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neon-pink font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors group/link pt-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
          <span className="underline decoration-2 underline-offset-4 decoration-neon-pink/30 group-hover/link:decoration-white">Ver Tutorial</span>
        </a>
      )}
    </div>
  </div>
);

const PhaseSection = ({ title, phase, exercises, filter }) => {
  const [isOpen, setIsOpen] = useState(true);

  const phaseColors = {
    warmup: 'border-neon-orange/20 text-neon-orange bg-neon-orange/5',
    core: 'border-neon-pink/20 text-neon-pink bg-neon-pink/5',
    main: 'border-neon-green/20 text-neon-green bg-neon-green/5',
    cooldown: 'border-neon-blue/20 text-neon-blue bg-neon-blue/5',
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(filter.toLowerCase()) ||
    ex.muscleGroup?.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredExercises.length === 0) return null;

  return (
    <div className="mb-10 group/phase">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 rounded-3xl border ${phaseColors[phase]} mb-6 transition-all hover:scale-[1.01]`}
      >
        <div className="flex items-center gap-4">
          <PhaseIcon phase={phase} />
          <div>
            <span className="font-display font-black text-xl uppercase tracking-tighter block leading-none">{title}</span>
            <span className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mt-1">{filteredExercises.length} EJERCICIOS</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center transition-transform duration-500" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExercises.map((ex, idx) => (
            <ExerciseCard key={idx} exercise={ex} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

const Routine = () => {
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutine();
  }, []);

  const fetchRoutine = async () => {
    try {
      const res = await api.get('/routines');
      setRoutine(res.data);
    } catch (err) {
      if (err.response?.status !== 404) setError('Error al cargar la rutina');
    } finally {
      setLoading(false);
    }
  };

  const generateRoutine = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await api.post('/routines/generate');
      setRoutine(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al generar rutina');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-pulse pb-24">
        <div className="h-24 w-2/3 bg-slate-800 rounded-3xl"></div>
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-800 rounded-2xl"></div>)}
        </div>
        <div className="h-[500px] bg-slate-800 rounded-[2rem]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-neon-green rounded-full shadow-glow-green"></div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white">
              TU <span className="text-neon-green">RUTINA</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium text-lg ml-5 max-w-xl">Entrenamiento adaptativo basado en ciencia para tus objetivos de <span className="text-white font-bold">{routine?.trainingType || 'alto rendimiento'}</span>.</p>
        </div>

        <button
          onClick={generateRoutine}
          disabled={generating}
          className="btn-primary !py-5 !px-10 shadow-glow-green/30 group"
        >
          {generating ? 'ANALIZANDO...' : '⚡ GENERAR NUEVA'}
        </button>
      </header>

      {/* Filter / Search Bar */}
      {routine && (
        <div className="relative group max-w-2xl">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-neon-green transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="BUSCAR POR EJERCICIO O GRUPO MUSCULAR..."
            className="input !pl-16 !py-5 !bg-slate-900 border-white/5 focus:border-neon-green/50 placeholder:text-slate-600 font-bold tracking-widest text-[11px] uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {error && <div className="card !bg-neon-pink/10 border-neon-pink/20 text-neon-pink text-sm font-bold p-6 rounded-2xl animate-fade-in">{error}</div>}

      {!routine ? (
        <div className="card text-center py-24 border-dashed border-2 border-white/10 group">
          <div className="w-24 h-24 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-glow-green/5">
            <svg className="w-12 h-12 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-black text-white uppercase mb-4 tracking-tight">Activa tu potencial</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">Nuestro algoritmo diseñará una sesión perfecta para hoy analizando tu nivel actual.</p>
          <button onClick={generateRoutine} disabled={generating} className="btn-primary !px-16 !py-5">⚡ EMPEZAR AHORA</button>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card !p-6 text-center border-t-4 border-t-neon-blue">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2 leading-none">Tu IMC</div>
              <div className="text-3xl font-display font-black text-white">{routine.bmi}</div>
              <div className={`text-[10px] font-black mt-2 uppercase tracking-widest ${BMI_INFO[routine.bmiCategory]?.color || 'text-white'}`}>
                {BMI_INFO[routine.bmiCategory]?.label || 'NORMAL'}
              </div>
            </div>
            <div className="card !p-6 text-center border-t-4 border-t-neon-green">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2 leading-none">Duración</div>
              <div className="text-3xl font-display font-black text-white">{routine.totalDuration}</div>
              <div className="text-[10px] font-black text-neon-green mt-2 uppercase tracking-widest">MINUTOS</div>
            </div>
            <div className="card !p-6 text-center border-t-4 border-t-neon-orange">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2 leading-none">Esfuerzo</div>
              <div className="text-3xl font-display font-black text-white">RPE 8</div>
              <div className="text-[10px] font-black text-neon-orange mt-2 uppercase tracking-widest">OBJETIVO</div>
            </div>
            <div className="card !p-6 text-center border-t-4 border-t-neon-pink">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2 leading-none">Estructura</div>
              <div className="text-3xl font-display font-black text-white">4</div>
              <div className="text-[10px] font-black text-neon-pink mt-2 uppercase tracking-widest">FASES</div>
            </div>
          </div>

          <div className="space-y-4">
            {routine.warmup?.length > 0 && <PhaseSection title="Calentamiento Dinámico" phase="warmup" exercises={routine.warmup} filter={searchTerm} />}
            {routine.core?.length > 0 && <PhaseSection title="Core & Estabilidad" phase="core" exercises={routine.core} filter={searchTerm} />}
            {routine.main?.length > 0 && <PhaseSection title="Bloque de Potencia" phase="main" exercises={routine.main} filter={searchTerm} />}
            {routine.cooldown?.length > 0 && <PhaseSection title="Vuelta a la Calma" phase="cooldown" exercises={routine.cooldown} filter={searchTerm} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Routine;

