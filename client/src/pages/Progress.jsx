import { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell
} from 'recharts';

const Progress = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('evolución');
  const [photoSlider, setPhotoSlider] = useState(50);

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
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-xl font-display font-black text-neon-green">
            {payload[0].value} <span className="text-xs">min</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-pulse">
        <div className="h-20 w-3/4 bg-slate-800 rounded-3xl"></div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[400px] bg-slate-800 rounded-[2rem]"></div>
          <div className="h-[400px] bg-slate-800 rounded-[2rem]"></div>
        </div>
      </div>
    );
  }

  const chartData = stats?.dailyStats ?
    Object.entries(stats.dailyStats).map(([day, minutes]) => ({ day, minutes }))
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-24">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-10 bg-neon-blue rounded-full shadow-glow-blue"></div>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white">
            MI <span className="text-neon-blue">PROGRESO</span>
          </h1>
        </div>
        <p className="text-slate-400 font-medium text-lg max-w-2xl ml-5">
          Visualiza tus logros, analiza tus debilidades y celebra cada pequeño avance en tu camino.
        </p>
      </header>

      {/* Tabs / Navigation */}
      <div className="overflow-x-auto pb-6 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 p-2 bg-slate-900/40 rounded-[1.5rem] border border-white/5 backdrop-blur-2xl w-fit whitespace-nowrap shadow-inner">
          {['evolución', 'historial', 'fotos'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-3 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 scale-95 hover:scale-100 ${activeTab === tab
                ? 'bg-neon-blue text-black shadow-[0_0_25px_rgba(0,204,255,0.4)]'
                : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'evolución' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart Card */}
          <div className="card-premium lg:col-span-2 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-neon-blue/5 rounded-full blur-[80px]"></div>
            <div className="flex justify-between items-center mb-12 relative z-10">
              <div>
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest leading-none">Actividad Semanal</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 ml-1">Análisis de intensidad diaria</p>
              </div>
              <div className="text-neon-blue text-[10px] font-black bg-neon-blue/10 px-4 py-2 rounded-xl border border-neon-blue/20 shadow-glow-blue/10 uppercase tracking-widest">
                +15% ESTE MES
              </div>
            </div>

            <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.length > 0 ? chartData : [
                  { day: 'Lun', minutes: 45 }, { day: 'Mar', minutes: 60 }, { day: 'Mié', minutes: 15 },
                  { day: 'Jue', minutes: 55 }, { day: 'Vie', minutes: 90 }, { day: 'Sáb', minutes: 40 }, { day: 'Dom', minutes: 10 }
                ]}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ccff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00ccff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                    dy={15}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#00ccff', strokeWidth: 2, strokeDasharray: '6 6' }} />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="#00ccff"
                    strokeWidth={5}
                    fillOpacity={1}
                    fill="url(#colorMinutes)"
                    animationDuration={2500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats Column */}
          <div className="space-y-8">
            <div className="card-premium group bg-gradient-to-br from-neon-green/5 to-transparent border-neon-green/10 h-full flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-neon-green font-black uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-glow-green"></div>
                  Sesiones Totales
                </div>
                <div className="stat-value text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{stats?.totalWorkouts || 0}</div>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 shadow-xl overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                  </div>)}
                </div>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Atletas activos</span>
              </div>
            </div>

            <div className="card-premium group bg-gradient-to-br from-neon-orange/5 to-transparent border-neon-orange/10 h-full flex flex-col justify-between overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-neon-orange/5 rounded-full blur-3xl"></div>
              <div>
                <div className="text-[10px] text-neon-orange font-black uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-neon-orange rounded-full shadow-glow-orange animate-pulse"></div>
                  Racha actual
                </div>
                <div className="stat-value text-white drop-shadow-[0_0_15px_rgba(255,102,0,0.1)]">{stats?.streak || 12}</div>
              </div>
              <div className="mt-8 flex items-center gap-3 text-neon-orange font-black text-[11px] uppercase tracking-widest italic group-hover:translate-x-1 transition-transform">
                <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.4503-.43l-7 5A1 1 0 004 8.2v7a1 1 0 001 1h10a1 1 0 001-1V8.3l-2.605-5.747z" clipRule="evenodd" />
                </svg>
                Bestia Imparable
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="grid gap-6">
          {workouts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((w, i) => (
                <div key={i} className="card group hover:border-neon-blue/30">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-neon-blue uppercase tracking-widest bg-neon-blue/10 px-3 py-1 rounded-full">{w.type}</span>
                    <span className="text-[10px] font-bold text-slate-500">{new Date(w.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-white font-bold h-12 line-clamp-2 mb-6">{w.notes || 'SIn notas registradas'}</p>
                  <div className="flex items-end justify-between border-t border-white/5 pt-6">
                    <div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Duración</div>
                      <div className="text-2xl font-display font-black text-white">{w.duration}<span className="text-xs ml-1 text-slate-500">min</span></div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 group-hover:text-neon-blue transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 mb-6 border border-white/5">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-black text-white uppercase mb-2">Sin actividad aún</h3>
              <p className="text-slate-500">Registra tu primer entrenamiento para empezar a ver datos.</p>
              <button className="btn-primary mt-8 py-3 !px-10">REGISTRAR AHORA</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'fotos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none">
              VISUALIZA EL <br />
              <span className="text-neon-orange">CAMBIO RADICAL</span>
            </h2>
            <p className="text-slate-400 text-lg ml-2">
              Sube tus fotos de progreso y utiliza nuestro potente comparador para ver cómo tu cuerpo se transforma día a día. La disciplina se ve en el espejo.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="btn-primary !bg-neon-orange !shadow-neon-orange/20 !text-white flex-1 hover:scale-105">SUBIR ANTES</button>
              <button className="btn-primary !bg-white/5 !text-white !border-white/10 flex-1 hover:bg-white/10">SUBIR DESPUÉS</button>
            </div>
          </div>

          <div className="card p-4 overflow-hidden group shadow-glow-orange border-neon-orange/20">
            <div className="relative aspect-[4/5] md:aspect-square rounded-[1.5rem] overflow-hidden cursor-ew-resize select-none">
              {/* After Image */}
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
                alt="Después"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before Image (Clipped) */}
              <div
                className="absolute inset-0 w-full h-full border-r-[3px] border-neon-orange z-10"
                style={{ clipPath: `inset(0 ${100 - photoSlider}% 0 0)` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1541534741688-6078c64b52de?q=80&w=1471&auto=format&fit=crop"
                  alt="Antes"
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-75"
                />
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={photoSlider}
                onChange={(e) => setPhotoSlider(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
              />

              {/* Handle UI */}
              <div
                className="absolute top-0 bottom-0 min-w-[3px] bg-neon-orange z-20 pointer-events-none shadow-glow-orange"
                style={{ left: `${photoSlider}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-neon-orange rounded-full flex items-center justify-center shadow-2xl border-[4px] border-slate-950">
                  <svg className="w-6 h-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M8 7l-4 4m0 0l4 4m-4-4h16m-4-12l4 4m0 0l-4 4m4-4H4" />
                  </svg>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-6 left-6 z-30 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10">ENERO 2026</div>
              <div className="absolute bottom-6 right-6 z-30 bg-neon-orange/80 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-black text-slate-950 uppercase tracking-widest border border-white/20">AHORA</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
