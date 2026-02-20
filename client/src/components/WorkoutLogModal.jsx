import { useState, useEffect } from 'react';
import { api } from '../services/api';

const WorkoutLogModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [notes, setNotes] = useState('');
    const [rpe, setRpe] = useState(5);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            fetchCurrentRoutine();
        };
        window.addEventListener('open-new-workout', handleOpen);
        return () => window.removeEventListener('open-new-workout', handleOpen);
    }, []);

    const fetchCurrentRoutine = async () => {
        setLoading(true);
        try {
            const res = await api.get('/routines');
            setRoutine(res.data);
            // Initialize exercises with default sets
            const initialExercises = res.data.main.map(ex => ({
                name: ex.name,
                sets: [{ reps: 10, weight: 0 }]
            }));
            setExercises(initialExercises);
        } catch (err) {
            console.error('Error fetching routine:', err);
        } finally {
            setLoading(false);
        }
    };

    const addSet = (exerciseIndex) => {
        const newExercises = [...exercises];
        const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
        newExercises[exerciseIndex].sets.push({ ...lastSet });
        setExercises(newExercises);
    };

    const removeSet = (exerciseIndex, setIndex) => {
        if (exercises[exerciseIndex].sets.length <= 1) return;
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets.splice(setIndex, 1);
        setExercises(newExercises);
    };

    const updateSet = (exerciseIndex, setIndex, field, value) => {
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets[setIndex][field] = Number(value);
        setExercises(newExercises);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/workouts', {
                type: routine?.trainingType || 'General',
                duration: routine?.totalDuration || 60,
                notes,
                exercises,
                rpe
            });
            setIsOpen(false);
            window.dispatchEvent(new CustomEvent('workout-logged'));
        } catch (err) {
            console.error('Error saving workout:', err);
            alert('Error al guardar la sesión.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-fade-in" onClick={() => setIsOpen(false)}></div>

            <div className="card-premium relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
                    <div>
                        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">REGISTRAR <span className="text-neon-blue">SESIÓN</span></h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Cada repetición cuenta para la gloria</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="btn-icon">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                    {loading ? (
                        <div className="space-y-8 animate-pulse">
                            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl"></div>)}
                        </div>
                    ) : (
                        <>
                            {exercises.map((ex, exIdx) => (
                                <div key={exIdx} className="space-y-6 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue font-black shadow-glow-blue/10 group-hover:bg-neon-blue group-hover:text-black transition-all">
                                            {exIdx + 1}
                                        </div>
                                        <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">{ex.name}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {ex.sets.map((set, setIdx) => (
                                            <div key={setIdx} className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex items-center gap-6 group/set hover:border-white/10 transition-all">
                                                <div className="w-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">SET {setIdx + 1}</div>

                                                <div className="flex-1 grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Reps</label>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white font-bold text-center focus:border-neon-blue outline-none transition-all"
                                                            value={set.reps}
                                                            onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Kg</label>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white font-bold text-center focus:border-neon-blue outline-none transition-all"
                                                            value={set.weight}
                                                            onChange={(e) => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeSet(exIdx, setIdx)}
                                                    className="text-slate-700 hover:text-neon-pink transition-colors p-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addSet(exIdx)}
                                            className="border-2 border-dashed border-white/5 hover:border-neon-blue/30 hover:bg-neon-blue/5 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-neon-blue transition-all font-black text-[10px] uppercase tracking-widest py-8"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            Añadir Serie
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-6 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-neon-orange/10 flex items-center justify-center text-neon-orange font-black shadow-glow-orange/10">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Análisis de Esfuerzo (RPE)</h3>
                                </div>

                                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setRpe(n)}
                                            className={`aspect-square rounded-xl font-black text-lg transition-all ${rpe === n ? 'bg-neon-orange text-black shadow-glow-orange' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] px-1">
                                    <span>Muy Fácil</span>
                                    <span>Máximo Esfuerzo</span>
                                </div>
                            </div>

                            <div className="space-y-4 pb-10">
                                <label className="label">Notas de la sesión</label>
                                <textarea
                                    className="input min-h-[120px] resize-none"
                                    placeholder="¿Cómo te sentiste hoy? ¿Alguna molestia o récord personal?..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-white/5 bg-slate-900/40 flex gap-4">
                    <button
                        disabled={saving}
                        onClick={handleSave}
                        className="btn-primary flex-1 !py-5 shadow-glow-green/20"
                    >
                        {saving ? 'GUARDANDO GLORIA...' : '🏁 FINALIZAR ENTRENAMIENTO'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutLogModal;
