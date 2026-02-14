import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Crown, ArrowRight, Sparkles, Heart,
    Target, TrendingUp, Users, Shield, Zap, Star,
    CheckCircle2, Lock
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

    const plans = [
        {
            id: 'monthly' as const,
            name: 'Mensal',
            price: 29,
            cents: '90',
            period: '/mês',
            saving: null,
            best: false,
            desc: 'Sem compromisso',
            perDay: '~ R$ 1,00/dia',
        },
        {
            id: 'annual' as const,
            name: 'Anual',
            price: 199,
            cents: '90',
            period: '/ano',
            saving: '-45%',
            best: true,
            desc: 'O mais popular',
            perDay: '~ R$ 0,55/dia',
        },
        {
            id: 'lifetime' as const,
            name: 'Vitalício',
            price: 399,
            cents: '90',
            period: 'único',
            saving: '♾️ Eterno',
            best: false,
            desc: 'Pague uma vez só',
            perDay: 'Para sempre',
        },
    ];

    const features = [
        { icon: <Users size={16} />, text: 'Sincronização em tempo real para o casal' },
        { icon: <TrendingUp size={16} />, text: 'IA que prevê quando vocês atingirão a meta' },
        { icon: <Sparkles size={16} />, text: 'Coach financeiro com desafios personalizados' },
        { icon: <Heart size={16} />, text: 'Resiliência financeira nos meses difíceis' },
        { icon: <Star size={16} />, text: 'Skins & temas exclusivos premium' },
        { icon: <Shield size={16} />, text: 'Dados criptografados e seguros' },
    ];

    const handleStripePayment = async () => {
        setLoading('stripe');
        setError(null);
        try {
            const { url } = await paymentService.createStripeSession(selectedPlan);
            window.location.href = url;
        } catch (err: any) {
            setError('Erro ao processar pagamento. Tente novamente.');
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

    const selected = plans.find(p => p.id === selectedPlan)!;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto"
                    style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0"
                        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(88, 28, 135, 0.15), rgba(0,0,0,0.85))' }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 60, scale: 0.92 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="relative w-full max-w-[480px] mx-3 my-4"
                    >
                        {/* Card container */}
                        <div
                            className="relative rounded-[2rem] overflow-hidden"
                            style={{
                                background: 'linear-gradient(170deg, #1e1033 0%, #0f0a1a 40%, #0a0612 100%)',
                                boxShadow: '0 0 80px rgba(139, 92, 246, 0.15), 0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                            }}
                        >
                            {/* Ambient glow */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
                                }}
                            />
                            <div
                                className="absolute bottom-0 right-0 w-[200px] h-[200px] pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse, rgba(217, 70, 239, 0.08) 0%, transparent 70%)',
                                }}
                            />

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 z-10 p-2 rounded-full text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
                            >
                                <X size={20} />
                            </button>

                            {/* Content */}
                            <div className="relative p-6 pt-7 pb-8">
                                {/* Header badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex justify-center mb-5"
                                >
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.12), rgba(168, 85, 247, 0.12))',
                                            borderColor: 'rgba(250, 204, 21, 0.25)',
                                        }}
                                    >
                                        <Crown size={13} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-yellow-300/90">
                                            Bingo2Gether PRO
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Title */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="text-center mb-7"
                                >
                                    <h2 className="text-[1.65rem] font-black text-white leading-tight tracking-tight mb-2">
                                        Juntos, vocês vão<br />
                                        <span className="text-transparent bg-clip-text"
                                            style={{ backgroundImage: 'linear-gradient(135deg, #c084fc, #e879f9, #facc15)' }}
                                        >
                                            mais longe
                                        </span>
                                    </h2>
                                    <p className="text-[13px] text-white/40 font-medium leading-relaxed max-w-[280px] mx-auto">
                                        Desbloqueie o poder completo da plataforma para o casal
                                    </p>
                                </motion.div>

                                {/* Plan Selection */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex gap-2 mb-5 p-1 rounded-2xl"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                >
                                    {plans.map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className="flex-1 relative py-3 px-2 rounded-xl text-center transition-all duration-300"
                                            style={{
                                                background: selectedPlan === plan.id
                                                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(217, 70, 239, 0.15))'
                                                    : 'transparent',
                                                boxShadow: selectedPlan === plan.id
                                                    ? '0 0 20px rgba(168, 85, 247, 0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
                                                    : 'none',
                                            }}
                                        >
                                            {plan.best && (
                                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #facc15, #f59e0b)',
                                                            color: '#422006',
                                                        }}
                                                    >
                                                        Melhor oferta
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${selectedPlan === plan.id ? 'text-purple-300' : 'text-white/30'
                                                }`}>
                                                {plan.name}
                                            </div>
                                            <div className={`text-lg font-black ${selectedPlan === plan.id ? 'text-white' : 'text-white/50'
                                                }`}>
                                                R${plan.price}
                                            </div>
                                            {plan.saving && (
                                                <div className="text-[9px] font-bold text-emerald-400 mt-0.5">
                                                    {plan.saving}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </motion.div>

                                {/* Selected Plan Feature Card */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.25 }}
                                    key={selectedPlan}
                                    className="mb-5 p-4 rounded-2xl border"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(217, 70, 239, 0.04))',
                                        borderColor: 'rgba(168, 85, 247, 0.15)',
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400/70">
                                                Plano {selected.name}
                                            </span>
                                            <div className="flex items-baseline gap-1 mt-0.5">
                                                <span className="text-[11px] text-white/40 font-bold">R$</span>
                                                <span className="text-3xl font-black text-white tracking-tight">
                                                    {selected.price}
                                                </span>
                                                <span className="text-lg font-black text-white/60">,{selected.cents}</span>
                                                <span className="text-[11px] text-white/35 font-semibold ml-0.5">
                                                    {selected.period}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-emerald-400/80">
                                                {selected.perDay}
                                            </div>
                                            <div className="text-[9px] text-white/25 font-medium mt-0.5">
                                                Acesso para o casal
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini feature list */}
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {features.slice(0, 4).map((f, i) => (
                                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-white/45 font-medium">
                                                <CheckCircle2 size={11} className="text-emerald-400/60 shrink-0" />
                                                <span className="truncate">{f.text.split(' ').slice(0, 4).join(' ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* CTA Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-3"
                                >
                                    {error && (
                                        <div className="text-center text-[11px] font-bold text-red-400 py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                            {error}
                                        </div>
                                    )}

                                    {/* Primary CTA: Stripe / Card */}
                                    <button
                                        disabled={!!loading}
                                        onClick={handleStripePayment}
                                        className="group w-full relative py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider text-white flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all disabled:opacity-50 overflow-hidden"
                                        style={{
                                            background: 'linear-gradient(135deg, #7c3aed, #a855f7, #c026d3)',
                                            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.35), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                                        }}
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ background: 'linear-gradient(135deg, #8b5cf6, #c084fc, #d946ef)' }}
                                        />
                                        <span className="relative flex items-center gap-2.5">
                                            {loading === 'stripe' ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Zap size={17} className="fill-current" />
                                                    Assinar agora
                                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>

                                    {/* Pix / Mercado Pago */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em]">ou via Pix</span>
                                        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                    </div>

                                    <button
                                        disabled={!!loading}
                                        onClick={handleMPPayment}
                                        className="group w-full py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-wider text-white/60 hover:text-white/90 flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-50 border"
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            borderColor: 'rgba(255,255,255,0.08)',
                                        }}
                                    >
                                        {loading === 'mp' ? (
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" className="opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <rect width="48" height="48" rx="8" fill="#00AEEF" />
                                                    <path d="M14 18c2-4 6-6 10-6s8 2 10 6c2 4 2 8 0 12s-6 6-10 6-8-2-10-6-2-8 0-12z" fill="white" opacity="0.9" />
                                                </svg>
                                                Pagar com Pix / Brasil
                                            </>
                                        )}
                                    </button>
                                </motion.div>

                                {/* Trust signals */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-5 pt-4 border-t"
                                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                                >
                                    <div className="flex items-center justify-center gap-4 text-white/20">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                                            <Lock size={10} /> SSL Seguro
                                        </div>
                                        <div className="w-px h-3 bg-white/10" />
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                                            <Shield size={10} /> Pagamento Protegido
                                        </div>
                                        <div className="w-px h-3 bg-white/10" />
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                                            <Heart size={10} /> 1 plano = 2 pessoas
                                        </div>
                                    </div>
                                    <p className="text-center text-[9px] text-white/15 font-medium mt-3 leading-relaxed">
                                        Cancele a qualquer momento. Sem taxas escondidas.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PricingModal;
