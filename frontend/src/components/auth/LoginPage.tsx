import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
    LogIn, UserPlus, Mail, Lock, User, ArrowRight, Sparkles,
    ShieldCheck, Zap, Heart, Star, ChevronLeft
} from 'lucide-react';
import { BingoLogo } from '../Onboarding';
import { PricingModal } from '../premium/PricingModal';
import { GoogleLogin } from '@react-oauth/google';

interface LoginPageProps {
    onBack?: () => void;
    isInviteFlow?: boolean;
    onSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, isInviteFlow = false, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [marketingOptIn, setMarketingOptIn] = useState(true);

    const { login, register } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name, marketingOptIn);
            }
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Acesso negado. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = (credentialResponse: any) => {
        if (credentialResponse.credential) {
            useAuthStore.getState().googleLogin(credentialResponse.credential)
                .then(() => {
                    if (onSuccess) onSuccess();
                })
                .catch(() => setError('Falha ao autenticar com Google'));
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">

            {/* Premium Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
            </div>

            {/* Header */}
            <header className="relative z-20 p-6 flex justify-between items-center bg-slate-950/50 backdrop-blur-md">
                {onBack && !isInviteFlow ? (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <div className="p-2 rounded-full border border-slate-800 group-hover:bg-slate-800 transition-all">
                            <ChevronLeft size={20} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Voltar</span>
                    </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-brand-gold/20 border border-brand-gold/30 rounded-full">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-1">
                            <Star size={10} className="fill-current" /> Versão PRO
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-block mb-6 relative">
                        <div className="absolute inset-0 bg-brand-gold/20 blur-2xl rounded-full animate-pulse"></div>
                        <BingoLogo className="w-24 h-24 relative z-10 border-4 border-brand-gold shadow-[0_0_30px_rgba(230,194,110,0.3)]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                        Construindo o futuro juntos
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto">
                        A jornada para a harmonia financeira do casal começa com uma conta segura.
                    </p>
                </motion.div>

                {/* Auth Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Subtle decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div key="email-field" className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Seu melhor e-mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-gold transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="seu@parceiro.com"
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 font-bold text-white focus:border-brand-gold outline-none transition-all placeholder:text-slate-700"
                                    />
                                </div>
                            </motion.div>

                            <motion.div key="pass-field" className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Senha de Segurança</label>
                                    {isLogin && <button type="button" className="text-[9px] font-black text-brand-gold uppercase tracking-tighter hover:underline">Recuperar</button>}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-gold transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 font-bold text-white focus:border-brand-gold outline-none transition-all placeholder:text-slate-700"
                                    />
                                </div>
                            </motion.div>

                            {!isLogin && (
                                <motion.div
                                    key="marketing-opt-in"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 px-1"
                                >
                                    <input
                                        type="checkbox"
                                        id="marketing"
                                        checked={marketingOptIn}
                                        onChange={(e) => setMarketingOptIn(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-800 bg-slate-950/50 text-brand-gold focus:ring-brand-gold transition-all"
                                    />
                                    <label htmlFor="marketing" className="text-[10px] text-slate-400 font-medium leading-tight">
                                        Quero receber dicas exclusivas de educação financeira para casais.
                                    </label>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-400 text-xs font-bold text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-brand-gold to-[#c9a75e] text-brand-purple rounded-2xl font-black text-lg shadow-2xl shadow-brand-gold/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                                    <span>{isLogin ? 'Entrar na Plataforma' : 'Criar Conta Grátis'}</span>
                                    <ArrowRight size={18} className="ml-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex flex-col gap-3">
                        <div className="w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Falha no login Google')}
                                theme="filled_black"
                                shape="pill"
                                width="350px"
                            />
                        </div>

                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-help">
                                <ShieldCheck size={20} className="text-brand-gold" />
                                <span className="text-[8px] font-bold uppercase tracking-tighter">Seguro</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-help">
                                <Zap size={20} className="text-brand-gold" />
                                <span className="text-[8px] font-bold uppercase tracking-tighter">Instantâneo</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-help">
                                <Heart size={20} className="text-brand-gold" />
                                <span className="text-[8px] font-bold uppercase tracking-tighter">Para Casais</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Dynamic Footer Switch */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 text-center"
                >
                    <p className="text-slate-500 font-medium">
                        {isLogin ? 'Ainda não tem conta?' : 'Já possui acesso?'}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-brand-gold font-black underline underline-offset-4 hover:text-white transition-colors"
                        >
                            {isLogin ? 'Cadastre-se agora' : 'Faça login'}
                        </button>
                    </p>
                </motion.div>

                <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

            </main>
        </div>
    );
};

export default LoginPage;
