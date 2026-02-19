import { useState, useEffect } from 'react';
import { api } from '../services/api';

// ── HELPERS ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const colorMap = {
    green: { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400', badge: 'bg-green-500/20' },
    blue: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20' },
    orange: { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20' },
    purple: { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20' },
    slate: { bg: 'bg-slate-800/30', border: 'border-slate-700/30', text: 'text-slate-500', badge: 'bg-slate-700/30' },
};

// ── CALENDAR COMPONENT ───────────────────────────────────────────────────────
const Calendar = ({ completedDays, onToggle, stats, streak }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = today();

    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const completedThisMonth = completedDays.filter(d => d.startsWith(monthKey)).length;

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const cells = [];
    // Empty leading cells
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className="animate-fade-in space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Racha Actual', value: streak, unit: 'días', icon: '🔥', color: 'text-orange-400' },
                    { label: 'Este Mes', value: completedThisMonth, unit: 'sesiones', icon: '📅', color: 'text-green-400' },
                    { label: 'Este Año', value: stats?.yearDays || 0, unit: 'sesiones', icon: '📊', color: 'text-blue-400' },
                    { label: 'Total', value: stats?.totalDays || 0, unit: 'sesiones', icon: '🏆', color: 'text-purple-400' },
                ].map((s, i) => (
                    <div key={i} className="card py-4 text-center">
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Calendar */}
            <div className="card overflow-hidden">
                {/* Month Nav */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="text-center">
                        <h3 className="text-xl font-display font-bold text-white">{MONTHS[month]}</h3>
                        <p className="text-slate-500 text-xs">{year}</p>
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2">
                    {WEEKDAYS.map(d => (
                        <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 py-1">{d}</div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, idx) => {
                        if (!day) return <div key={idx} />;
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isCompleted = completedDays.includes(dateStr);
                        const isToday = dateStr === todayStr;
                        const isFuture = dateStr > todayStr;

                        return (
                            <button
                                key={idx}
                                onClick={() => !isFuture && onToggle(dateStr)}
                                disabled={isFuture}
                                className={`
                  relative aspect-square rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center transition-all duration-200
                  ${isFuture ? 'opacity-25 cursor-not-allowed text-slate-600' : 'hover:scale-110 cursor-pointer'}
                  ${isCompleted
                                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                                        : isToday
                                            ? 'bg-green-500/10 border-2 border-green-500 text-green-400'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
                                title={isCompleted ? 'Clic para desmarcar' : isFuture ? 'Día futuro' : 'Clic para marcar como completado'}
                            >
                                {day}
                                {isCompleted && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full"></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 justify-center flex-wrap">
                    {[
                        { color: 'bg-green-500', label: 'Completado' },
                        { color: 'bg-green-500/10 border border-green-500', label: 'Hoy' },
                        { color: 'bg-slate-700', label: 'Incompleto' },
                    ].map((l, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                            <div className={`w-3 h-3 rounded-md ${l.color}`}></div>
                            {l.label}
                        </div>
                    ))}
                </div>
            </div>

            {streak >= 3 && (
                <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                    <p className="text-orange-400 font-bold">🔥 ¡{streak} días de racha! {streak >= 7 ? '¡Semana completa! 🏆' : streak >= 14 ? '¡Dos semanas! 🚀' : 'Seguí así.'}</p>
                    <p className="text-slate-400 text-xs mt-1">La consistencia supera a la intensidad. ¡No rompas la cadena!</p>
                </div>
            )}
        </div>
    );
};

// ── WEEKLY PLAN ───────────────────────────────────────────────────────────────
const WeeklyPlan = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/plan/weekly').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div></div>;
    if (!data) return null;

    const colors = { green: colorMap.green, slate: colorMap.slate, blue: colorMap.blue };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="card bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="font-display font-bold text-white text-lg">Plan Semanal Adaptativo</h3>
                        <p className="text-slate-400 text-xs mt-0.5">{data.totalTraining} días de entrenamiento · Basado en tu perfil</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold capitalize">{data.experienceLevel}</span>
                        <span className="text-xs bg-slate-700/60 text-slate-300 px-3 py-1 rounded-full font-semibold capitalize">{data.goal?.replace('_', ' ')}</span>
                    </div>
                </div>
                {data.config?.note && (
                    <p className="text-slate-400 text-xs mt-3 pt-3 border-t border-white/5">💡 {data.config.note}</p>
                )}
            </div>

            {/* 7-day grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {data.schedule?.map((day, i) => {
                    const c = colorMap[day.color] || colorMap.slate;
                    return (
                        <div key={i} className={`rounded-2xl p-4 border transition-all duration-200 hover:-translate-y-0.5 ${c.bg} ${c.border}`}>
                            <div className="flex items-start justify-between mb-3">
                                <p className={`font-display font-bold text-sm ${c.text}`}>{day.day}</p>
                                {day.isTraining
                                    ? <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">ENTRENO</span>
                                    : <span className="text-[10px] bg-slate-700/60 text-slate-500 px-2 py-0.5 rounded-full font-bold">DESCANSO</span>
                                }
                            </div>
                            <p className="text-white font-semibold text-sm mb-1">{day.focus}</p>
                            {day.intensity && (
                                <p className={`text-xs font-medium ${c.text}`}>RPE: {day.intensity}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            <p className="text-center text-slate-500 text-xs">📌 Este plan se adapta a tu nivel de experiencia y objetivo. Genera tu rutina del día en la sección "Rutina".</p>
        </div>
    );
};

// ── MONTHLY PLAN ──────────────────────────────────────────────────────────────
const MonthlyPlan = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/plan/monthly').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div></div>;
    if (!data) return null;

    return (
        <div className="animate-fade-in space-y-5">
            <div className="card border-white/5">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📆</span>
                    <div>
                        <h3 className="font-display font-bold text-white">Periodización Mensual — {data.currentMonth}</h3>
                        <p className="text-slate-400 text-xs">{data.completedThisMonth} sesiones completadas este mes</p>
                    </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{data.note}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.weeks?.map((w) => {
                    const c = colorMap[w.color] || colorMap.slate;
                    return (
                        <div key={w.week} className={`rounded-3xl p-6 border ${c.bg} ${c.border} hover:-translate-y-1 transition-all duration-300`}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{w.icon}</span>
                                <div>
                                    <p className={`font-display font-bold text-base ${c.text}`}>Semana {w.week} — {w.phase}</p>
                                    <div className="flex gap-2 mt-1 flex-wrap">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge} ${c.text}`}>Vol: {w.volume}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge} ${c.text}`}>Int: {w.intensity}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge} ${c.text}`}>RPE: {w.rpe}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">{w.focus}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── ANNUAL PLAN ───────────────────────────────────────────────────────────────
const AnnualPlan = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/plan/annual').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div></div>;
    if (!data) return null;

    return (
        <div className="animate-fade-in space-y-5">
            {/* Header */}
            <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="font-display font-bold text-white text-lg">Plan Anual {data.year}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{data.completedThisYear} sesiones completadas · Cuartil activo: {data.currentQuarter}</p>
                </div>
                <div className="flex gap-3">
                    <div className="text-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                        <p className="text-orange-400 font-bold text-lg">🔥 {data.streakRecord}</p>
                        <p className="text-[10px] text-slate-500">Racha máx.</p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 via-slate-700 to-purple-500/50 hidden sm:block"></div>

                <div className="space-y-4">
                    {data.quarters?.map((q, i) => {
                        const c = colorMap[q.color] || colorMap.slate;
                        const isCurrent = q.id === data.currentQuarter;
                        return (
                            <div key={q.id} className={`sm:pl-16 relative animate-fade-in`} style={{ animationDelay: `${i * 100}ms` }}>
                                {/* Timeline dot */}
                                <div className={`absolute left-4 sm:left-4 top-6 w-5 h-5 rounded-full border-2 hidden sm:flex items-center justify-center ${isCurrent ? `border-green-500 bg-green-500 shadow-lg shadow-green-500/40` : `border-slate-700 bg-slate-900`}`}>
                                    {isCurrent && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>

                                <div className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 hover:-translate-y-0.5 ${isCurrent ? `${c.bg} ${c.border} shadow-lg` : 'bg-slate-900/40 border-white/5'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="text-3xl">{q.icon}</span>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`font-display font-black text-sm ${c.text}`}>{q.id}</span>
                                                    {isCurrent && <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">AHORA</span>}
                                                </div>
                                                <p className="text-white font-bold text-sm sm:text-base">{q.phase}</p>
                                                <p className="text-slate-500 text-xs">{q.months}</p>
                                            </div>
                                        </div>
                                        <div className={`text-xs font-semibold ${c.text} ${c.badge} px-3 py-1.5 rounded-xl text-center shrink-0`}>
                                            KPI: {q.kpi}
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-3">{q.objective}</p>

                                    <div className="grid grid-cols-2 gap-2">
                                        {q.focus?.map((f, fi) => (
                                            <div key={fi} className="flex items-start gap-1.5 text-xs text-slate-400">
                                                <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${c.text.replace('text-', 'bg-')}`}></span>
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    <p className={`text-xs mt-3 pt-3 border-t border-white/5 ${c.text}`}>🏋️ {q.training}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ── MAIN PLANNING PAGE ────────────────────────────────────────────────────────
const Planning = () => {
    const [activeTab, setActiveTab] = useState('calendario');
    const [calData, setCalData] = useState({ completedDays: [], stats: {}, currentStreak: 0 });
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        api.get('/plan/calendar')
            .then(r => setCalData(r.data))
            .catch(console.error);
    }, []);

    const handleToggle = async (dateStr) => {
        if (toggling) return;
        setToggling(true);
        try {
            const res = await api.post('/plan/calendar/toggle', { date: dateStr });
            setCalData(prev => ({
                ...prev,
                completedDays: res.data.completedDays,
                currentStreak: res.data.currentStreak,
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setToggling(false);
        }
    };

    const tabs = [
        { id: 'calendario', label: 'Calendario', icon: '📅' },
        { id: 'semanal', label: 'Semanal', icon: '7️⃣' },
        { id: 'mensual', label: 'Mensual', icon: '📆' },
        { id: 'anual', label: 'Anual', icon: '🗓️' },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Planificación</h1>
                <p className="text-slate-400 text-sm mt-1">Organiza tu entrenamiento a corto, mediano y largo plazo</p>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 sm:gap-2 bg-slate-900/60 border border-white/5 rounded-2xl p-1.5 mb-6 sm:mb-8 scrollbar-thin">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === t.id
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
                    >
                        <span>{t.icon}</span>
                        <span className="hidden sm:inline">{t.label}</span>
                        <span className="sm:hidden">{t.label.substring(0, 3)}</span>
                    </button>
                ))}

                {/* Streak badge */}
                {calData.currentStreak > 0 && (
                    <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-xl flex-shrink-0">
                        <span className="text-sm">🔥</span>
                        <span className="text-orange-400 font-bold text-sm">{calData.currentStreak}</span>
                    </div>
                )}
            </div>

            {/* Tab Content */}
            {activeTab === 'calendario' && (
                <Calendar
                    completedDays={calData.completedDays || []}
                    onToggle={handleToggle}
                    stats={calData.stats}
                    streak={calData.currentStreak || 0}
                />
            )}
            {activeTab === 'semanal' && <WeeklyPlan />}
            {activeTab === 'mensual' && <MonthlyPlan />}
            {activeTab === 'anual' && <AnnualPlan />}
        </div>
    );
};

export default Planning;
