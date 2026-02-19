import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ── DATA ────────────────────────────────────────────────────────────────────
const INSIGHTS = [
    { category: 'Ciencia', icon: '🧠', content: 'El ejercicio aumenta el BDNF, una proteína que actúa como "fertilizante neuronal". Entrenar mejora tu capacidad para aprender y crear.' },
    { category: 'Metabolismo', icon: '🔥', content: 'El tejido muscular quema calorías incluso cuando dormís frente a la PC. Cada kilo de músculo consume ~13 kcal/día en reposo.' },
    { category: 'EPOC', icon: '⚡', content: 'Después de un HIIT, tu cuerpo sigue quemando calorías extra hasta 24 horas. Es como dejar el motor corriendo después de la carrera.' },
    { category: 'Hidratación', icon: '💧', content: 'La sed ya es señal de un 2% de deshidratación, lo que reduce tu fuerza en un 10%. Anticipate y tomá agua antes de sentir sed.' },
    { category: 'Sueño', icon: '😴', content: 'El músculo no crece en el gimnasio, crece mientras dormís. El entrenamiento es el código; el descanso es el proceso de compilación.' },
    { category: 'Postura', icon: '💻', content: 'Si pasás horas frente a la pantalla, prioricé ejercicios de tracción (remo) para compensar la postura encorvada hacia el teclado.' },
];

const QUOTES = [
    { text: 'El camino es la recompensa.', source: 'Maestro Tabárez', type: 'persistence' },
    { text: 'Entrenar es el único juego donde no podés comprar el DLC de la fuerza. Tenés que farmearla cada día.', source: 'Cultura Gamer', type: 'gaming' },
    { text: 'No te detengas cuando estés cansado, detente cuando hayas hecho el commit de hoy.', source: 'Dev Mindset', type: 'code' },
    { text: 'La constancia le gana al talento cuando el talento se queda durmiendo la siesta.', source: 'Filosofía del Hábito', type: 'discipline' },
    { text: 'No importa el tiempo que pase, sino lo que hagas con él.', source: 'Rock Nacional', type: 'time' },
    { text: 'Nivel 1 hoy es mejor que Nivel 0. No saltes el tutorial (calentamiento).', source: 'RPG Wisdom', type: 'gaming' },
];

const TIPS = [
    { icon: '📈', title: 'Regla del 1%', desc: 'Mejorá solo un 1% cada sesión. En un año serás una versión completamente diferente de vos mismo.' },
    { icon: '🏋️', title: 'Tiempo bajo tensión', desc: 'Bajar el peso lento (3-4 seg) recluta más fibras musculares que hacerlo rápido. La calidad supera a la cantidad.' },
    { icon: '🍎', title: 'Proteína post-entreno', desc: 'Consumí 20-40g de proteína dentro de los 30 min post-entreno para maximizar la síntesis muscular.' },
    { icon: '🌬️', title: 'Respiración correcta', desc: 'Exhalá en el esfuerzo, inhalá en la vuelta. Esta sincronía estabiliza el core y protege la columna.' },
    { icon: '🛌', title: 'Descanso muscular', desc: 'El mismo grupo muscular necesita 48h de descanso para recuperarse. El sobreentrenamiento destruye, no construye.' },
    { icon: '🎯', title: 'Conexión mente-músculo', desc: 'Concentrarte en el músculo que estás trabajando aumenta su activación hasta un 20%. Pensá en lo que contraés.' },
];

const FEATURES = [
    {
        icon: '🧬',
        title: 'Algoritmo Científico',
        desc: 'Calcula tu IMC, analiza edad, nivel y equipamiento. Genera rutinas estructuradas en 4 fases: calentamiento, core, bloque principal y vuelta a la calma.',
        color: 'from-green-500/20 to-emerald-500/10 border-green-500/20',
        textColor: 'text-green-400'
    },
    {
        icon: '🤖',
        title: 'Fit — Tu Coach IA',
        desc: 'Chat con inteligencia artificial impulsado por Groq. Consultá sobre ejercicios, nutrición y motivación en tiempo real, disponible 24/7.',
        color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20',
        textColor: 'text-blue-400'
    },
    {
        icon: '📊',
        title: 'Progresión Inteligente',
        desc: 'Seguimiento de sesiones con escala RPE. El algoritmo incrementa automáticamente la carga cada 4 sesiones aplicando sobrecarga progresiva.',
        color: 'from-purple-500/20 to-violet-500/10 border-purple-500/20',
        textColor: 'text-purple-400'
    },
    {
        icon: '🛡️',
        title: 'Seguridad PAR-Q',
        desc: 'Cuestionario médico de prefiltrado. Si existe riesgo cardiovascular, el sistema alerta antes de generar entrenamientos de alta intensidad.',
        color: 'from-orange-500/20 to-amber-500/10 border-orange-500/20',
        textColor: 'text-orange-400'
    },
];

const STATS = [
    { value: '4', label: 'Fases por sesión', icon: '🔄' },
    { value: 'IMC', label: 'Basado en tu cuerpo', icon: '📐' },
    { value: '24h', label: 'EPOC post-HIIT', icon: '🔥' },
    { value: 'IA', label: 'Coach personalizado', icon: '🤖' },
];

// ── ROTATING QUOTE ──────────────────────────────────────────────────────────
const RotatingQuote = () => {
    const [idx, setIdx] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIdx(i => (i + 1) % QUOTES.length);
                setVisible(true);
            }, 400);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const q = QUOTES[idx];
    return (
        <div className={`transition-all duration-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <p className="text-xl sm:text-2xl font-display font-medium text-white italic leading-relaxed">
                "{q.text}"
            </p>
            <p className="text-green-400 font-semibold mt-3 text-sm">— {q.source}</p>
        </div>
    );
};

// ── ROTATING INSIGHT ─────────────────────────────────────────────────────────
const InsightWidget = () => {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % INSIGHTS.length), 4000);
        return () => clearInterval(t);
    }, []);

    const insight = INSIGHTS[idx];
    return (
        <div className="relative overflow-hidden card text-center py-8">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
            <span className="text-4xl mb-3 block">{insight.icon}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                {insight.category}
            </span>
            <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-lg mx-auto">
                {insight.content}
            </p>
            <div className="flex justify-center gap-1.5 mt-6">
                {INSIGHTS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIdx(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-green-500' : 'w-1.5 bg-slate-700'}`}
                    />
                ))}
            </div>
        </div>
    );
};

// ── LANDING PAGE ─────────────────────────────────────────────────────────────
const Landing = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen">
            {/* ── STICKY NAV ── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-xl' : 'bg-transparent'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-xl shadow-lg shadow-green-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-display font-bold text-white">FitProgress</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-3 py-1.5">
                            Iniciar Sesión
                        </Link>
                        <Link to="/register" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-green-500/20 hover:scale-105 transition-all">
                            Empezar Gratis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 overflow-hidden">
                {/* Background glows */}
                <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

                <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-6 sm:mb-8">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Motor científico basado en IMC + Edad + Experiencia
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-4 sm:mb-6">
                        Entrenamiento que{' '}
                        <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            piensa por vos
                        </span>
                    </h1>

                    <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                        FitProgress no lanza rutinas aleatorias. Calcula tu IMC, analiza tu perfil y genera sesiones estructuradas como un entrenador personal — de forma gratuita.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-1 transition-all duration-300 text-center"
                        >
                            ⚡ Comenzar mi plan científico
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-medium px-8 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
                        >
                            Ya tengo cuenta →
                        </Link>
                    </div>

                    {/* Stats bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
                        {STATS.map((s, i) => (
                            <div key={i} className="bg-slate-800/40 backdrop-blur-sm border border-white/5 rounded-2xl p-3 sm:p-4 text-center">
                                <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
                                <div className="text-xl sm:text-2xl font-display font-bold text-white">{s.value}</div>
                                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-3">¿Por qué FitProgress?</h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">No es un generador de rutinas genéricas. Es un sistema que razona sobre tu cuerpo.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {FEATURES.map((f, i) => (
                        <div key={i} className={`bg-gradient-to-br ${f.color} border rounded-3xl p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300`}>
                            <div className="text-3xl sm:text-4xl mb-4">{f.icon}</div>
                            <h3 className={`text-lg sm:text-xl font-display font-bold mb-2 ${f.textColor}`}>{f.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 bg-slate-900/50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-3">Cómo funciona el motor</h2>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">Cada sesión sigue una estructura fisiológicamente correcta</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { num: '01', phase: 'Calentamiento', time: '8-10 min', icon: '🔥', desc: 'Movilidad dinámica. Prepara articulaciones y activa el sistema cardiovascular.' },
                            { num: '02', phase: 'Core & Estabilidad', time: '5 min', icon: '🛡️', desc: 'Activación del centro de gravedad. Protege la columna vertebral durante el esfuerzo.' },
                            { num: '03', phase: 'Bloque Principal', time: '20-40 min', icon: '⚡', desc: 'Fuerza, cardio o mixto. Adaptado a tu IMC, edad, nivel y equipamiento disponible.' },
                            { num: '04', phase: 'Vuelta a la Calma', time: '8-10 min', icon: '❄️', desc: 'Estiramientos suaves y respiración. Activa el sistema parasimpático para la recuperación.' },
                        ].map((p, i) => (
                            <div key={i} className="relative bg-slate-800/40 border border-white/5 rounded-3xl p-5 sm:p-6 overflow-hidden group hover:border-white/10 transition-all">
                                <div className="absolute -top-2 -right-2 text-5xl sm:text-6xl font-display font-black text-white/5 group-hover:text-white/8 transition-all">{p.num}</div>
                                <div className="text-2xl sm:text-3xl mb-3">{p.icon}</div>
                                <h4 className="font-display font-bold text-white text-sm sm:text-base mb-1">{p.phase}</h4>
                                <p className="text-green-400 text-xs font-bold mb-2">{p.time}</p>
                                <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DID YOU KNOW ── */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-3xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-3">¿Sabías que...?</h2>
                    <p className="text-slate-400 text-sm">Cápsulas de ciencia del entrenamiento. Rotando cada 4 segundos.</p>
                </div>
                <InsightWidget />
            </section>

            {/* ── QUOTES ── */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-green-900/20 to-slate-900/50">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="text-4xl sm:text-5xl text-green-500/30 font-serif mb-4 sm:mb-6 leading-none">"</div>
                    <RotatingQuote />
                </div>
            </section>

            {/* ── TIPS ── */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-3">Tips de Experto</h2>
                    <p className="text-slate-400 text-sm">10 segundos de lectura. Resultados de por vida.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TIPS.map((tip, i) => (
                        <div key={i} className="card group hover:border-green-500/20 transition-all duration-300">
                            <div className="text-2xl sm:text-3xl mb-3">{tip.icon}</div>
                            <h4 className="font-display font-bold text-white text-sm sm:text-base mb-2 group-hover:text-green-400 transition-colors">{tip.title}</h4>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{tip.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            <section className="py-16 sm:py-24 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12">
                        <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🚀</div>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3 sm:mb-4">
                            Tu primer entrenamiento científico, gratis
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
                            Sin excusas. Sin equipo obligatorio. El algoritmo se adapta a lo que tenés hoy.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-2xl shadow-xl shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Crear mi cuenta gratis
                        </Link>
                        <p className="text-slate-600 text-xs mt-4">Sin tarjeta de crédito. Sin compromisos.</p>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/5 py-6 sm:py-8 px-4 sm:px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="font-display font-bold text-white text-sm">FitProgress</span>
                </div>
                <p className="text-slate-600 text-xs">Entrenamiento científico. Progresión real.</p>
            </footer>
        </div>
    );
};

export default Landing;
