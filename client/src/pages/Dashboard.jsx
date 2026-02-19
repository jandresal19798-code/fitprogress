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
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Hola, {user?.name}
          </h1>
          <p className="text-slate-400 mt-1">Vamos a entrenar hoy?</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-sm text-slate-400">Última sesión</div>
          <div className="font-semibold text-slate-200">
            {stats?.lastWorkout ? new Date(stats.lastWorkout).toLocaleDateString() : 'Sin actividad'}
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="text-slate-400 text-sm font-medium mb-1">Entrenamientos</div>
          <div className="text-4xl font-bold text-white mb-2">{stats?.totalWorkouts || 0}</div>
          <div className="text-green-400 text-xs font-medium bg-green-500/10 inline-block px-2 py-1 rounded-full">
            Esta semana
          </div>
        </div>

        <div className="card group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-slate-400 text-sm font-medium mb-1">Minutos Totales</div>
          <div className="text-4xl font-bold text-white mb-2">{stats?.totalMinutes || 0}</div>
          <div className="text-blue-400 text-xs font-medium bg-blue-500/10 inline-block px-2 py-1 rounded-full">
            Tiempo activo
          </div>
        </div>

        <div className="card group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-slate-400 text-sm font-medium mb-1">Objetivo Actual</div>
          <div className="text-2xl font-bold text-white mb-2 truncate">{goalLabels[user?.goal]}</div>
          <div className="text-purple-400 text-xs font-medium bg-purple-500/10 inline-block px-2 py-1 rounded-full">
            En progreso
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Form */}
        <div className="card h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-700/50 rounded-lg text-green-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Mi Perfil</h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="label">Edad</label>
                <input
                  type="number"
                  className="input"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  placeholder="25"
                />
              </div>
              <div>
                <label className="label">Peso (kg)</label>
                <input
                  type="number"
                  className="input"
                  value={profileData.weight}
                  onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                  placeholder="70"
                />
              </div>
            </div>
            <div>
              <label className="label">Objetivo</label>
              <select
                className="input"
                value={profileData.goal}
                onChange={(e) => setProfileData({ ...profileData, goal: e.target.value })}
              >
                <option value="perder_peso">Perder Peso</option>
                <option value="ganar_musculo">Ganar Músculo</option>
                <option value="mantener">Mantener</option>
                <option value="resistencia">Resistencia</option>
              </select>
            </div>
            <button type="submit" className="w-full btn-primary mt-2" disabled={saving}>
              {saving ? 'Guardando...' : 'Actualizar Perfil'}
            </button>
          </form>
        </div>

        {/* Quick Actions & Weekly Stats */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-700/50 rounded-lg text-blue-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Acciones Rápidas</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/routine')}
                className="p-4 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 hover:border-green-500/50 transition-all group text-left"
              >
                <div className="mb-2 text-green-400 group-hover:scale-110 transition-transform origin-left">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="font-semibold text-white">Nueva Rutina</div>
                <div className="text-xs text-slate-400 mt-1">Generar plan personalizado</div>
              </button>

              <button
                onClick={() => navigate('/progress')}
                className="p-4 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 hover:border-blue-500/50 transition-all group text-left"
              >
                <div className="mb-2 text-blue-400 group-hover:scale-110 transition-transform origin-left">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="font-semibold text-white">Ver Progreso</div>
                <div className="text-xs text-slate-400 mt-1">Analizar estadísticas</div>
              </button>
            </div>
          </div>

          {stats?.dailyStats && Object.keys(stats.dailyStats).length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-white">Actividad Semanal</h2>
              <div className="flex gap-2 justify-between items-end h-24">
                {Object.entries(stats.dailyStats).map(([day, minutes]) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-slate-700/50 rounded-t-lg relative flex-1">
                      <div
                        className="absolute bottom-0 w-full bg-green-500/80 rounded-t-lg transition-all duration-500 group-hover:bg-green-400"
                        style={{ height: `${Math.min(minutes / 2, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{day}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
