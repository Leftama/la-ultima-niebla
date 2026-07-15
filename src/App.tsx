import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoreSection from './components/LoreSection';
import FighterSelect from './components/FighterSelect';
import ComboAnalysis from './components/ComboAnalysis';
import TrainingMode from './components/TrainingMode';
import EasterEggs from './components/EasterEggs';
import SpectatorMode from './components/SpectatorMode';
import { audio } from './utils/audio';
import { Swords, Volume2, VolumeX, Zap, Trophy, Play, Gamepad2, Info, Tv, Sparkles, Key } from 'lucide-react';

type GameMode = 'lore' | 'fighters' | 'combos' | 'training' | 'eggs' | 'spectator';

export default function App() {
  const [activeMode, setActiveMode] = useState<GameMode>('lore');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [creditCount, setCreditCount] = useState<number>(99);

  const [secretAlert, setSecretAlert] = useState<{ title: string; desc: string } | null>(null);

  const triggerSecretUnlock = (eggId: string, title: string, desc: string) => {
    let currentUnlocked: string[] = ['paris_neruda'];
    const saved = localStorage.getItem('bombal_unlocked_eggs');
    if (saved) {
      try {
        currentUnlocked = JSON.parse(saved);
      } catch (e) {}
    }

    if (!currentUnlocked.includes(eggId)) {
      const updated = [...currentUnlocked, eggId];
      localStorage.setItem('bombal_unlocked_eggs', JSON.stringify(updated));
      audio.playVictory();
      setSecretAlert({ title, desc });
      setTimeout(() => {
        setSecretAlert(null);
      }, 5000);
    } else {
      audio.playSuccess();
      setSecretAlert({ 
        title: `Ya descubierto: ${title}`, 
        desc: "Este cofre ya se encuentra disponible en la pestaña EASTER EGGS." 
      });
      setTimeout(() => {
        setSecretAlert(null);
      }, 3500);
    }
  };

  const handleModeChange = (mode: GameMode) => {
    audio.playSlash();
    setActiveMode(mode);
  };

  const toggleSound = () => {
    const newVal = !soundOn;
    setSoundOn(newVal);
    audio.setSoundEnabled(newVal);
    if (newVal) {
      audio.playCoin();
    }
  };

  const handleAddCredit = () => {
    audio.playCoin();
    setCreditCount(prev => prev + 1);
  };

  // Render the selected component
  const renderContent = () => {
    switch (activeMode) {
      case 'lore':
        return <LoreSection />;
      case 'fighters':
        return <FighterSelect />;
      case 'combos':
        return <ComboAnalysis />;
      case 'training':
        return <TrainingMode />;
      case 'eggs':
        return <EasterEggs />;
      case 'spectator':
        return <SpectatorMode />;
      default:
        return <LoreSection />;
    }
  };

  return (
    <div className="min-h-screen bg-arcade-dark text-zinc-100 font-sans selection:bg-neon-red selection:text-black relative overflow-x-hidden flex flex-col border-4 md:border-8 lg:border-[12px] border-zinc-900">
      {/* Decorative cyber grid backdrop */}
      <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none z-0" />
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl pointer-events-none" />

      {/* --- ARCADE TOP BAR HUD --- */}
      <header className="border-b-4 border-neon-red bg-zinc-950 relative z-10 px-4 py-4 md:py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-4">
            <div className="bg-neon-red/15 border-2 border-neon-red p-2.5 rounded-none animate-pulse shadow-[0_0_15px_rgba(255,51,51,0.2)]">
              <Gamepad2 className="w-8 h-8 text-neon-red" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl md:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-neon-red text-shadow-neon-red uppercase italic">
                  LA ÚLTIMA NIEBLA
                </h1>
                <span className="font-arcade text-[8px] bg-neon-red text-black px-1.5 py-0.5 rounded-none font-extrabold tracking-widest animate-pulse">
                  ARCADE
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                Estudio de Combate Literario // María Luisa Bombal
              </p>
            </div>
          </div>

          {/* Controls Panel (Mute, Credits, Insert Coin) */}
          <div className="flex items-center flex-wrap gap-4 md:justify-end">
            {/* Credits Display */}
            <div 
              onClick={handleAddCredit}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-neon-red rounded-none text-xs cursor-pointer select-none transition-all duration-300 flex items-center gap-2 font-mono"
              title="Click para insertar crédito de combate"
              id="credit-display"
            >
              <span className="font-arcade text-[8px] text-zinc-500">CREDITS:</span>
              <span className="font-arcade text-[10px] text-yellow-400 font-bold">{creditCount}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-none border-2 transition-all duration-300 ${
                soundOn
                  ? 'bg-neon-blue/15 border-neon-blue text-neon-blue box-shadow-neon-blue'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
              }`}
              title={soundOn ? 'Silenciar sonidos de arcade' : 'Activar sonidos de arcade'}
              id="toggle-sound-btn"
            >
              {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Quick alert text */}
            <div className="hidden lg:block font-arcade text-[7px] text-zinc-600 leading-3 max-w-[120px]">
              INSERT COIN TO ACTIVATE SPECIAL MOVE LITERARY CRITIQUE
            </div>
          </div>

        </div>
      </header>

      {/* --- MAIN GAME SECTOR --- */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 relative z-10 flex flex-col gap-8">
        
        {/* TOP HUD: BATTLE STATS (Brutalist style) */}
        <div className="bg-[#0a0a0a] border-4 border-[#1a1a1a] p-5 rounded-none flex flex-col md:flex-row justify-between items-stretch md:items-end gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 retro-grid opacity-5 pointer-events-none" />
          
          <div 
            onClick={() => triggerSecretUnlock(
              'paris_neruda', 
              'París y Neruda: El Nacimiento en la Cocina', 
              '¡Secreto de París y Neruda descubierto! María Luisa Bombal escribió "La última niebla" en la cocina de Pablo Neruda en Buenos Aires, asimilando el surrealismo vanguardista.'
            )}
            className="w-full md:w-1/3 flex flex-col justify-end cursor-pointer group hover:bg-zinc-900/40 p-1.5 transition-all duration-300"
            title="¡Punto Secreto! Haz clic para desencadenar secreto biográfico de la protagonista."
            id="hud-onirismo-trigger"
          >
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#00E5FF] mb-1.5 font-black">
              <span>PROTAGONISTA (LVL 17)</span>
              <span className="group-hover:animate-bounce flex items-center gap-1">
                ONIRISMO: 99% <Key className="w-3 h-3 text-yellow-400" />
              </span>
            </div>
            <div className="h-4 bg-zinc-950 border-2 border-[#00E5FF] p-0.5 shadow-[0_0_10px_rgba(0,229,255,0.3)] group-hover:border-yellow-400">
              <div className="h-full bg-[#00E5FF] w-[85%] transition-all duration-1000 group-hover:bg-yellow-400"></div>
            </div>
          </div>
          
          <div className="text-center shrink-0 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 uppercase leading-none">
              BOMBAL: FOG OF WAR
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <p className="text-[10px] tracking-[0.3em] text-[#FF2E2E] font-bold uppercase">
                La Última Niebla Edition
              </p>
              <button 
                onClick={() => triggerSecretUnlock(
                  'amortajada_resurrect', 
                  'La Amortajada: Origen del "Second Wind"', 
                  '¡Secreto trascendental descubierto! La narración de Ana María desde su propio ataúd inspiró el concepto de resurrección espiritual o "Second Wind" de los juegos arcade.'
                )}
                className="text-zinc-600 hover:text-yellow-400 transition-colors cursor-pointer" 
                title="Clave Secreta: El Secreto de Ana María"
                id="secret-key-trigger"
              >
                <Key className="w-3.5 h-3.5 animate-pulse" />
              </button>
            </div>
          </div>
          
          <div 
            onClick={() => triggerSecretUnlock(
              'atentado_crillon', 
              'El Disparo del Crillón: ¡Un verdadero Boss Move!', 
              '¡Secreto violento descubierto! En 1941, herida por el desengaño amoroso, Bombal disparó tres tiros contra Eulogio Sánchez en el vestíbulo del elegante Hotel Crillón.'
            )}
            className="w-full md:w-1/3 flex flex-col justify-end cursor-pointer group hover:bg-zinc-900/40 p-1.5 transition-all duration-300"
            title="¡Punto Secreto! Haz clic para revelar el ataque letal biográfico de Bombal."
            id="hud-daniel-trigger"
          >
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#FF2E2E] mb-1.5 font-black">
              <span className="group-hover:animate-bounce flex items-center gap-1">
                <Key className="w-3 h-3 text-yellow-400" /> DANIEL STAMINA (BOSS)
              </span>
              <span>DANIEL (BOSS)</span>
            </div>
            <div className="h-4 bg-zinc-950 border-2 border-[#FF2E2E] p-0.5 shadow-[0_0_10px_rgba(255,46,46,0.3)] rotate-180 group-hover:border-yellow-400">
              <div className="h-full bg-[#FF2E2E] w-[60%] transition-all duration-1000 group-hover:bg-yellow-400"></div>
            </div>
          </div>
        </div>

        {/* MODE SELECTION CARDS (ARCADE MENU RAIL) */}
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0" id="mode-navigation-rail">
          {[
            { id: 'lore', label: 'THE LORE', subtitle: 'Trama por Niveles', icon: Swords, color: 'hover:border-[#00E5FF] active:bg-[#00E5FF]/10', activeClass: 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.15)]' },
            { id: 'fighters', label: 'FIGHTER SELECT', subtitle: 'Personajes & Stats', icon: Trophy, color: 'hover:border-[#FF2E2E] active:bg-[#FF2E2E]/10', activeClass: 'border-[#FF2E2E] text-[#FF2E2E] bg-[#FF2E2E]/5 shadow-[0_0_15px_rgba(255,46,46,0.15)]' },
            { id: 'combos', label: 'COMBO ANALYSIS', subtitle: 'Mecánicas de Símbolos', icon: Zap, color: 'hover:border-[#00E5FF] active:bg-[#00E5FF]/10', activeClass: 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.15)]' },
            { id: 'training', label: 'TRAINING MODE', subtitle: 'Survival & Desafío', icon: Play, color: 'hover:border-[#FF2E2E] active:bg-[#FF2E2E]/10', activeClass: 'border-[#FF2E2E] text-[#FF2E2E] bg-[#FF2E2E]/5 shadow-[0_0_15px_rgba(255,46,46,0.15)]' },
            { id: 'spectator', label: 'SPECTATOR MODE', subtitle: 'Teatro de Combate', icon: Tv, color: 'hover:border-[#00E5FF] active:bg-[#00E5FF]/10', activeClass: 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.15)]' },
            { id: 'eggs', label: 'EASTER EGGS', subtitle: 'Secretos de Bombal', icon: Info, color: 'hover:border-yellow-400 active:bg-yellow-400/10', activeClass: 'border-yellow-400 text-yellow-400 bg-yellow-400/5 shadow-[0_0_15px_rgba(250,204,21,0.15)]' }
          ].map((mode) => {
            const isSelected = activeMode === mode.id;
            const Icon = mode.icon;

            return (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleModeChange(mode.id as GameMode)}
                className={`flex flex-col items-center justify-center p-3 text-center border-2 font-display transition-all duration-300 relative rounded-none ${
                  isSelected 
                    ? mode.activeClass 
                    : `bg-zinc-950 border-zinc-800 text-zinc-400 ${mode.color}`
                }`}
                id={`nav-btn-${mode.id}`}
              >
                {/* Flashing neon corner brackets */}
                {isSelected && (
                  <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current" />
                  </>
                )}

                <Icon className="w-5 h-5 mb-1 shrink-0" />
                <span className="font-bold text-xs tracking-wider uppercase block">{mode.label}</span>
                <span className="text-[9px] text-zinc-500 font-sans tracking-wide block mt-0.5 truncate max-w-full">
                  {mode.subtitle}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* --- MAIN CRT DISPLAY MONITOR AREA --- */}
        <section className="relative rounded-none border-4 border-zinc-800 bg-zinc-950 p-6 md:p-8 overflow-hidden crt-screen shadow-inner flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="relative z-10"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>

      {/* --- ARCADE CABINET BASE / FOOTER --- */}
      <footer className="mt-auto bg-zinc-950 border-t-4 border-zinc-900 py-6 px-4 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-arcade text-[8px] text-neon-red tracking-widest uppercase">
              LA ÚLTIMA NIEBLA - GUÍA DE ESTUDIO COOPERATIVO
            </p>
            <p className="text-[11px] font-sans">
              Diseñado especialmente para estudiantes de Taekwondo y fans de los videojuegos arcade.
            </p>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="text-[11px]">
              Academia Literaria © 2026 // María Luisa Bombal (1910 - 1980)
            </p>
            <p className="font-arcade text-[6px] tracking-widest text-zinc-600 uppercase">
              SYSTEM POWERED BY GEMINI 3.5 FLASH LITERARY REFEREE ENGINE
            </p>
          </div>
        </div>
      </footer>

      {/* Dynamic secret unlock notification popup */}
      <AnimatePresence>
        {secretAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 max-w-sm bg-zinc-950 border-4 border-yellow-400 p-5 shadow-[0_0_30px_rgba(250,204,21,0.3)] rounded-none"
            id="secret-alert-popup"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-400 text-black border-2 border-black animate-pulse rounded-none">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-arcade text-[8px] text-yellow-400 uppercase tracking-widest block font-black">
                  ¡SECRET DISCOVERED / COFRE REVELADO!
                </span>
                <h4 className="text-xs font-arcade text-white tracking-wider uppercase font-black leading-tight">
                  {secretAlert.title}
                </h4>
                <p className="text-[11px] text-zinc-300 font-sans leading-relaxed pt-1 border-t border-zinc-900">
                  {secretAlert.desc}
                </p>
                <span className="text-[8px] text-zinc-500 font-mono block pt-1 uppercase font-black">
                  Accede a la pestaña EASTER EGGS para leer los detalles.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

