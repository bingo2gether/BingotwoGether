export type SkinType = 'default' | 'matrimoney' | 'travel' | 'dark_luxury';

export interface SkinConfig {
    id: SkinType;
    name: string;
    fonts: {
        header: string;
        body: string;
    };
    colors: {
        background: string; // Gradient or solid
        cardBg: string; // Glass or solid
        textMain: string;
        textMuted: string;
        primary: string; // Buttons, highlights
        border: string;
        accent: string;
    };
    effects: {
        shadow: string;
        glassBlur: string; // '0px' for Carbon, '20px' for Matrimoney
        borderRadius: string; // '2rem' for Matrimoney, '0.5rem' for Carbon
        borderWidth: string;
    };
    icons: {
        goal: string;
        player1: string;
        player2: string;
    };
}

export const SKINS: Record<SkinType, SkinConfig> = {
    default: {
        id: 'default',
        name: 'Bingo Tradicional',
        fonts: {
            header: '"Inter", sans-serif',
            body: '"Inter", sans-serif'
        },
        colors: {
            background: 'linear-gradient(135deg, #fdfbf7 0%, #fff0f5 100%)',
            cardBg: 'rgba(255, 255, 255, 0.9)',
            textMain: '#1e293b',
            textMuted: '#64748b',
            primary: '#C13C7A', // Magenta
            accent: '#E6C26E', // Gold
            border: 'rgba(193, 60, 122, 0.1)'
        },
        effects: {
            shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            glassBlur: '0px',
            borderRadius: '1.5rem',
            borderWidth: '1px'
        },
        icons: {
            goal: '🎯',
            player1: '👤',
            player2: '👤'
        }
    },
    matrimoney: {
        id: 'matrimoney',
        name: 'MatriMoney (Wedding)',
        fonts: {
            header: '"Playfair Display", serif',
            body: '"Lato", sans-serif'
        },
        colors: {
            background: 'linear-gradient(135deg, #FFFAFA 0%, #FDFBF7 100%)', // Snow to Ivory
            cardBg: 'rgba(255, 255, 255, 0.65)',
            textMain: '#5D4037', // Dark warm brown
            textMuted: '#8D6E63',
            primary: '#D4AF37', // Gold
            accent: '#B76E79', // Rose Gold
            border: 'rgba(212, 175, 55, 0.25)'
        },
        effects: {
            shadow: '0 10px 40px -10px rgba(212, 175, 55, 0.15)',
            glassBlur: '20px',
            borderRadius: '2rem',
            borderWidth: '1px'
        },
        icons: {
            goal: '💍',
            player1: '🤵',
            player2: '👰'
        }
    },
    dark_luxury: {
        id: 'dark_luxury',
        name: 'Carbon PRO',
        fonts: {
            header: '"Orbitron", sans-serif',
            body: '"Rajdhani", sans-serif'
        },
        colors: {
            background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
            cardBg: 'rgba(15, 15, 15, 0.85)',
            textMain: '#ffffff',
            textMuted: '#94a3b8',
            primary: '#E6C26E', // Gold
            accent: '#00F3FF', // Cyan glow
            border: 'rgba(255, 255, 255, 0.08)'
        },
        effects: {
            shadow: '0 0 20px rgba(0, 243, 255, 0.05)',
            glassBlur: '5px',
            borderRadius: '0.75rem',
            borderWidth: '1px'
        },
        icons: {
            goal: '💎',
            player1: '👑',
            player2: '👑'
        }
    },
    travel: {
        id: 'travel',
        name: 'Viagem & Aventura',
        fonts: {
            header: '"Abril Fatface", cursive',
            body: '"Montserrat", sans-serif'
        },
        colors: {
            background: 'linear-gradient(to bottom, #e0f7fa 0%, #fff3e0 100%)',
            cardBg: '#ffffff',
            textMain: '#004D40', // Deep Teals
            textMuted: '#5D4037',
            primary: '#006994', // Ocean Blue
            accent: '#ff6f00', // Amber
            border: 'rgba(0, 105, 148, 0.15)'
        },
        effects: {
            shadow: '5px 5px 15px rgba(0,0,0,0.1)', // Polaroid shadow
            glassBlur: '0px',
            borderRadius: '0.25rem', // Polaroid sharp corners
            borderWidth: '0px'
        },
        icons: {
            goal: '✈️',
            player1: '🎒',
            player2: '📸'
        }
    }
};
