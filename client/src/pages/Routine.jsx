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
    principiante: 'bg-green-500/20 text-green-400',
    intermedio: 'bg-yellow-500/20 text-yellow-400',
    avanzado: 'bg-red-500/20 text-red-400'
  };

  const typeLabels = {
    fuerza: 'Fuerza',
    cardio: 'Cardio',
    flexibilidad: 'Flexibilidad',
    funcional: 'Funcional'
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mi Rutina</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Generar Nueva Rutina</h2>
        <form onSubmit={generateRoutine} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="label">Tipo de Entrenamiento</label>
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
          <div className="flex-1 min-w-[150px]">
            <label className="label">Intensidad</label>
            <select
              className="input"
              value={formData.intensity}
              onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Generando...' : 'Generar'}
          </button>
        </form>
      </div>

      {routine && (
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">{typeLabels[routine.type]}</h2>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${intensityColors[routine.intensity]}`}>
                {routine.intensity.charAt(0).toUpperCase() + routine.intensity.slice(1)}
              </span>
            </div>
            <div className="text-right text-slate-400">
              <div>{routine.exercises.length} ejercicios</div>
            </div>
          </div>

          <div className="space-y-3">
            {routine.exercises.map((exercise, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-green-500/20 text-green-400 rounded-full text-sm">
                    {index + 1}
                  </span>
                  <span className="font-medium">{exercise.name}</span>
                </div>
                <div className="text-right text-slate-400">
                  <span className="text-sm">{exercise.sets} series</span>
                  <span className="mx-2">×</span>
                  <span className="text-sm">{exercise.reps}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!routine && (
        <div className="card text-center py-12">
          <div className="text-slate-400 mb-4">
            No tienes una rutina asignada todavía
          </div>
          <p className="text-sm text-slate-500">
            Genera tu primera rutina personalizada arriba
          </p>
        </div>
      )}
    </div>
  );
};

export default Routine;
