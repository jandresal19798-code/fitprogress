import { useState, useEffect } from 'react';
import { api } from '../services/api';

const Routine = () => {
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'fuerza',
    intensity: 'principiante'
  });

  useEffect(() => {
    loadRoutine();
  }, []);

  const loadRoutine = async () => {
    try {
      const res = await api.get('/routines');
      if (res.data) setRoutine(res.data);
    } catch (err) {
      // No hay rutina aún
    }
  };

  const generateRoutine = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/routines/generate', formData);
      setRoutine(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const intensityColors = {
    principiante: 'bg-green-500/10 text-green-400 border-green-500/20',
    intermedio: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    avanzado: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const typeLabels = {
    fuerza: 'Fuerza',
    cardio: 'Cardio',
    flexibilidad: 'Flexibilidad',
    funcional: 'Funcional'
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mi Rutina</h1>
          <p className="text-slate-400">Diseña y sigue tu plan de entrenamiento</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Generar Nueva
            </h2>
            <form onSubmit={generateRoutine} className="space-y-4">
              <div>
                <label className="label">Tipo de Entrenamiento</label>
                <div className="relative">
                  <select
                    className="input appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="fuerza">Fuerza</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibilidad">Flexibilidad</option>
                    <option value="funcional">Funcional</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="label">Intensidad</label>
                <div className="relative">
                  <select
                    className="input appearance-none"
                    value={formData.intensity}
                    onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full btn-primary mt-2" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generando...
                  </div>
                ) : 'Generar Plan'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {routine ? (
            <div className="space-y-6">
              <div className="card border-l-4 border-l-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{typeLabels[routine.type]}</h2>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${intensityColors[routine.intensity || 'principiante']}`}>
                        {(routine.intensity || 'principiante').charAt(0).toUpperCase() + (routine.intensity || 'principiante').slice(1)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                        {routine.exercises.length} ejercicios
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-slate-400 text-sm">
                    Creada el {new Date(routine.generatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {routine.exercises.map((exercise, index) => {
                  // Determine icon based on exercise name
                  let iconPath = "M4 6h16M4 12h16M4 18h16"; // default list icon
                  const nameLower = exercise.name.toLowerCase();

                  if (nameLower.includes('flexion') || nameLower.includes('press') || nameLower.includes('push')) {
                    // Arm/Chest icon
                    iconPath = "M13 10V3L4 14h7v7l9-11h-7z";
                  } else if (nameLower.includes('sentadilla') || nameLower.includes('zancada') || nameLower.includes('pierna')) {
                    // Leg icon
                    iconPath = "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z";
                  } else if (nameLower.includes('plancha') || nameLower.includes('abdominal')) {
                    // Core icon
                    iconPath = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
                  } else if (nameLower.includes('salt') || nameLower.includes('carrera') || nameLower.includes('burpee')) {
                    // Cardio icon
                    iconPath = "M13 10V3L4 14h7v7l9-11h-7z";
                  }

                  return (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:border-green-500/30 transition-all duration-300 transform hover:-translate-x-1"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-slate-700">
                          {exercise.image ? (
                            <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-500">
                              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-0 right-0 bg-slate-900/80 text-white text-[10px] px-1.5 py-0.5 rounded-bl-lg font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-100 text-lg group-hover:text-green-400 transition-colors">{exercise.name}</h3>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Técnica</span>
                              <p className="text-xs text-slate-400">Espalda recta, movimiento controlado</p>
                            </div>
                            {exercise.youtubeLink && (
                              <a
                                href={exercise.youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                Ver tutorial
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400 leading-none">{exercise.sets}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Series</div>
                        <div className="text-sm font-semibold text-white bg-slate-700 px-2 py-1 rounded inline-block">x {exercise.reps}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card bg-gradient-to-r from-slate-800 to-slate-800/50 border-slate-700/50 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">¿Listo para entrenar?</h3>
                    <p className="text-slate-400 text-sm">Registra tu progreso al finalizar</p>
                  </div>
                  <button className="btn-primary animate-pulse-slow">
                    Comenzar Entrenamiento
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card py-16 text-center border-dashed border-2 border-slate-700 bg-transparent">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sin rutina activa</h3>
              <p className="text-slate-400 max-w-sm mx-auto mb-6">
                Genera un plan de entrenamiento personalizado usando el panel lateral para comenzar tu transformación.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Routine;
