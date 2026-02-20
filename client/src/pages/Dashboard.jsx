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
  const [calc1RM, setCalc1RM] = useState({ weight: '', reps: '' });
  const [result1RM, setResult1RM] = useState(null);

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

  const calculate1RM = (e) => {
    e.preventDefault();
    const w = parseFloat(calc1RM.weight);
    const r = parseFloat(calc1RM.reps);
    if (w && r) {
      // Epley Formula
      const res = w * (1 + r / 30);
      setResult1RM(res.toFixed(1));
    }
  };

  const goalLabels = {
    perder_peso: 'Perder Peso',
    ganar_musculo: 'Ganar Músculo',
    mantener: 'Mantener',
    resistencia: 'Resistencia'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-24">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-neon-green rounded-full shadow-glow-green"></div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white">
              HOLA, <span className="text-neon-green">{user?.name?.toUpperCase()}</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium text-lg ml-5">Hoy es un gran día para superar tus límites.</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-orange/10 flex items-center justify-center text-neon-orange">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Último entrenamiento</div>
            <div className="text-white font-bold">
              {stats?.lastWorkout ? new Date(stats.lastWorkout).toLocaleDateString() : '¡COMIENZA HOY!'}
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => navigate('/routine')}
          className="card !p-6 flex flex-col items-center justify-center gap-4 group hover:border-neon-green/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-neon-green/10 flex items-center justify-center text-neon-green group-hover:scale-110 transition-transform shadow-glow-green/5">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Nueva Rutina</span>
        </button>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-new-workout'))}
          className="card !p-6 flex flex-col items-center justify-center gap-4 group hover:border-neon-blue/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform shadow-glow-blue/5">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Log Sesión</span>
        </button>

        <button
          onClick={() => navigate('/progress')}
          className="card !p-6 flex flex-col items-center justify-center gap-4 group hover:border-neon-orange/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-neon-orange/10 flex items-center justify-center text-neon-orange group-hover:scale-110 transition-transform shadow-glow-orange/5">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Mis Números</span>
        </button>

        <button
          onClick={() => navigate('/planning')}
          className="card !p-6 flex flex-col items-center justify-center gap-4 group hover:border-neon-pink/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-neon-pink/10 flex items-center justify-center text-neon-pink group-hover:scale-110 transition-transform shadow-glow-pink/5">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Calendario</span>
        </button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card group border-l-4 border-l-neon-green">
          <div className="flex justify-between items-start mb-6">
            <div className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">Sesiones Totales</div>
            <div className="w-10 h-10 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats?.totalWorkouts || 0}</div>
          <div className="mt-4 flex items-center gap-2 text-neon-green text-sm font-bold">
            <span className="flex h-2 w-2 rounded-full bg-neon-green animate-pulse"></span>
            En racha activa
          </div>
        </div>

        <div className="card group border-l-4 border-l-neon-blue">
          <div className="flex justify-between items-start mb-6">
            <div className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">Minutos Activos</div>
            <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats?.totalMinutes || 0}</div>
          <div className="mt-4 flex items-center gap-2 text-neon-blue text-sm font-bold">
            Entrenamiento constante
          </div>
        </div>

        <div className="card group border-l-4 border-l-neon-orange">
          <div className="flex justify-between items-start mb-6">
            <div className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">Meta Actual</div>
            <div className="w-10 h-10 rounded-full bg-neon-orange/10 flex items-center justify-center text-neon-orange group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-display font-black text-white leading-tight uppercase tracking-tighter">
            {user?.goal ? goalLabels[user.goal] : 'SIN DEFINIR'}
          </div>
          <div className="mt-4 text-neon-orange text-sm font-bold uppercase tracking-widest">
            {stats?.completedPercentage || 65}% Completado
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Profile Update */}
        <div className="card md:col-span-1 lg:col-span-1">
          <h2 className="text-xl font-display font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-neon-green shadow-glow-green"></span>
            Mi Estado
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label">Edad</label>
                <input
                  type="number"
                  className="input !py-3 !px-4"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="label">Peso (kg)</label>
                <input
                  type="number"
                  className="input !py-3 !px-4"
                  value={profileData.weight}
                  onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="label">Objetivo Primario</label>
              <select
                className="input !py-3 !px-4 appearance-none"
                value={profileData.goal}
                onChange={(e) => setProfileData({ ...profileData, goal: e.target.value })}
              >
                <option value="perder_peso">Quemar Grasa</option>
                <option value="ganar_musculo">Hipertrofia</option>
                <option value="mantener">Mantenimiento</option>
                <option value="resistencia">Resistencia</option>
              </select>
            </div>
            <button type="submit" className="w-full btn-primary" disabled={saving}>
              {saving ? 'GUARDANDO...' : 'ACTUALIZAR DATOS'}
            </button>
          </form>
        </div>

        {/* 1RM Calculator Widget */}
        <div className="card lg:col-span-1 overflow-hidden relative border-t-4 border-t-neon-blue">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl shadow-glow-blue"></div>
          <h2 className="text-xl font-display font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-neon-blue shadow-glow-blue"></span>
            Calculadora 1RM
          </h2>
          <form onSubmit={calculate1RM} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label">Peso (kg)</label>
                <input
                  type="number"
                  className="input !py-3 !px-4"
                  placeholder="80"
                  value={calc1RM.weight}
                  onChange={(e) => setCalc1RM({ ...calc1RM, weight: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="label">Reps</label>
                <input
                  type="number"
                  className="input !py-3 !px-4"
                  placeholder="5"
                  value={calc1RM.reps}
                  onChange={(e) => setCalc1RM({ ...calc1RM, reps: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-neon-blue font-black py-3 rounded-2xl transition-all border border-white/5 hover:border-neon-blue/30 uppercase tracking-widest text-sm">
              Calcular Máximo
            </button>
            {result1RM && (
              <div className="p-4 bg-neon-blue/10 rounded-2xl border border-neon-blue/20 text-center animate-bounce-subtle">
                <div className="text-[10px] text-neon-blue font-black uppercase tracking-widest mb-1">Tu 1RM Estimado</div>
                <div className="text-3xl font-display font-black text-white">{result1RM} <span className="text-sm">kg</span></div>
              </div>
            )}
          </form>
        </div>

        {/* Weekly Progress Skeleton/Placeholder */}
        <div className="card lg:col-span-1">
          <h2 className="text-xl font-display font-black text-white uppercase tracking-widest mb-8">
            Actividad Semanal
          </h2>
          <div className="space-y-6">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-5 text-[10px] font-black text-slate-500">{day}</div>
                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-1000"
                    style={{ width: `${60 + Math.random() * 40}%`, opacity: i > 4 ? 0.3 : 1 }}
                  ></div>
                </div>
                <div className="w-8 text-[10px] font-bold text-white text-right">60m</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

