import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'fuerza',
    duration: 30,
    notes: ''
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
      setFormData({ type: 'fuerza', duration: 30, notes: '' });
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mi Progreso</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancelar' : 'Registrar Entrenamiento'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Registrar Entrenamiento</h2>
          <form onSubmit={logWorkout} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Tipo</label>
                <select
                  className="input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="fuerza">Fuerza</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibilidad">Flexibilidad</option>
                  <option value="funcional">Funcional</option>
                </select>
              </div>
              <div>
                <label className="label">Duración (minutos)</label>
                <input
                  type="number"
                  className="input"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  min="5"
                  max="180"
                />
              </div>
            </div>
            <div>
              <label className="label">Notas (opcional)</label>
              <textarea
                className="input resize-none"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="¿Cómo te sentiste?"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Esta Semana (minutos)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="minutes" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Historial</h2>
        {workouts.length > 0 ? (
          <div className="space-y-3">
            {workouts.map((workout, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{typeLabels[workout.type]}</div>
                  <div className="text-sm text-slate-400">
                    {new Date(workout.date).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {workout.notes && (
                    <div className="text-sm text-slate-500 mt-1">{workout.notes}</div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-semibold">{workout.duration}</span>
                  <span className="text-slate-400 text-sm ml-1">min</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            No hay entrenamientos registrados
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
