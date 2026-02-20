import { useState } from 'react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "BIENVENIDO A FITPROGRESS",
            desc: "Tu transformación física comienza hoy. Hemos diseñado una experiencia científica para llevarte al siguiente nivel.",
            icon: (
                <div className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center text-neon-green shadow-glow-green">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            )
        },
        {
            title: "REGISTRA TU PROGRESO",
            desc: "Usa el botón '+' para registrar cada serie. Nuestro algoritmo calculará tu volumen y ajustará la intensidad automáticamente.",
            icon: (
                <div className="w-24 h-24 bg-neon-blue/20 rounded-full flex items-center justify-center text-neon-blue shadow-glow-blue">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            )
        },
        {
            title: "ANALIZA TUS LOGROS",
            desc: "Visualiza tu evolución en tiempo real con gráficos interactivos y comparativas de fotos. ¡La constancia es tu mejor aliada!",
            icon: (
                <div className="w-24 h-24 bg-neon-orange/20 rounded-full flex items-center justify-center text-neon-orange shadow-glow-orange">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
            <div className="max-w-md w-full card flex flex-col items-center text-center space-y-8 animate-slide-up border-white/10 shadow-glow-green/10">
                {steps[step].icon}

                <div className="space-y-3">
                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">{steps[step].title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">{steps[step].desc}</p>
                </div>

                <div className="flex gap-2">
                    {steps.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-neon-green shadow-glow-green' : 'bg-slate-700'}`}></div>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="btn-primary w-full py-4 text-[13px] font-black uppercase tracking-widest shadow-glow-green/20"
                >
                    {step === steps.length - 1 ? 'EMPEZAR AHORA' : 'CONTINUAR'}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
