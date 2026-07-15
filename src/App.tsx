import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoreSection from './components/LoreSection';
import FighterSelect from './components/FighterSelect';
import ComboAnalysis from './components/ComboAnalysis';
import TrainingMode from './components/TrainingMode';
import EasterEggs from './components/EasterEggs';
import SpectatorMode from './components/SpectatorMode';
import { audio } from './utils/audio';
import { Swords, Volume2, VolumeX, Zap, Trophy, Play, Gamepad2, Info, Tv, Sparkles, Key, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerRightDown } from 'lucide-react';

type GameMode = 'lore' | 'fighters' | 'combos' | 'training' | 'eggs' | 'spectator';

export default function App() {
  const [activeMode, setActiveMode] = useState<GameMode>('lore');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [creditCount, setCreditCount] = useState<number>(99);
  const [season, setSeason] = useState<number>(1);

  // --- TRANSITION & COMBO MECHANICS ---
  const [isKicking, setIsKicking] = useState<boolean>(false);
  const [isShattered, setIsShattered] = useState<boolean>(false);
  const [virtualCombo, setVirtualCombo] = useState<string[]>([]);
  const [keyboardCombo, setKeyboardCombo] = useState<string[]>([]);

  const [secretAlert, setSecretAlert] = useState<{ title: string; desc: string } | null>(null);

  // Keyboard combo listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
        setKeyboardCombo(prev => {
          const updated = [...prev, key].slice(-5);
          if (
            updated[0] === 'ArrowUp' &&
            updated[1] === 'ArrowDown' &&
            updated[2] === 'ArrowLeft' &&
            updated[3] === 'ArrowRight' &&
            updated[4] === ' '
          ) {
            triggerDollyoChagiTransition();
            return [];
          }
          return updated;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [season]);

  const triggerDollyoChagiTransition = () => {
    if (isKicking) return;
    setIsKicking(true);
    audio.playKihap();

    // Moment of impact (600ms)
    setTimeout(() => {
      audio.playScreenShatter();
      setIsShattered(true);
      
      const newSeason = season === 1 ? 2 : 1;
      setSeason(newSeason);
      setActiveMode('lore'); // Switch automatically to Lore so they see the level selection updates!

      if (newSeason === 2) {
        audio.startGhostAmbience();
      } else {
        audio.stopGhostAmbience();
      }
    }, 600);

    // End transition (1800ms)
    setTimeout(() => {
      setIsKicking(false);
      setIsShattered(false);
    }, 1800);
  };

  const handleVirtualButtonClick = (input: string) => {
    audio.playHit();
    setVirtualCombo(prev => {
      const updated = [...prev, input].slice(-5);
      // If they press kick (Space), verify previous directional buttons
      if (input === 'Space') {
        if (
          updated[0] === 'ArrowUp' &&
          updated[1] === 'ArrowDown' &&
          updated[2] === 'ArrowLeft' &&
          updated[3] === 'ArrowRight' &&
          updated[4] === 'Space'
        ) {
          triggerDollyoChagiTransition();
          return [];
        } else {
          // Play a small failed attack sound
          audio.playSlash();
          return [];
        }
      }
      return updated;
    });
  };

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
        return <LoreSection season={season} />;
      case 'fighters':
        return <FighterSelect season={season} />;
      case 'combos':
        return <ComboAnalysis season={season} />;
      case 'training':
        return <TrainingMode season={season} />;
      case 'eggs':
        return <EasterEggs />;
      case 'spectator':
        return <SpectatorMode season={season} />;
      default:
        return <LoreSection season={season} />;
    }
  };

  // Shards generator for the glass breaking animation
  const shards = Array.from({ length: 32 }).map((_, i) => {
    const angle = (i * (360 / 32) * Math.PI) / 180;
    const distance = 120 + Math.random() * 320;
    const size = 15 + Math.random() * 40;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size,
    };
  });

  return (
    <div className={`min-h-screen text-zinc-100 font-sans relative overflow-x-hidden flex flex-col border-4 md:border-8 lg:border-[12px] transition-all duration-1000 ${
      season === 2 
        ? 'bg-[#0f0f12] border-zinc-800 selection:bg-purple-600 selection:text-white' 
        : 'bg-arcade-dark border-zinc-900 selection:bg-neon-red selection:text-black'
    }`}>
      {/* Decorative cyber grid backdrop */}
      <div className={`absolute inset-0 retro-grid opacity-10 pointer-events-none z-0 transition-opacity duration-1000 ${
        season === 2 ? 'opacity-[0.06]' : 'opacity-10'
      }`} />
      
      {/* Decorative ambient background glows */}
      <div className={`absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
        season === 2 ? 'bg-purple-600/10' : 'bg-neon-blue/10'
      }`} />
      <div className={`absolute bottom-1/4 -right-48 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
        season === 2 ? 'bg-indigo-600/10' : 'bg-neon-pink/10'
      }`} />

      {/* --- ARCADE TOP BAR HUD --- */}
      <header className={`border-b-4 bg-zinc-950 relative z-10 px-4 py-4 md:py-6 shadow-2xl transition-all duration-1000 ${
        season === 2 
          ? 'border-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
          : 'border-neon-red'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-4">
            <div className={`border-2 p-2.5 rounded-none animate-pulse transition-all duration-1000 ${
              season === 2 
                ? 'bg-purple-950/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                : 'bg-neon-red/15 border-neon-red shadow-[0_0_15px_rgba(255,51,51,0.2)]'
            }`}>
              <Gamepad2 className={`w-8 h-8 ${season === 2 ? 'text-purple-400' : 'text-neon-red'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`font-display text-2xl md:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r uppercase italic transition-all duration-1000 ${
                  season === 2 
                    ? 'from-white via-zinc-400 to-purple-500 text-shadow-neon-purple' 
                    : 'from-white via-zinc-200 to-neon-red text-shadow-neon-red'
                }`}>
                  {season === 2 ? 'LA AMORTAJADA' : 'LA ÚLTIMA NIEBLA'}
                </h1>
                <span className={`font-arcade text-[8px] px-1.5 py-0.5 rounded-none font-extrabold tracking-widest animate-pulse transition-all duration-1000 ${
                  season === 2 ? 'bg-purple-600 text-white' : 'bg-neon-red text-black'
                }`}>
                  {season === 2 ? 'GHOST DLC ACTIVE' : 'ARCADE'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mt-0.5 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full inline-block animate-ping ${season === 2 ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                {season === 2 
                  ? 'Estudio de Comunión Telúrica // María Luisa Bombal' 
                  : 'Estudio de Combate Literario // María Luisa Bombal'}
              </p>
            </div>
          </div>

          {/* Controls Panel (Mute, Credits, Insert Coin) */}
          <div className="flex items-center flex-wrap gap-4 md:justify-end">
            {/* Credits Display */}
            <div 
              onClick={handleAddCredit}
              className={`px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 rounded-none text-xs cursor-pointer select-none transition-all duration-300 flex items-center gap-2 font-mono ${
                season === 2 ? 'hover:border-purple-500' : 'hover:border-neon-red'
              }`}
              title="Click para insertar crédito de combate"
              id="credit-display"
            >
              <span className="font-arcade text-[8px] text-zinc-500">CREDITS:</span>
              <span className="font-arcade text-[10px] text-yellow-400 font-bold">{creditCount}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-none border-2 transition-all duration-300 cursor-pointer ${
                soundOn
                  ? season === 2 
                    ? 'bg-purple-950/20 border-purple-500 text-purple-400' 
                    : 'bg-neon-blue/15 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,229,255,0.15)]'
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
        <div className={`bg-[#0a0a0a] border-4 p-5 rounded-none flex flex-col md:flex-row justify-between items-stretch md:items-end gap-6 shadow-2xl relative overflow-hidden transition-all duration-1000 ${
          season === 2 ? 'border-purple-900/60' : 'border-[#1a1a1a]'
        }`}>
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
            <div className={`flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-black ${
              season === 2 ? 'text-purple-400' : 'text-[#00E5FF]'
            }`}>
              <span>{season === 2 ? 'ANA MARÍA (GHOST)' : 'PROTAGONISTA (LVL 17)'}</span>
              <span className="group-hover:animate-bounce flex items-center gap-1">
                {season === 2 ? 'MÍSTICA: 99%' : 'ONIRISMO: 99%'} <Key className="w-3 h-3 text-yellow-400" />
              </span>
            </div>
            <div className={`h-4 bg-zinc-950 border-2 p-0.5 group-hover:border-yellow-400 transition-all ${
              season === 2 ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
            }`}>
              <div className={`h-full w-[85%] transition-all duration-1000 group-hover:bg-yellow-400 ${
                season === 2 ? 'bg-purple-500' : 'bg-[#00E5FF]'
              }`}></div>
            </div>
          </div>
          
          <div className="text-center shrink-0 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 uppercase leading-none">
              {season === 2 ? 'BOMBAL: GHOST MODE' : 'BOMBAL: FOG OF WAR'}
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <p className={`text-[10px] tracking-[0.3em] font-bold uppercase transition-all duration-1000 ${
                season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'
              }`}>
                {season === 2 ? 'La Amortajada DLC' : 'La Última Niebla Edition'}
              </p>
              <button 
                onClick={() => triggerSecretUnlock(
                  'amortajada_resurrect', 
                  'La Amortajada: Origen del "Second Wind"', 
                  '¡Secreto trascendental descubierto! La narración de Ana María desde su propio ataúd inspiró el concepto de resurrección espiritual o "Second Wind" de los juegos arcade.'
                )}
                className="text-zinc-600 hover:text-yellow-400 transition-colors cursor-pointer bg-transparent border-0" 
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
            <div className={`flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-black ${
              season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'
            }`}>
              <span className="group-hover:animate-bounce flex items-center gap-1">
                <Key className="w-3 h-3 text-yellow-400" /> {season === 2 ? 'ANTONIO ARREPENTIMIENTO' : 'DANIEL STAMINA (BOSS)'}
              </span>
              <span>{season === 2 ? 'ANTONIO (HUSBAND)' : 'DANIEL (BOSS)'}</span>
            </div>
            <div className={`h-4 bg-zinc-950 border-2 p-0.5 rotate-180 group-hover:border-yellow-400 transition-all ${
              season === 2 ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-[#FF2E2E] shadow-[0_0_10px_rgba(255,46,46,0.3)]'
            }`}>
              <div className={`h-full w-[60%] transition-all duration-1000 group-hover:bg-yellow-400 ${
                season === 2 ? 'bg-purple-500' : 'bg-[#FF2E2E]'
              }`}></div>
            </div>
          </div>
        </div>

        {/* --- TAEKWONDO INTERACTIVE FIGHTPAD (SEASON CONTROLLER) --- */}
        <div className={`bg-zinc-950 border-2 p-4 rounded-none flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
          season === 2 ? 'border-purple-900/60 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'border-zinc-900'
        }`} id="taekwondo-controller">
          <div className="space-y-1 text-center md:text-left">
            <span className={`font-arcade text-[8px] tracking-widest uppercase block font-black ${
              season === 2 ? 'text-purple-400' : 'text-neon-red'
            }`}>
              {season === 2 ? 'GHOST COMBO CHEAT CODE // DOLLYO CHAGI KICK' : 'TAEKWONDO CONTROLLER // COMBO CHEAT'}
            </span>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Presiona en tu teclado <span className="text-white font-bold bg-zinc-900 px-1.5 py-0.5 border border-zinc-700">↑, ↓, ←, →, luego ESPACIO</span> para ejecutar una patada circular circular (<span className="text-yellow-400 font-semibold">Dollyo Chagi</span>) que fractura la pantalla y cambia la temporada literaria.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Interactive D-pad UI */}
            <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1.5 border border-zinc-800 rounded-none shrink-0 select-none">
              <button 
                onClick={() => handleVirtualButtonClick('ArrowUp')}
                className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white rounded-none cursor-pointer"
                title="D-Pad Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleVirtualButtonClick('ArrowDown')}
                className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white rounded-none cursor-pointer"
                title="D-Pad Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleVirtualButtonClick('ArrowLeft')}
                className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white rounded-none cursor-pointer"
                title="D-Pad Left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleVirtualButtonClick('ArrowRight')}
                className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white rounded-none cursor-pointer"
                title="D-Pad Right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              
              <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

              <button 
                onClick={() => handleVirtualButtonClick('Space')}
                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 font-arcade text-[8px] text-white rounded-none font-black shadow-[0_0_8px_rgba(220,38,38,0.4)] cursor-pointer"
                title="Execute Dollyo Chagi Kick!"
              >
                KICK (SPACE)
              </button>
            </div>

            {/* Quick manual swap button */}
            <button
              onClick={triggerDollyoChagiTransition}
              className={`px-4 py-2.5 font-display text-xs tracking-wider border-2 rounded-none font-black transition-all cursor-pointer ${
                season === 2
                  ? 'bg-zinc-900 border-purple-500 text-purple-400 hover:bg-zinc-800'
                  : 'bg-zinc-900 border-neon-red text-[#FF2E2E] hover:bg-zinc-800'
              }`}
              id="manual-season-toggle-btn"
            >
              {season === 2 ? '← RETORNAR A LA ÚLTIMA NIEBLA' : 'ACTIVAR EXPANSION GHOST MODE (DLC) →'}
            </button>
          </div>
        </div>

        {/* MODE SELECTION CARDS (ARCADE MENU RAIL) */}
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0" id="mode-navigation-rail">
          {[
            { 
              id: 'lore', 
              label: 'THE LORE', 
              subtitle: season === 2 ? 'Misión Retrospectiva' : 'Trama por Niveles', 
              icon: Swords, 
              color: season === 2 ? 'hover:border-purple-500 active:bg-purple-500/10' : 'hover:border-[#00E5FF] active:bg-[#00E5FF]/10', 
              activeClass: season === 2 
                ? 'border-purple-500 text-purple-400 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                : 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
            },
            { 
              id: 'fighters', 
              label: 'FIGHTER SELECT', 
              subtitle: season === 2 ? 'Vínculos & Atributos' : 'Personajes & Stats', 
              icon: Trophy, 
              color: season === 2 ? 'hover:border-purple-500 active:bg-purple-500/10' : 'hover:border-[#FF2E2E] active:bg-[#FF2E2E]/10', 
              activeClass: season === 2 
                ? 'border-purple-500 text-purple-400 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                : 'border-[#FF2E2E] text-[#FF2E2E] bg-[#FF2E2E]/5 shadow-[0_0_15px_rgba(255,46,46,0.15)]' 
            },
            { 
              id: 'combos', 
              label: 'COMBO ANALYSIS', 
              subtitle: season === 2 ? 'Mecánicas Místicas' : 'Mecánicas de Símbolos', 
              icon: Zap, 
              color: season === 2 ? 'hover:border-purple-500 active:bg-purple-500/10' : 'hover:border-[#00E5FF] active:bg-[#00E5FF]/10', 
              activeClass: season === 2 
                ? 'border-purple-500 text-purple-400 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                : 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
            },
            { 
              id: 'training', 
              label: 'TRAINING MODE', 
              subtitle: season === 2 ? 'Comunión & Desafío' : 'Survival & Desafío', 
              icon: Play, 
              color: season === 2 ? 'hover:border-purple-500 active:bg-purple-500/10' : 'hover:border-[#FF2E2E] active:bg-[#FF2E2E]/10', 
              activeClass: season === 2 
                ? 'border-purple-500 text-purple-400 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                : 'border-[#FF2E2E] text-[#FF2E2E] bg-[#FF2E2E]/5 shadow-[0_0_15px_rgba(255,46,46,0.15)]' 
            },
            { 
              id: 'spectator', 
              label: 'SPECTATOR MODE', 
              subtitle: 'Teatro de Combate', 
              icon: Tv, 
              color: season === 2 ? 'hover:border-purple-500 active:bg-purple-500/10' : 'hover:border-[#00E5FF] active:bg-[#00E5FF]/10', 
              activeClass: season === 2 
                ? 'border-purple-500 text-purple-400 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                : 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
            },
            { 
              id: 'eggs', 
              label: 'EASTER EGGS', 
              subtitle: 'Secretos de Bombal', 
              icon: Info, 
              color: 'hover:border-yellow-400 active:bg-yellow-400/10', 
              activeClass: 'border-yellow-400 text-yellow-400 bg-yellow-400/5 shadow-[0_0_15px_rgba(250,204,21,0.15)]' 
            }
          ].map((mode) => {
            const isSelected = activeMode === mode.id;
            const Icon = mode.icon;

            return (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleModeChange(mode.id as GameMode)}
                className={`flex flex-col items-center justify-center p-3 text-center border-2 font-display transition-all duration-300 relative rounded-none cursor-pointer ${
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
        <section className={`relative rounded-none border-4 bg-zinc-950 p-6 md:p-8 overflow-hidden crt-screen shadow-inner flex-grow transition-all duration-1000 ${
          season === 2 ? 'border-purple-900/60' : 'border-zinc-800'
        }`}>
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
            <p className={`font-arcade text-[8px] tracking-widest uppercase transition-all duration-1000 ${
              season === 2 ? 'text-purple-400' : 'text-neon-red'
            }`}>
              {season === 2 ? 'LA AMORTAJADA - GUÍA DE ESTUDIO COOPERATIVO' : 'LA ÚLTIMA NIEBLA - GUÍA DE ESTUDIO COOPERATIVO'}
            </p>
            <p className="text-[11px] font-sans">
              {season === 2
                ? 'Diseñado con estética de "Ghost Mode" de La amortajada con acentos morados y transparencias de ceniza.'
                : 'Diseñado especialmente para estudiantes de Taekwondo y fans de los videojuegos arcade.'}
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

      {/* --- DOLLYO CHAGI FULLSCREEN KICK & BREAK OVERLAY --- */}
      <AnimatePresence>
        {isKicking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden"
          >
            {/* Spinning Silhouette of Kick */}
            <motion.div
              initial={{ scale: 0.3, rotate: -180, opacity: 0 }}
              animate={{ scale: [0.3, 1.4, 1], rotate: [0, 360, 720], opacity: [0, 1, 1] }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="relative w-80 h-80 flex items-center justify-center"
            >
              {/* Dynamic martial arts kick drawing lines using SVG */}
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" stroke={season === 1 ? '#A855F7' : '#FF2E2E'} strokeWidth="2" strokeDasharray="5 5" className="animate-spin" style={{ animationDuration: '4s' }} />
                
                {/* Taekwondo Kick pose silhouette */}
                <path d="M70 140 L90 120 L95 90 L140 40" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M140 40 L160 20" stroke={season === 1 ? '#A855F7' : '#FF2E2E'} strokeWidth="8" strokeLinecap="round" />
                <path d="M95 90 L115 130" stroke="white" strokeWidth="4" strokeLinecap="round" />
                
                {/* Visual impact strike glow */}
                <circle cx="160" cy="20" r="15" fill={season === 1 ? 'rgba(168,85,247,0.6)' : 'rgba(255,46,46,0.6)'} className="animate-ping" />
              </svg>

              <div className="absolute text-center mt-32">
                <span className={`font-arcade text-lg tracking-widest block font-black ${
                  season === 1 ? 'text-purple-400' : 'text-[#FF2E2E]'
                }`}>
                  DOLLYO CHAGI!
                </span>
                <span className="font-display text-[10px] text-zinc-400 tracking-wider uppercase font-black">
                  PATADA CIRCULAR DE TAEKWONDO
                </span>
              </div>
            </motion.div>

            {/* Flying Glass Shatter Shards Overlay */}
            {isShattered && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                {shards.map((shard) => {
                  return (
                    <motion.div
                      key={shard.id}
                      initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                      animate={{ 
                        x: shard.x, 
                        y: shard.y, 
                        scale: [1, 0.4, 0], 
                        opacity: [1, 0.8, 0], 
                        rotate: Math.random() * 720 
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`absolute border border-white/40 ${
                        season === 2 ? 'bg-purple-600/30' : 'bg-red-600/30'
                      }`}
                      style={{
                        width: shard.size,
                        height: shard.size,
                        clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                      }}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
