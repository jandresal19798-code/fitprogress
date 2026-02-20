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

const ExerciseCard = ({ exercise, index, onWatchVideo }) => (
  <div className="group card-premium !p-0 overflow-hidden hover:border-white/20 hover:scale-[1.03] transition-all duration-500 flex flex-col h-full">
    <div className="relative h-60 overflow-hidden">
      <img
        src={exercise.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop"}
        alt={exercise.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out brightness-[0.6] group-hover:brightness-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
      <div className="absolute top-6 left-6 w-12 h-12 bg-neon-green text-black rounded-2xl flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(204,255,0,0.3)] transform -rotate-3 group-hover:rotate-0 transition-transform">
        {index + 1}
      </div>
      {exercise.muscleGroup && (
        <span className="absolute top-6 right-6 text-[10px] font-black bg-black/80 backdrop-blur-xl text-neon-green px-5 py-2.5 rounded-2xl border border-neon-green/30 uppercase tracking-[0.25em] shadow-2xl">
          {exercise.muscleGroup}
        </span>
      )}

      {/* Play Overlay */}
      {exercise.youtubeLink && (
        <button
          onClick={() => onWatchVideo(exercise)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        >
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
            <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </button>
      )}
    </div>
    <div className="p-8 space-y-6 flex-1 flex flex-col">
      <h4 className="font-display font-black text-white text-2xl leading-tight uppercase tracking-tighter group-hover:text-neon-green transition-colors">{exercise.name}</h4>
      <div className="flex flex-wrap gap-3">
        {exercise.sets && <span className="text-[10px] font-black bg-white/5 text-slate-400 px-5 py-2 rounded-xl uppercase tracking-widest border border-white/5">{exercise.sets} SERIES</span>}
        {exercise.reps && <span className="text-[10px] font-black bg-neon-green/10 text-neon-green px-5 py-2 rounded-xl uppercase tracking-widest border border-neon-green/20 shadow-[0_0_15px_rgba(204,255,0,0.1)]">{exercise.reps}</span>}
      </div>
      <p className="text-slate-500 text-sm leading-relaxed italic font-medium flex-1">"{exercise.description || 'Domina la técnica, domina el mundo.'}"</p>
      {exercise.youtubeLink && (
        <button
          onClick={() => onWatchVideo(exercise)}
          className="flex items-center gap-4 text-neon-pink font-black text-[12px] uppercase tracking-[0.2em] hover:text-white transition-all group/link pt-4 border-t border-white/5 w-fit"
        >
          <div className="w-10 h-10 rounded-xl bg-neon-pink/10 flex items-center justify-center group-hover/link:bg-neon-pink group-hover/link:text-black transition-all shadow-glow-pink/10">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
          </div>
          <span className="underline decoration-2 underline-offset-8 decoration-neon-pink/30 group-hover/link:decoration-white">VER TUTORIAL</span>
        </button>
      )}
    </div>
  </div>
);

const VideoModal = ({ exercise, onClose }) => {
  if (!exercise) return null;

  // Convert search results to an embeddable query or just show the results in a friendly way
  const videoUrl = exercise.youtubeLink.includes('watch?v=')
    ? exercise.youtubeLink.replace('watch?v=', 'embed/')
    : exercise.youtubeLink;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-6xl aspect-video card-premium overflow-hidden animate-slide-up bg-black border-white/10">
        <div className="absolute top-6 right-6 z-20">
          <button onClick={onClose} className="btn-icon !bg-black/50 !backdrop-blur-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <iframe
          src={videoUrl}
          title={exercise.name}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">{exercise.name}</h3>
          <p className="text-neon-green text-[10px] font-black uppercase tracking-[0.3em] mt-2">DÉJATE LA PIEL EN CADA REPETICIÓN</p>
        </div>
      </div>
    </div>
  );
};

const ExercisePhase = ({ title, exercises, phase, onWatchVideo }) => {
  const [isOpen, setIsOpen] = useState(true);
  const filteredExercises = exercises || [];

  const phaseColors = {
    warmup: 'border-neon-blue text-neon-blue shadow-glow-blue/20',
    core: 'border-neon-orange text-neon-orange shadow-glow-orange/20',
    main: 'border-neon-green text-neon-green shadow-glow-green/20',
    cooldown: 'border-neon-pink text-neon-pink shadow-glow-pink/20'
  };

  if (filteredExercises.length === 0) return null;

  return (
    <div className="mb-12 group/phase">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-8 rounded-[2rem] border-2 ${phaseColors[phase]} mb-8 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl backdrop-blur-3xl bg-slate-900/40`}
      >
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-current/10 flex items-center justify-center shadow-inner">
            <PhaseIcon phase={phase} />
          </div>
          <div className="text-left">
            <span className="font-display font-black text-2xl uppercase tracking-tighter block leading-none">{title}</span>
            <span className="text-[11px] font-black opacity-60 uppercase tracking-[0.25em] mt-2 block">{filteredExercises.length} EJERCICIOS CONFIGURADOS</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center transition-transform duration-700 shadow-glow" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredExercises.map((ex, idx) => (
            <ExerciseCard key={idx} exercise={ex} index={idx} onWatchVideo={onWatchVideo} />
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
  const [rpeSubmitted, setRpeSubmitted] = useState(false);
  const [showRpe, setShowRpe] = useState(false);
  const [selectedRpe, setSelectedRpe] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [routineRes, statsRes] = await Promise.all([
        api.get('/routines'),
        api.get('/workouts/stats')
      ]);
      setRoutine(routineRes.data);
      setStats(statsRes.data);
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
      setShowRpe(false);
      setRpeSubmitted(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al generar rutina');
    } finally {
      setGenerating(false);
    }
  };

  const submitRpe = async (rpe) => {
    setSelectedRpe(rpe);
    try {
      await api.post('/routines/rpe', { rpe, duration: routine?.totalDuration });
      setRpeSubmitted(true);
      setShowRpe(false);
    } catch (err) {
      console.error('Error al guardar RPE');
    }
  };

  const rpeLabels = ['', '😴 Muy fácil', '😌 Fácil', '🙂 Ligero', '😊 Moderado', '😐 Un poco duro', '😮 Duro', '😤 Muy duro', '😰 Extremo', '🥵 Máximo esfuerzo', '💀 Límite absoluto'];
  const rpeColors = ['', 'bg-cyan-500', 'bg-blue-500', 'bg-teal-500', 'bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-orange-400', 'bg-orange-500', 'bg-red-500', 'bg-red-700'];

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

        <div className="flex gap-4">
          {routine && !showRpe && !rpeSubmitted && (
            <button
              onClick={() => setShowRpe(true)}
              className="btn-secondary !py-5 !px-8 border-neon-orange/20 text-neon-orange hover:bg-neon-orange/10"
            >
              📊 REPORTAR RPE
            </button>
          )}
          <button
            onClick={generateRoutine}
            disabled={generating}
            className="btn-primary !py-5 !px-10 shadow-glow-green/30 group"
          >
            {generating ? 'ANALIZANDO...' : '⚡ GENERAR NUEVA'}
          </button>
        </div>
      </header>

      {/* RPE Widget */}
      {showRpe && (
        <div className="card border-neon-orange/20 animate-slide-up">
          <h3 className="text-2xl font-display font-black text-white uppercase mb-2">¿Cómo estuvo tu entrenamiento?</h3>
          <p className="text-slate-500 text-sm mb-8 italic">Escala RPE: Tu respuesta ajustará la intensidad de las próximas sesiones automáticamente.</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <button
                key={n}
                onClick={() => submitRpe(n)}
                className={`${rpeColors[n]} aspect-square rounded-2xl text-slate-950 font-black text-xl hover:scale-110 active:scale-95 transition-all shadow-xl hover:brightness-110`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest mt-6 px-2">
            <span>Muy fácil</span>
            <span>Límite absoluto</span>
          </div>
          <button onClick={() => setShowRpe(false)} className="mt-8 text-xs font-black text-slate-600 hover:text-white uppercase tracking-widest">Cerrar</button>
        </div>
      )}

      {rpeSubmitted && (
        <div className="card !bg-neon-green/10 border-neon-green/20 text-neon-green p-6 flex items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 bg-neon-green text-black rounded-full flex items-center justify-center shadow-glow-green">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <div className="font-black text-[13px] uppercase tracking-widest">¡Esfuerzo registrado (RPE: {selectedRpe})!</div>
            <p className="text-xs text-slate-400 mt-1">{rpeLabels[selectedRpe]}. El algoritmo ajustará tu próxima sesión.</p>
          </div>
        </div>
      )}

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
        <div className="card-premium text-center py-24 border-dashed border-2 border-white/10 group">
          <div className="w-24 h-24 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.1)]">
            <svg className="w-12 h-12 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-display font-black text-white uppercase mb-4 tracking-tighter">Activa tu potencial</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-10 text-lg font-medium">Nuestro algoritmo diseñará una sesión perfecta para hoy analizando tu nivel actual.</p>
          <button onClick={generateRoutine} disabled={generating} className="btn-primary !px-16 !py-6">⚡ {generating ? 'ANALIZANDO PERFIL...' : 'EMPEZAR AHORA'}</button>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card-premium !p-8 text-center border-t-4 border-t-neon-blue h-full flex flex-col justify-center shadow-lg">
              <div className="text-[11px] text-slate-500 font-black uppercase tracking-[0.25em] mb-4 leading-none">Tu IMC</div>
              <div className="text-4xl font-display font-black text-white drop-shadow-glow-blue">{routine.bmi}</div>
              <div className={`text-[10px] font-black mt-4 uppercase tracking-widest ${BMI_INFO[routine.bmiCategory]?.color || 'text-white'}`}>
                {BMI_INFO[routine.bmiCategory]?.label || 'NORMAL'}
              </div>
            </div>
            <div className="card-premium !p-8 text-center border-t-4 border-t-neon-green h-full flex flex-col justify-center shadow-lg">
              <div className="text-[11px] text-slate-500 font-black uppercase tracking-[0.25em] mb-4 leading-none">Duración</div>
              <div className="text-4xl font-display font-black text-white drop-shadow-glow-green">{routine.totalDuration}</div>
              <div className="text-[10px] font-black text-neon-green mt-4 uppercase tracking-widest">MINUTOS</div>
            </div>
            <div className="card-premium !p-8 text-center border-t-4 border-t-neon-orange h-full flex flex-col justify-center shadow-lg">
              <div className="text-[11px] text-slate-500 font-black uppercase tracking-[0.25em] mb-4 leading-none">Último RPE</div>
              <div className="text-4xl font-display font-black text-white drop-shadow-glow-orange">{selectedRpe || 'N/A'}</div>
              <div className="text-[10px] font-black text-neon-orange mt-4 uppercase tracking-widest">ESFUERZO</div>
            </div>
            <div className="card-premium !p-8 text-center border-t-4 border-t-neon-pink h-full flex flex-col justify-center shadow-lg">
              <div className="text-[11px] text-slate-500 font-black uppercase tracking-[0.25em] mb-4 leading-none">Estructura</div>
              <div className="text-4xl font-display font-black text-white drop-shadow-glow-pink">4</div>
              <div className="text-[10px] font-black text-neon-pink mt-4 uppercase tracking-widest">FASES</div>
            </div>
          </div>

          {/* Progressive Overload Note */}
          {routine.notes && (
            <div className="card-premium !bg-neon-pink/5 border-neon-pink/10 p-8 flex gap-6 items-start animate-fade-in shadow-inner">
              <div className="w-12 h-12 rounded-2xl bg-neon-pink/20 flex items-center justify-center text-neon-pink shadow-glow-pink/20 flex-shrink-0 border border-neon-pink/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <div className="text-[11px] text-neon-pink font-black uppercase tracking-[0.2em] mb-2">Nota del Algoritmo: Sobrecarga Progresiva</div>
                <p className="text-slate-400 text-base italic leading-relaxed">{routine.notes}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <ExercisePhase
              title="Calentamiento Dinámico"
              exercises={routine.warmup?.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
              phase="warmup"
              onWatchVideo={setActiveVideo}
            />
            <ExercisePhase
              title="Activación Core"
              exercises={routine.core?.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
              phase="core"
              onWatchVideo={setActiveVideo}
            />
            <ExercisePhase
              title="Bloque de Potencia"
              exercises={routine.main?.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
              phase="main"
              onWatchVideo={setActiveVideo}
            />
            <ExercisePhase
              title="Vuelta a la Calma"
              exercises={routine.cooldown?.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
              phase="cooldown"
              onWatchVideo={setActiveVideo}
            />
          </div>
        </div>
      )}

      <VideoModal exercise={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
};

export default Routine;

