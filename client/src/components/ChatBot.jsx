import { useState, useEffect, useRef } from 'react';
import Groq from 'groq-sdk';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '¡Hola! Soy Fit, tu entrenador personal con IA. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize Groq client
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    const groq = apiKey ? new Groq({ apiKey, dangerouslyAllowBrowser: true }) : null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (!groq) {
            setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: 'IA no configurada. Por favor, añade VITE_GROQ_API_KEY.' }]);
            setInput('');
            return;
        }

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Eres Fit, un entrenador personal experto, motivador y amigable. Tu misión es ayudar al usuario con consejos sobre ejercicios, nutrición y motivación. Sé conciso y directo."
                    },
                    ...messages.map(m => ({ role: m.role, content: m.content })),
                    { role: 'user', content: input }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                max_tokens: 1024,
                top_p: 1,
                stop: null,
                stream: false
            });

            const botMessage = { role: 'assistant', content: chatCompletion.choices[0]?.message?.content || "Lo siento, tuve un problema al pensar mi respuesta." };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, ha ocurrido un error al conectar con mi cerebro de IA. Por favor verifica la API Key." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-24 right-6 z-50 w-14 h-14 bg-neon-green text-black rounded-2xl shadow-glow-green/20 hover:shadow-glow-green/40 hover:scale-110 transition-all duration-300 group flex items-center justify-center border border-white/10"
            >
                {isOpen ? (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
                        </span>
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="fixed top-40 right-6 w-80 md:w-96 h-[500px] max-h-[70vh] bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl z-50 flex flex-col transition-all duration-300 animate-slide-up origin-top-right">
                    <div className="p-6 border-b border-white/5 bg-slate-950/50 rounded-t-[2rem] flex items-center gap-4">
                        <div className="w-12 h-12 bg-neon-green/10 text-neon-green rounded-xl flex items-center justify-center shadow-glow-green/5 border border-neon-green/20">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-display font-black text-white uppercase tracking-tight">Fit Assistant</h3>
                            <p className="text-[10px] text-neon-green flex items-center gap-1.5 font-black uppercase tracking-widest mt-0.5">
                                <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse shadow-glow-green"></span>
                                Online
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed ${msg.role === 'user'
                                    ? 'bg-neon-green text-black rounded-tr-none shadow-glow-green/10'
                                    : 'bg-slate-800/80 text-white rounded-tl-none border border-white/5'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 bg-slate-950/50 rounded-b-[2rem]">
                        <div className="flex gap-2 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="¿Duda sobre entrenamiento?"
                                className="input !py-4 !pl-6 !pr-14 !bg-slate-900 border-white/5 focus:border-neon-green/30 text-xs font-bold uppercase tracking-widest"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="absolute right-2 top-2 w-10 h-10 bg-neon-green hover:bg-[#d9ff33] text-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatBot;
