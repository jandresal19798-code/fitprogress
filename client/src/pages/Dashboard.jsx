import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [profileData, setProfileData] = useState({
    age: user?.age || '',
    weight: user?.weight || '',
    goal: user?.goal || 'mantener'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get('/workouts/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        age: Number(profileData.age),
        weight: Number(profileData.weight),
        goal: profileData.goal
      });
      updateUser(res.data);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const goalLabels = {
    perder_peso: 'Perder Peso',
    ganar_musculo: 'Ganar Músculo',
    mantener: 'Mantener',
    resistencia: 'Resistencia'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bienvenido, {user?.name}</h1>
      
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="text-slate-400 text-sm">Entrenamientos esta semana</div>
          <div className="text-3xl font-bold text-green-500">{stats?.totalWorkouts || 0}</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm">Minutos totales</div>
          <div className="text-3xl font-bold text-blue-500">{stats?.totalMinutes || 0}</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm">Objetivo</div>
          <div className="text-xl font-semibold">{goalLabels[user?.goal]}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Mi Perfil</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Edad</label>
                <input
                  type="number"
                  className="input"
                  value={profileData.age}
                  onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                />
              </div>
              <div>
                <label className="label">Peso (kg)</label>
                <input
                  type="number"
                  className="input"
                  value={profileData.weight}
                  onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="label">Objetivo</label>
              <select
                className="input"
                value={profileData.goal}
                onChange={(e) => setProfileData({...profileData, goal: e.target.value})}
              >
                <option value="perder_peso">Perder Peso</option>
                <option value="ganar_musculo">Ganar Músculo</option>
                <option value="mantener">Mantener</option>
                <option value="resistencia">Resistencia</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Actualizar Perfil'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/routine')}
              className="w-full btn-primary"
            >
              Generar Nueva Rutina
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="w-full btn-secondary"
            >
              Ver Progreso
            </button>
          </div>
        </div>
      </div>

      {stats?.dailyStats && Object.keys(stats.dailyStats).length > 0 && (
        <div className="card mt-6">
          <h2 className="text-lg font-semibold mb-4">Esta Semana</h2>
          <div className="flex gap-2">
            {Object.entries(stats.dailyStats).map(([day, minutes]) => (
              <div key={day} className="flex-1 text-center">
                <div className="text-xs text-slate-400 mb-1">{day}</div>
                <div className="bg-green-500/20 text-green-400 rounded-lg py-2">
                  {minutes} min
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
