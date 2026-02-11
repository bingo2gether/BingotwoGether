import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Onboarding, { BingoLogo } from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { GameState } from './types';
import { DEFAULT_GAME_STATE } from './constants';
import { ThemeProvider } from './ThemeContext';
import { useAuthStore } from './store/authStore';
import AuthModal from './components/auth/AuthModal';
import api from './services/api';
import { LogIn, Crown } from 'lucide-react';
import { usePushNotifications } from './hooks/usePushNotifications';
import LoginPage from './components/auth/LoginPage';
import AcceptInvitePage from './components/auth/AcceptInvitePage';

const AppContent: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => JSON.parse(JSON.stringify(DEFAULT_GAME_STATE)));
  const [loaded, setLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const { isAuthenticated, checkAuth, user } = useAuthStore();

  usePushNotifications(isAuthenticated);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await useAuthStore.getState().checkPlanStatus();

      const saved = localStorage.getItem('saveTogetherState');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!parsed.lastDraw) parsed.lastDraw = null;
          setGameState(parsed);
        } catch (e) {
          console.error("Failed to load save state", e);
        }
      }
      setLoaded(true);
    };

    init();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchServerState = async () => {
        try {
          const response = await api.get('/game/state');
          if (response.data && response.data.isSetup) {
            setGameState(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch server state", error);
        }
      };
      fetchServerState();
    }
  }, [isAuthenticated]);

  // Sync PRO status from Auth to GameState
  useEffect(() => {
    if (user && typeof user.isPro === 'boolean') {
      if (gameState.settings.isPro !== user.isPro) {
        console.log(`Syncing PRO status: ${user.isPro}`);
        setGameState(prev => ({
          ...prev,
          settings: { ...prev.settings, isPro: user.isPro }
        }));
      }
    }
  }, [user, gameState.settings.isPro]);

  useEffect(() => {
    if (loaded && isAuthenticated && gameState.isSetup) {
      const timer = setTimeout(async () => {
        try {
          await api.post('/game/sync', { state: gameState });
        } catch (error) {
          console.error("Failed to sync game state", error);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameState, loaded, isAuthenticated]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('saveTogetherState', JSON.stringify(gameState));
    }
  }, [gameState, loaded]);

  const handleSetupComplete = (data: Partial<GameState>) => {
    console.log("Setup completed with data:", data);
    setGameState(prev => ({ ...prev, ...data }));
  };

  const handleReset = () => {
    const freshState = JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
    freshState.settings.targetDate = new Date().toISOString();
    freshState.settings.startDate = new Date().toISOString();
    setGameState(freshState);
    localStorage.removeItem('saveTogetherState');
    window.scrollTo(0, 0);
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (invite) {
      setInviteToken(invite);
    }

    if (params.get('payment') === 'success' || window.location.pathname.includes('/payment/success')) {
      const celebrate = async () => {
        await checkAuth();
        await useAuthStore.getState().checkPlanStatus();
        setShowSuccessModal(true);
        window.history.replaceState({}, document.title, "/");
      };
      celebrate();
    }
  }, [checkAuth]);

  if (inviteToken) {
    return <AcceptInvitePage token={inviteToken} onSuccess={() => {
      setInviteToken(null);
      window.history.replaceState({}, document.title, "/");
      useAuthStore.getState().checkAuth();
    }} />;
  }

  if (!loaded) return null;

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center animate-out fade-out duration-1000 delay-[3500ms]">
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            src="/splash.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => setShowSplash(false)}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isAuthenticated && !showSplash ? (
          <motion.div
            key="mandatory-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120]"
          >
            <LoginPage onSuccess={() => setShowLoginPage(false)} />
          </motion.div>
        ) : !gameState.isSetup && !showSplash ? (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Onboarding onComplete={handleSetupComplete} isPro={user?.isPro || false} />
          </motion.div>
        ) : !showSplash ? (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard
              gameState={gameState}
              onUpdateState={setGameState}
              onReset={handleReset}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-brand-purple p-8 rounded-[2.5rem] border border-white/20 text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(230,192,110,0.4)]">
                <Crown className="text-brand-purple w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Você é PRO!</h2>
              <p className="text-slate-300 text-sm font-medium mb-8">Parabéns! Sua conta foi atualizada e todos os recursos exclusivos estão desbloqueados.</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-brand-gold text-brand-purple rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Começar agora
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;