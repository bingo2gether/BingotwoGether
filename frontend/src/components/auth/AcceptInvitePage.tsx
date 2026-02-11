import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import LoginPage from './LoginPage';

interface AcceptInvitePageProps {
    token: string;
    onSuccess: () => void;
}

const AcceptInvitePage: React.FC<AcceptInvitePageProps> = ({ token, onSuccess }) => {
    const { isAuthenticated, user, acceptInvite, logout } = useAuthStore();
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    useEffect(() => {
        // If already authenticated, try to accept immediately
        if (isAuthenticated && user && status === 'idle') {
            handleAccept();
        }
    }, [isAuthenticated, user]);

    const handleAccept = async () => {
        setStatus('processing');
        try {
            await acceptInvite(token);
            setStatus('success');
            setTimeout(onSuccess, 2000); // Redirect after 2s
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao aceitar convite');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-500 w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Dupla Formada!</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Vocês agora estão conectados e compartilham o mesmo progresso no bingo.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-md mb-8 text-center">
                        <div className="w-16 h-16 bg-brand-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Heart className="text-brand-purple w-8 h-8" fill="currentColor" />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2">Você foi convidado!</h1>
                        <p className="text-slate-400">
                            Entre ou crie uma conta para se juntar à sua dupla e jogar o Bingo dos Sonhos juntos.
                        </p>
                    </div>

                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                        <LoginPage
                            isInviteFlow={true}
                            onSuccess={() => { }} // We define explicit success handling via useEffect above 
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                {status === 'error' ? (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-500 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Ops! Algo deu errado</h3>
                        <p className="text-slate-500 text-sm mb-6">{error}</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onSuccess}
                                className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold"
                            >
                                Voltar ao Início
                            </button>
                            <button
                                onClick={logout}
                                className="text-xs text-red-500 underline"
                            >
                                Sair desta conta e tentar outra
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Conectando duplas...</h3>
                    </>
                )}
            </div>
        </div>
    );
};

export default AcceptInvitePage;
