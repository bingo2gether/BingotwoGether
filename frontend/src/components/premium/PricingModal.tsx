import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Check, Zap, Star, Shield, Cloud,
    Crown, ArrowRight, CreditCard, Sparkles, Heart,
    Target, TrendingUp, Users
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState<'stripe' | 'mp' | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
    const [error, setError] = useState<string | null>(null);

    const plans = {
        monthly: {
            name: 'Mensal',
            price: '29,90',
            period: '/ mês',
            saving: null,
            desc: 'Para testar sem compromisso.'
        },
        annual: {
            name: 'Anual',
            price: '199,90',
            period: '/ ano',
            saving: 'Economize 45%',
            best: true,
            desc: 'Menos que um jantar por mês para construir um futuro.'
        },
        lifetime: {
            name: 'Vitalício',
            price: '399,90',
            period: 'único',
            saving: 'Acesso Eterno',
            desc: 'Pague uma vez. Use para todos os objetivos da vida.'
        }
    };

    const benefits = [
        { icon: <Users size={20} />, title: "Sincronização Cloud Real-time", text: "Um único plano para os dois. Tudo sincronizado instantaneamente." },
        { icon: <TrendingUp size={20} />, title: "Previsão IA de Metas", text: "Saiba exatamente em que dia vocês chegarão no objetivo." },
        { icon: <Sparkles size={20} />, title: "IA Coach & Desafios", text: "Mentoria personalizada que sugere como acelerar o progresso." },
        { icon: <Heart size={20} />, title: "Resiliência Financeira", text: "O sistema se adapta e ajuda vocês até nos meses difíceis." },
        { icon: <Star size={20} />, title: "Skins & Temas Premium", text: "Desbloqueie designs exclusivos (MatriMoney, Travel, etc)." },
    ];

    const handleStripePayment = async () => {
        setLoading('stripe');
        setError(null);
        try {
            const { url } = await paymentService.createStripeSession(selectedPlan);
            window.location.href = url;
        } catch (err: any) {
            setError('Erro ao conectar com Stripe. Verifique sua conexão.');
        } finally {
            setLoading(null);
        }
    };

    const handleMPPayment = async () => {
        setLoading('mp');
        setError(null);
        try {
            const { init_point } = await paymentService.createMPPreference(selectedPlan);
            window.location.href = init_point;
        } catch (err: any) {
            setError('Erro ao conectar com Mercado Pago.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 overflow-y-auto bg-slate-950/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/60"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 md:rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] min-h-screen md:min-h-0"
                    >
                        {/* Noise Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                        <div className="flex flex-col md:flex-row h-full">
                            {/* Left Side: Value Proposition */}
                            <div className="flex-1 p-8 md:p-12 bg-gradient-to-br from-brand-purple/5 via-transparent to-brand-magenta/5 relative">
                                <button onClick={onClose} className="md:hidden absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400">
                                    <X size={20} />
                                </button>

                                <div className="space-y-8 max-w-sm">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-[10px] font-black uppercase tracking-widest text-brand-purple">
                                        <Crown size={12} className="fill-current" />
                                        Membro PRO
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                                            Bingo2Gether <span className="text-brand-purple">PRO</span>
                                        </h2>
                                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                            Tudo para chegar ao objetivo juntos — sem brigas, sem culpa e sem desistir.
                                        </p>
                                    </div>

                                    <div className="space-y-6 pt-4">
                                        {benefits.map((b, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + i * 0.1 }}
                                                className="flex gap-4"
                                            >
                                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-brand-purple shrink-0">
                                                    {b.icon}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">{b.title}</h4>
                                                    <p className="text-[11px] text-slate-500 leading-normal">{b.text}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-sm italic text-slate-400 dark:text-slate-500">
                                            "O tempo vai passar de qualquer forma. A diferença é se vocês estão construindo algo juntos nesse tempo."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Pricing Selection */}
                            <div className="w-full md:w-[400px] bg-slate-50 dark:bg-slate-950/50 p-8 md:p-12 border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                                <button onClick={onClose} className="hidden md:flex absolute top-10 right-10 p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={24} />
                                </button>

                                <div className="space-y-8">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black">Escolha seu plano</h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Acesso para o casal</p>
                                    </div>

                                    <div className="space-y-3">
                                        {(Object.entries(plans) as [keyof typeof plans, any][]).map(([id, plan]) => (
                                            <button
                                                key={id}
                                                onClick={() => setSelectedPlan(id)}
                                                className={`w-full p-5 rounded-[2rem] border-2 transition-all text-left relative group ${selectedPlan === id
                                                        ? 'border-brand-purple bg-white dark:bg-slate-900 shadow-xl'
                                                        : 'border-transparent bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 shadow-sm'
                                                    }`}
                                            >
                                                {plan.best && (
                                                    <div className="absolute -top-3 right-6 bg-brand-gold text-brand-purple text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                                                        Recomendado
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlan === id ? 'text-brand-purple' : 'text-slate-400'}`}>
                                                        {plan.name}
                                                    </span>
                                                    {plan.saving && (
                                                        <span className="text-[10px] font-black text-emerald-500">{plan.saving}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black">R$ {plan.price}</span>
                                                    <span className="text-xs text-slate-500 font-bold">{plan.period}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium line-clamp-1 group-hover:line-clamp-none transition-all">
                                                    {plan.desc}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-12">
                                    {error && <p className="text-center text-[10px] font-bold text-red-500 mb-2">{error}</p>}

                                    <button
                                        disabled={!!loading}
                                        onClick={handleStripePayment}
                                        className="w-full py-5 bg-brand-purple text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-purple/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {loading === 'stripe' ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>Começar a construir juntos agora <ArrowRight size={18} /></>
                                        )}
                                    </button>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ou pague via Pix</span>
                                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                                    </div>

                                    <button
                                        disabled={!!loading}
                                        onClick={handleMPPayment}
                                        className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loading === 'mp' ? (
                                            <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" className="h-3.5 dark:invert" alt="MP" />
                                                Pagar com Pix / Brasil
                                            </>
                                        )}
                                    </button>

                                    <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] pt-4">
                                        Um único plano para os dois. Seguro & Transparente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PricingModal;

