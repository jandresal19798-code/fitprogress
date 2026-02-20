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
          className="card-premium !p-8 flex flex-col items-center justify-center gap-5 group hover:border-neon-green/40 hover:scale-105 transition-all duration-500"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-neon-green/10 flex items-center justify-center text-neon-green group-hover:bg-neon-green group-hover:text-black transition-all duration-500 shadow-glow-green/10">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] group-hover:text-white transition-colors">Nueva Rutina</span>
        </button>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-new-workout'))}
          className="card-premium !p-8 flex flex-col items-center justify-center gap-5 group hover:border-neon-blue/40 hover:scale-105 transition-all duration-500"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:bg-neon-blue group-hover:text-black transition-all duration-500 shadow-glow-blue/10">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] group-hover:text-white transition-colors">Log Sesión</span>
        </button>

        <button
          onClick={() => navigate('/progress')}
          className="card-premium !p-8 flex flex-col items-center justify-center gap-5 group hover:border-neon-orange/40 hover:scale-105 transition-all duration-500"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-neon-orange/10 flex items-center justify-center text-neon-orange group-hover:bg-neon-orange group-hover:text-black transition-all duration-500 shadow-glow-orange/10">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] group-hover:text-white transition-colors">Mis Números</span>
        </button>

        <button
          onClick={() => navigate('/planning')}
          className="card-premium !p-8 flex flex-col items-center justify-center gap-5 group hover:border-neon-pink/40 hover:scale-105 transition-all duration-500"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-neon-pink/10 flex items-center justify-center text-neon-pink group-hover:bg-neon-pink group-hover:text-white transition-all duration-500 shadow-glow-pink/10">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] group-hover:text-white transition-colors">Calendario</span>
        </button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-premium group border-l-4 border-l-neon-green h-full">
          <div className="flex justify-between items-start mb-8">
            <div className="text-slate-400 font-black text-[12px] uppercase tracking-[0.25em]">Sesiones Totales</div>
            <div className="w-12 h-12 rounded-2xl bg-neon-green/10 flex items-center justify-center text-neon-green group-hover:scale-110 group-hover:shadow-glow-green/20 transition-all duration-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="stat-value text-neon-green drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]">{stats?.totalWorkouts || 0}</div>
          <div className="mt-6 flex items-center gap-3 text-neon-green text-sm font-black uppercase tracking-widest italic">
            <span className="flex h-3 w-3 rounded-full bg-neon-green animate-ping shadow-glow-green"></span>
            En racha activa
          </div>
        </div>

        <div className="card-premium group border-l-4 border-l-neon-blue h-full">
          <div className="flex justify-between items-start mb-8">
            <div className="text-slate-400 font-black text-[12px] uppercase tracking-[0.25em]">Minutos Activos</div>
            <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:scale-110 group-hover:shadow-glow-blue/20 transition-all duration-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <div className="stat-value text-neon-blue drop-shadow-[0_0_15px_rgba(0,204,255,0.3)]">{stats?.totalMinutes || 0}</div>
          <div className="mt-6 flex items-center gap-3 text-neon-blue text-sm font-black uppercase tracking-widest italic">
            Entrenamiento constante
          </div>
        </div>

        <div className="card-premium group border-l-4 border-l-neon-orange h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          </div>
          <div className="flex justify-between items-start mb-8">
            <div className="text-slate-400 font-black text-[12px] uppercase tracking-[0.25em]">Meta Actual</div>
            <div className="w-12 h-12 rounded-2xl bg-neon-orange/10 flex items-center justify-center text-neon-orange group-hover:scale-110 group-hover:shadow-glow-orange/20 transition-all duration-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl md:text-5xl font-display font-black text-white leading-tight uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(255,102,0,0.2)]">
            {user?.goal ? goalLabels[user.goal] : 'SIN DEFINIR'}
          </div>
          <div className="mt-6 text-neon-orange text-sm font-black uppercase tracking-widest flex items-center gap-3 italic">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-neon-orange shadow-glow-orange" style={{ width: `${stats?.completedPercentage || 65}%` }}></div>
            </div>
            {stats?.completedPercentage || 65}%
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

