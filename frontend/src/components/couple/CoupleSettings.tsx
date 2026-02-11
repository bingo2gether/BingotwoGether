import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Users, Mail, Copy, Check, Crown, Clock, ShieldCheck, Heart } from 'lucide-react';
import { PricingModal } from '../premium/PricingModal';

export const CoupleSettings: React.FC = () => {
    const { user, invitePartner, createCouple, checkPlanStatus } = useAuthStore();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [inviteSent, setInviteSent] = useState(false);
    const [error, setError] = useState('');
    const [showPricing, setShowPricing] = useState(false);

    // Format date helper
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Vitalício';
        return new Date(dateString).toLocaleDateString();
    };

    // Calculate days remaining
    const getDaysRemaining = () => {
        if (!user?.planExpiresAt) return null;
        const diff = new Date(user.planExpiresAt).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const handleCreateCouple = async () => {
        setLoading(true);
        try {
            await createCouple();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar conta compartilhada');
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await invitePartner(email);
            setInviteSent(true);
            setEmail('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao enviar convite');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
                    <Heart className="text-brand-purple" size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">Minha Dupla</h2>
                    <p className="text-xs text-slate-500 font-medium">Gerencie sua conta compartilhada</p>
                </div>
            </div>

            {/* Plan Status Card */}
            <div className={`p-6 rounded-3xl border-2 ${user.isPro ? 'bg-gradient-to-br from-brand-purple to-slate-900 border-brand-gold/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {user.isPro && <Crown size={16} className="text-brand-gold" />}
                            <h3 className={`font-black uppercase tracking-widest text-xs ${user.isPro ? 'text-brand-gold' : 'text-slate-500'}`}>
                                Plano Atual
                            </h3>
                        </div>
                        <p className={`text-2xl font-black ${user.isPro ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                            {user.planType === 'free' ? 'Gratuito' :
                                user.planType === 'mensal' ? 'PRO Mensal' :
                                    user.planType === 'anual' ? 'PRO Anual' : 'PRO Vitalício'}
                        </p>
                    </div>

                    {user.isPro ? (
                        <div className="px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-black uppercase tracking-widest border border-brand-gold/30">
                            Ativo
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowPricing(true)}
                            className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-brand-purple/20"
                        >
                            Virar PRO
                        </button>
                    )}
                </div>

                {user.isPro && user.planType !== 'vitalicio' && (
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-medium bg-white/5 p-3 rounded-xl border border-white/10">
                        <Clock size={14} className="text-brand-gold" />
                        <span>Expira em {formatDate(user.planExpiresAt)} ({getDaysRemaining()} dias)</span>
                    </div>
                )}

                {user.isPro && user.planType === 'vitalicio' && (
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-medium bg-white/5 p-3 rounded-xl border border-white/10">
                        <ShieldCheck size={14} className="text-brand-gold" />
                        <span>Acesso Vitalício Garantido</span>
                    </div>
                )}
            </div>

            {/* Couple Management */}
            {!user.coupleId ? (
                <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Jogue em Dupla</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
                        Crie uma conta compartilhada para convidar seu parceiro(a) e sincronizarem o jogo.
                    </p>
                    <button
                        onClick={handleCreateCouple}
                        disabled={loading}
                        className="px-6 py-3 bg-brand-purple text-white rounded-2xl font-bold shadow-lg shadow-brand-purple/20 hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Criando...' : 'Criar Conta Compartilhada'}
                    </button>
                    {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Membros</h4>

                        <div className="space-y-3">
                            {/* You (Owner/Partner) */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xs">
                                    {user.name?.charAt(0) || 'E'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {user.name || 'Eu'} <span className="text-xs font-normal text-slate-400">({user.role === 'owner' ? 'Dono' : 'Parceiro'})</span>
                                    </p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>

                            {/* Partner Slot */}
                            {user.role === 'owner' && !inviteSent && !user.partnerEmail ? ( // Assuming partnerEmail logic in store or handling logic here
                                <form onSubmit={handleInvite} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                        Convidar Parceiro(a)
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="Email do parceiro"
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl py-2 pl-9 pr-3 text-sm font-medium focus:border-brand-purple outline-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 bg-brand-purple text-white rounded-xl font-bold text-xs hover:bg-brand-purple/90 transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Enviando...' : 'Convidar'}
                                        </button>
                                    </div>
                                    {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
                                </form>
                            ) : inviteSent ? (
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 text-green-500 text-sm font-bold bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                                        <Check size={16} />
                                        <span>Convite enviado com sucesso!</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 text-center">
                                        O link expira em 48 horas.
                                    </p>
                                </div>
                            ) : null}

                            {/* If invited but partner not yet joined - wait, store doesn't show pending invites yet.
                                For now, relying on inviteSent state or if we add pendingInvite to user object later.
                            */}
                        </div>
                    </div>
                </div>
            )}

            {showPricing && <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />}
        </div>
    );
};
