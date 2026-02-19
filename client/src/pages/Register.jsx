import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PAR_Q_QUESTIONS = [
  '¿Tu médico te ha dicho alguna vez que tienes una enfermedad del corazón y que solo debes hacer actividad física bajo supervisión médica?',
  '¿Sientes dolor en el pecho cuando haces actividad física?',
  '¿En el último mes, has sentido dolor en el pecho cuando NO estabas haciendo actividad física?',
  '¿Pierdes el equilibrio debido a mareos, o has perdido el conocimiento alguna vez?',
  '¿Tienes algún problema óseo o articular que empeore con la actividad física?',
  '¿Te está recetando actualmente medicinas para la presión arterial o el corazón?'
];

const Register = () => {
  const [step, setStep] = useState(1); // 1: datos, 2: fitness, 3: parq
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    goal: 'mantener',
    experienceLevel: 'principiante',
    equipment: 'sin_equipo',
    parqPassed: true
  });
  const [parqAnswers, setParqAnswers] = useState(Array(PAR_Q_QUESTIONS.length).fill(false));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleParqChange = (idx, value) => {
    const updated = [...parqAnswers];
    updated[idx] = value;
    setParqAnswers(updated);
  };

  const bmi = formData.weight && formData.height
    ? (Number(formData.weight) / Math.pow(Number(formData.height) / 100, 2)).toFixed(1)
    : null;

  const getBmiLabel = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-yellow-400' };
    return { label: 'Obesidad', color: 'text-red-400' };
  };

  const bmiInfo = getBmiLabel(bmi);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const parqFailed = parqAnswers.some(a => a === true);

    try {
      await register({
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        parqPassed: !parqFailed
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const goals = [
    { value: 'perder_peso', label: '🔥 Perder Peso' },
    { value: 'ganar_musculo', label: '💪 Ganar Músculo' },
    { value: 'mantener', label: '⚖️ Mantener' },
    { value: 'resistencia', label: '🏃 Mejorar Resistencia' }
  ];

  const levels = [
    { value: 'sedentario', label: '😴 Sedentario (sin ejercicio)' },
    { value: 'principiante', label: '🌱 Principiante (0-6 meses)' },
    { value: 'intermedio', label: '⚡ Intermedio (6 meses - 2 años)' },
    { value: 'avanzado', label: '🏆 Avanzado (+2 años)' }
  ];

  const equipment = [
    { value: 'sin_equipo', label: '🏠 Sin equipo (solo cuerpo)' },
    { value: 'mancuernas', label: '🏋️ Mancuernas en casa' },
    { value: 'gimnasio_completo', label: '🏟️ Gimnasio completo' }
  ];

  const stepTitles = ['Datos Personales', 'Perfil Fitness', 'Cuestionario PAR-Q'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-2.5 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-xl shadow-lg shadow-green-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">FitProgress</h1>
          </div>
          <p className="text-slate-400">Comienza tu transformación científica</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepTitles.map((title, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 transition-all duration-300 ${step === idx + 1 ? 'opacity-100' : step > idx + 1 ? 'opacity-60' : 'opacity-30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-green-500/20 border-2 border-green-500 text-green-400' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                  {step > idx + 1 ? '✓' : idx + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === idx + 1 ? 'text-white' : 'text-slate-500'}`}>{title}</span>
              </div>
              {idx < stepTitles.length - 1 && <div className={`w-8 h-px transition-all ${step > idx + 1 ? 'bg-green-500' : 'bg-slate-700'}`}></div>}
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-xl font-display font-bold mb-6 text-white">{stepTitles[step - 1]}</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-4 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {/* STEP 1: Personal Data */}
          {step === 1 && (
            <div className="space-y-4 animate-slide-up">
              <div>
                <label className="label">Nombre Completo</label>
                <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required placeholder="Tu nombre" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} required placeholder="tu@email.com" />
              </div>
              <div>
                <label className="label">Contraseña</label>
                <input type="password" name="password" className="input" value={formData.password} onChange={handleChange} required minLength={6} placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Edad</label>
                  <input type="number" name="age" className="input" value={formData.age} onChange={handleChange} required min="10" max="100" placeholder="25" />
                </div>
                <div>
                  <label className="label">Peso (kg)</label>
                  <input type="number" name="weight" className="input" value={formData.weight} onChange={handleChange} required min="30" max="300" placeholder="70" />
                </div>
                <div>
                  <label className="label">Altura (cm)</label>
                  <input type="number" name="height" className="input" value={formData.height} onChange={handleChange} required min="100" max="250" placeholder="170" />
                </div>
              </div>
              {bmi && bmiInfo && (
                <div className="bg-slate-800/50 rounded-2xl p-3 border border-white/5 text-center animate-fade-in">
                  <p className="text-xs text-slate-400">Tu IMC estimado</p>
                  <p className="text-2xl font-bold font-display text-white">{bmi}</p>
                  <p className={`text-sm font-semibold ${bmiInfo.color}`}>{bmiInfo.label}</p>
                  <p className="text-xs text-slate-500 mt-1">El algoritmo ajustará tu rutina a este perfil</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => { if (!formData.name || !formData.email || !formData.password || !formData.age || !formData.weight || !formData.height) { setError('Completa todos los campos'); return; } setError(''); setStep(2); }}
                className="btn-primary w-full"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* STEP 2: Fitness Profile */}
          {step === 2 && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <label className="label">Objetivo Principal</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {goals.map(g => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, goal: g.value })}
                      className={`p-3 rounded-2xl text-sm font-medium border transition-all duration-200 text-left ${formData.goal === g.value ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10'}`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Nivel de Experiencia</label>
                <div className="space-y-2 mt-1">
                  {levels.map(l => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, experienceLevel: l.value })}
                      className={`w-full p-3 rounded-2xl text-sm font-medium border transition-all duration-200 text-left ${formData.experienceLevel === l.value ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Equipamiento Disponible</label>
                <div className="space-y-2 mt-1">
                  {equipment.map(eq => (
                    <button
                      key={eq.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, equipment: eq.value })}
                      className={`w-full p-3 rounded-2xl text-sm font-medium border transition-all duration-200 text-left ${formData.equipment === eq.value ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10'}`}
                    >
                      {eq.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← Atrás</button>
                <button type="button" onClick={() => { setError(''); setStep(3); }} className="btn-primary flex-1">Continuar →</button>
              </div>
            </div>
          )}

          {/* STEP 3: PAR-Q */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="animate-slide-up">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-5">
                <p className="text-amber-400 font-semibold text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Cuestionario PAR-Q de Seguridad
                </p>
                <p className="text-slate-400 text-xs mt-1">Responde con honestidad. Si respones "Sí" a alguna pregunta, se te recomendará consultar a un médico antes de entrenar.</p>
              </div>
              <div className="space-y-4">
                {PAR_Q_QUESTIONS.map((q, idx) => (
                  <div key={idx} className="bg-slate-800/40 rounded-2xl p-4 border border-white/5">
                    <p className="text-slate-300 text-sm mb-3">{idx + 1}. {q}</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleParqChange(idx, false)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${!parqAnswers[idx] ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => handleParqChange(idx, true)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${parqAnswers[idx] ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}
                      >
                        Sí
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {parqAnswers.some(a => a) && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mt-4">
                  <p className="text-red-400 text-sm font-semibold">⚠️ Recomendación Médica</p>
                  <p className="text-slate-400 text-xs mt-1">Respondiste "Sí" a al menos una pregunta. Tu cuenta se creará, pero se te recomendará consultar a un médico antes de generar rutinas de alta intensidad. Tu seguridad es lo primero.</p>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">← Atrás</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                      Creando...
                    </span>
                  ) : 'Crear Cuenta 🚀'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-slate-500 mt-6 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
