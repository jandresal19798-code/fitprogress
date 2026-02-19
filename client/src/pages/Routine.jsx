import { useState, useEffect } from 'react';
import { api } from '../services/api';

const BMI_INFO = {
  bajo_peso: { label: 'Bajo Peso', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'Enfoque en hipertrofia y fuerza multiarticular' },
  normal: { label: 'Normal', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', desc: 'Periodización mixta: fuerza + resistencia + flexibilidad' },
  sobrepeso: { label: 'Sobrepeso', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', desc: 'Fuerza metabólica + cardio moderado' },
  obesidad: { label: 'Obesidad', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', desc: 'Bajo impacto. Fuerza para elevar metabolismo basal' }
};

const PhaseIcon = ({ phase }) => {
  const icons = {
    warmup: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />,
    core: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    main: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    cooldown: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  };
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[phase]}
    </svg>
  );
};

const ExerciseCard = ({ exercise, index }) => (
  <div className="group bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/20 hover:translate-y-[-2px] transition-all duration-300">
    {exercise.image && (
      <div className="h-36 overflow-hidden relative">
        <img
          src={exercise.image}
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {exercise.muscleGroup && (
          <span className="absolute top-2 right-2 text-[10px] font-bold bg-black/60 backdrop-blur-sm text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
            {exercise.muscleGroup}
          </span>
        )}
        <span className="absolute top-2 left-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-green-500/30">
          {index + 1}
        </span>
      </div>
    )}
    <div className="p-4">
      <h4 className="font-bold text-white text-sm mb-1">{exercise.name}</h4>
      {exercise.description && (
        <p className="text-slate-500 text-xs mb-3 leading-relaxed">{exercise.description}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {exercise.sets && (
            <span className="text-xs bg-slate-700/60 px-2 py-1 rounded-lg text-slate-300 font-medium">
              {exercise.sets} series
            </span>
          )}
          {exercise.reps && (
            <span className="text-xs bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg text-green-400 font-medium">
              {exercise.reps}
            </span>
          )}
        </div>
        {exercise.youtubeLink && (
          <a
            href={exercise.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors group/link"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            <span className="group-hover/link:underline">Tutorial</span>
          </a>
        )}
      </div>
    </div>
  </div>
);

const PhaseSection = ({ title, phase, exercises, color }) => {
  const [isOpen, setIsOpen] = useState(true);

  const phaseColors = {
    warmup: 'from-orange-500/20 to-amber-500/10 border-orange-500/20 text-orange-400',
    core: 'from-purple-500/20 to-violet-500/10 border-purple-500/20 text-purple-400',
    main: 'from-green-500/20 to-emerald-500/10 border-green-500/20 text-green-400',
    cooldown: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20 text-blue-400',
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r border ${phaseColors[phase]} mb-3 transition-all hover:brightness-110`}
      >
        <div className="flex items-center gap-3">
          <PhaseIcon phase={phase} />
          <span className="font-bold font-display">{title}</span>
          <span className="text-xs opacity-70 font-normal">({exercises.length} ejercicios)</span>
        </div>
        <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="animate-fade-in">
          {(phase === 'warmup' || phase === 'cooldown') ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exercises.map((ex, idx) => (
                <div key={idx} className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 flex items-start gap-3 hover:border-white/10 transition-all">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${phase === 'warmup' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{ex.name}</p>
                    <p className={`text-xs font-bold mt-0.5 ${phase === 'warmup' ? 'text-orange-400' : 'text-blue-400'}`}>{ex.duration}</p>
                    {ex.description && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{ex.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((ex, idx) => (
                <ExerciseCard key={idx} exercise={ex} index={idx} />
              ))}
            </div>
          )}
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
  const [rpeSubmitted, setRpeSubmitted] = useState(false);
  const [showRpe, setShowRpe] = useState(false);
  const [selectedRpe, setSelectedRpe] = useState(null);

  useEffect(() => {
    fetchRoutine();
  }, []);

  const fetchRoutine = async () => {
    try {
      const res = await api.get('/routines');
      setRoutine(res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Error al cargar la rutina');
      }
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
      if (err.response?.data?.parqBlocked) {
        setError('⚠️ ' + err.response.data.msg);
      } else {
        setError(err.response?.data?.msg || 'Error al generar rutina');
      }
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
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando tu rutina científica...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Tu Rutina Científica</h1>
          <p className="text-slate-400 mt-1 text-sm">Generada según tu IMC, edad, nivel y equipamiento</p>
        </div>
        <div className="flex gap-3">
          {routine && !showRpe && !rpeSubmitted && (
            <button
              onClick={() => setShowRpe(true)}
              className="btn-secondary text-sm"
            >
              📊 Reportar Esfuerzo (RPE)
            </button>
          )}
          <button
            onClick={generateRoutine}
            disabled={generating}
            className="btn-primary text-sm"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                Generando...
              </span>
            ) : (
              <>⚡ {routine ? 'Nueva Rutina' : 'Generar Rutina'}</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* RPE Widget */}
      {showRpe && (
        <div className="card mb-6 animate-slide-up">
          <h3 className="font-display font-bold text-white mb-2">¿Qué tan difícil fue el entrenamiento?</h3>
          <p className="text-slate-400 text-xs mb-4">Escala RPE (Rate of Perceived Exertion) del 1 al 10. Tu respuesta ajustará la intensidad futura.</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <button
                key={n}
                onClick={() => submitRpe(n)}
                className={`${rpeColors[n]} aspect-square rounded-2xl text-white font-bold text-lg hover:scale-110 transition-all duration-200 shadow-lg`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
            <span>😴 Muy fácil</span>
            <span>💀 Límite</span>
          </div>
          <button onClick={() => setShowRpe(false)} className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors">Cancelar</button>
        </div>
      )}

      {rpeSubmitted && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-3 rounded-2xl mb-6 flex items-center gap-2 text-sm animate-fade-in">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ¡Esfuerzo registrado (RPE: {selectedRpe})! {rpeLabels[selectedRpe]}. El algoritmo ajustará tu próxima sesión.
        </div>
      )}

      {!routine ? (
        // Empty State
        <div className="card text-center py-16 animate-fade-in">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">Activa tu entrenamiento científico</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            El algoritmo calculará tu IMC, analizará tu perfil (edad, experiencia, equipamiento) y generará una sesión estructurada con calentamiento, core, bloque principal y vuelta a la calma.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-8">
            {['🔥 Calentamiento', '🛡️ Core & Estabilidad', '⚡ Bloque Principal', '❄️ Vuelta a la Calma'].map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-2xl p-3 text-xs text-slate-400 border border-white/5">
                {item}
              </div>
            ))}
          </div>
          <button onClick={generateRoutine} disabled={generating} className="btn-primary">
            {generating ? 'Analizando tu perfil...' : '⚡ Generar mi Rutina'}
          </button>
        </div>
      ) : (
        <>
          {/* Routine Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="card py-4 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">IMC</p>
              <p className="text-2xl font-bold font-display text-white">{routine.bmi}</p>
              {routine.bmiCategory && BMI_INFO[routine.bmiCategory] && (
                <p className={`text-xs font-semibold mt-1 ${BMI_INFO[routine.bmiCategory].color}`}>
                  {BMI_INFO[routine.bmiCategory].label}
                </p>
              )}
            </div>
            <div className="card py-4 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Duración</p>
              <p className="text-2xl font-bold font-display text-white">{routine.totalDuration}</p>
              <p className="text-xs text-slate-500 mt-1">minutos</p>
            </div>
            <div className="card py-4 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Ejercicios</p>
              <p className="text-2xl font-bold font-display text-white">{(routine.main || []).length}</p>
              <p className="text-xs text-slate-500 mt-1">en bloque principal</p>
            </div>
            <div className="card py-4 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Fases</p>
              <p className="text-2xl font-bold font-display text-white">4</p>
              <p className="text-xs text-slate-500 mt-1">calentamiento → core → principal → calma</p>
            </div>
          </div>

          {/* Training Type Banner */}
          {routine.trainingType && (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <div className="p-2 bg-green-500/20 rounded-xl flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-green-400 font-bold text-sm">{routine.trainingType}</p>
                {routine.bmiCategory && BMI_INFO[routine.bmiCategory] && (
                  <p className="text-slate-400 text-xs mt-0.5">{BMI_INFO[routine.bmiCategory].desc}</p>
                )}
              </div>
            </div>
          )}

          {/* Progressive Overload Note */}
          {routine.notes && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 mb-6 text-purple-300 text-sm">
              {routine.notes}
            </div>
          )}

          {/* Exercise Phases */}
          {routine.warmup?.length > 0 && (
            <PhaseSection title="🔥 Calentamiento (8-10 min) — Movilidad Dinámica" phase="warmup" exercises={routine.warmup} />
          )}
          {routine.core?.length > 0 && (
            <PhaseSection title="🛡️ Core & Estabilidad (5 min) — Activación Lumbar" phase="core" exercises={routine.core} />
          )}
          {routine.main?.length > 0 && (
            <PhaseSection title="⚡ Bloque Principal" phase="main" exercises={routine.main} />
          )}
          {routine.cooldown?.length > 0 && (
            <PhaseSection title="❄️ Vuelta a la Calma (8-10 min) — Estiramientos Suaves" phase="cooldown" exercises={routine.cooldown} />
          )}
        </>
      )}
    </div>
  );
};

export default Routine;
