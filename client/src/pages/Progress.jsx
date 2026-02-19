import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Progress = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'fuerza',
    duration: 30,
    notes: '',
    intensity: 'media',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [workoutsRes, statsRes] = await Promise.all([
        api.get('/workouts'),
        api.get('/workouts/stats')
      ]);
      setWorkouts(workoutsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const logWorkout = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/workouts', formData);
      setFormData({ type: 'fuerza', duration: 30, notes: '', intensity: 'media' });
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const typeLabels = {
    fuerza: 'Fuerza',
    cardio: 'Cardio',
    flexibilidad: 'Flexibilidad',
    funcional: 'Funcional'
  };

  const chartData = stats?.dailyStats ?
    Object.entries(stats.dailyStats).map(([day, minutes]) => ({ day, minutes }))
    : [];

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mi Progreso</h1>
          <p className="text-slate-400">Rastrea tus logros y mantén la consistencia</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
          {showForm ? 'Cancelar' : 'Registrar Sesión'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="card bg-slate-800/80 border-slate-700/50">
          <div className="text-slate-400 text-sm font-medium mb-1">Total Sesiones</div>
          <div className="text-3xl font-bold text-white mb-1">{stats?.totalWorkouts || 0}</div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Histórico
          </div>
        </div>
        <div className="card bg-slate-800/80 border-slate-700/50">
          <div className="text-slate-400 text-sm font-medium mb-1">Tiempo Total</div>
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {Math.floor((stats?.totalMinutes || 0) / 60)}h {(stats?.totalMinutes || 0) % 60}m
          </div>
          <div className="text-xs text-blue-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Acumulado
          </div>
        </div>
        <div className="card bg-slate-800/80 border-slate-700/50">
          <div className="text-slate-400 text-sm font-medium mb-1">Racha Actual</div>
          <div className="text-3xl font-bold text-purple-400 mb-1">{stats?.streak || 0}</div>
          <div className="text-xs text-purple-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
            Días seguidos
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card mb-8 border-l-4 border-l-green-500 animate-slide-up">
          <h2 className="text-xl font-bold text-white mb-6">Registrar Nuevo Entrenamiento</h2>
          <form onSubmit={logWorkout} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Tipo de Actividad</label>
                <div className="relative">
                  <select
                    className="input appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="fuerza">Fuerza y Pesas</option>
                    <option value="cardio">Cardio / Aeróbico</option>
                    <option value="flexibilidad">Flexibilidad / Yoga</option>
                    <option value="funcional">Entrenamiento Funcional</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="label">Duración (minutos)</label>
                <div className="relative">
                  <input
                    type="number"
                    className="input pr-12"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    min="5"
                    max="180"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 pointer-events-none text-sm">
                    min
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="label">Notas (opcional)</label>
              <textarea
                className="input resize-none h-24"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="¿Cómo te sentiste? ¿Qué ejercicios hiciste?"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary min-w-[120px]" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Sesión'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {chartData.length > 0 && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Actividad Semanal</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-green-500/50"></span> Minutos
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ stroke: '#475569', strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorMinutes)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card h-full">
            <h2 className="text-lg font-semibold mb-6 text-white sticky top-0 bg-slate-800/50 backdrop-blur-sm py-2">Historial Reciente</h2>
            {workouts.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {workouts.map((workout, index) => (
                  <div
                    key={index}
                    className="relative pl-6 pb-2 border-l-2 border-slate-700 last:border-0"
                  >
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-slate-900 ${workout.type === 'fuerza' ? 'bg-green-500' :
                        workout.type === 'cardio' ? 'bg-blue-500' :
                          workout.type === 'funcional' ? 'bg-purple-500' : 'bg-yellow-500'
                      }`}></div>

                    <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${workout.type === 'fuerza' ? 'text-green-400 bg-green-500/10' :
                            workout.type === 'cardio' ? 'text-blue-400 bg-blue-500/10' :
                              workout.type === 'funcional' ? 'text-purple-400 bg-purple-500/10' : 'text-yellow-400 bg-yellow-500/10'
                          }`}>
                          {typeLabels[workout.type]}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {new Date(workout.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="text-slate-300 text-sm line-clamp-2">
                          {workout.notes || 'Entrenamiento completado'}
                        </div>
                        <div className="whitespace-nowrap ml-4">
                          <span className="text-lg font-bold text-white">{workout.duration}</span>
                          <span className="text-xs text-slate-500 ml-1">min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p>No hay historial reciente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
