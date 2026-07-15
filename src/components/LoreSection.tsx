import React, { useState } from 'react';
import { motion } from 'motion/react';
import { loreLevelsData } from '../data';
import { LoreLevel } from '../types';
import { audio } from '../utils/audio';
import { Play, Shield, Lock, Swords, HelpCircle, BookOpen } from 'lucide-react';

export default function LoreSection() {
  const [selectedLevelId, setSelectedLevelId] = useState<string>('level1');
  const [showExtraStories, setShowExtraStories] = useState<boolean>(true);

  const selectedLevel = loreLevelsData.find(l => l.id === selectedLevelId) || loreLevelsData[0];

  const handleSelectLevel = (id: string) => {
    audio.playSlash();
    setSelectedLevelId(id);
  };

  // Filter levels
  const displayedLevels = loreLevelsData.filter(level => {
    if (level.id.startsWith('level_arbol') || level.id.startsWith('level_amortajada')) {
      return showExtraStories;
    }
    return true;
  });

  return (
    <div className="space-y-8" id="lore-section">
      {/* Header and Story Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-zinc-800 pb-4">
        <div>
          <h2 className="font-display text-2xl font-black tracking-wider text-[#00E5FF] uppercase text-shadow-neon-blue flex items-center gap-2">
            <Swords className="text-[#FF2E2E] w-6 h-6 animate-pulse" />
            The Lore: Etapas del Combate Existencial
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            La trama de "La última niebla" estructurada como niveles de un videojuego de pelea.
          </p>
        </div>

        {/* Toggle Extra Levels */}
        <button
          onClick={() => {
            audio.playCoin();
            setShowExtraStories(!showExtraStories);
          }}
          className={`px-4 py-2 font-display text-xs tracking-wider border-2 rounded-none transition-all duration-300 flex items-center gap-2 ${
            showExtraStories
              ? 'bg-[#FF2E2E] border-[#FF2E2E] text-black font-black'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
          }`}
          id="btn-toggle-extra"
        >
          <BookOpen className="w-4 h-4" />
          {showExtraStories ? 'OCULTAR NIVELES EXTRA' : 'DESBLOQUEAR CUENTOS EXTRA'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEVEL SELECTION RAIL */}
        <div className="lg:col-span-5 space-y-3">
          <p className="font-display text-xs text-zinc-500 tracking-widest uppercase mb-2 font-black">
            STAGE SELECT / SELECCIONA ETAPA:
          </p>
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
            {displayedLevels.map((level) => {
              const isSelected = level.id === selectedLevelId;
              const isExtra = level.id.includes('arbol') || level.id.includes('amortajada');

              return (
                <motion.div
                  key={level.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectLevel(level.id)}
                  className={`cursor-pointer p-4 rounded-none border-2 transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? 'bg-zinc-900 border-l-8 border-[#FF2E2E] border-y-[#FF2E2E] border-r-[#FF2E2E]'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                  id={`stage-card-${level.id}`}
                >
                  {/* Visual Background Glow for current */}
                  {isSelected && (
                    <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-[#FF2E2E]/10 to-transparent pointer-events-none" />
                  )}

                  <div className="flex items-center gap-4">
                    {/* Level Number Indicator */}
                    <div
                      className={`font-arcade text-xs w-10 h-10 rounded-none flex items-center justify-center border-2 shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[#FF2E2E] border-[#FF2E2E] text-black font-black'
                          : isExtra
                          ? 'bg-zinc-900 border-zinc-800 text-[#FF2E2E]'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isExtra ? 'EX' : `0${level.levelNum}`}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-display text-xs font-black tracking-wider uppercase ${
                          isSelected ? 'text-[#FF2E2E]' : isExtra ? 'text-zinc-300' : 'text-zinc-300'
                        }`}>
                          {level.title.split(': ')[1]}
                        </span>
                        {isExtra && (
                          <span className="text-[9px] px-1.5 py-0.5 font-arcade bg-red-950/20 text-[#FF2E2E] border border-[#FF2E2E]/30 rounded-none">
                            DLC
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{level.subtitle}</p>
                    </div>

                    {/* Indicator Icon */}
                    <div>
                      {isSelected ? (
                        <span className="text-[#FF2E2E] font-arcade text-[9px] animate-pulse">FIGHT!</span>
                      ) : (
                        <Play className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ACTIVE STAGE PREVIEW SCREEN */}
        <div className="lg:col-span-7">
          <motion.div
            key={selectedLevel.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-950 border-4 border-zinc-800 rounded-none overflow-hidden relative"
            id="active-stage-preview"
          >
            {/* Scanlines overlay on preview screen */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-transparent to-black/80 pointer-events-none z-10" />

            {/* Stage Title Header */}
            <div className="bg-[#111] border-b-2 border-zinc-800 p-4 flex justify-between items-center z-20 relative">
              <div>
                <span className="font-arcade text-[9px] tracking-wider text-[#FF2E2E] uppercase">
                  ACTIVE STAGE AREA // LORE AREA
                </span>
                <h3 className="font-display text-lg font-black text-white tracking-wide mt-1 uppercase">
                  {selectedLevel.title}
                </h3>
              </div>
              <div className="px-3 py-1 bg-zinc-950 rounded-none text-xs text-zinc-400 font-mono border-2 border-zinc-800">
                {selectedLevel.id.includes('arbol') || selectedLevel.id.includes('amortajada') ? 'UNLOCKED EXTRA' : 'STAGE CAMPAIGN'}
              </div>
            </div>

            {/* Stage Core Info Panel */}
            <div className="p-6 space-y-6 relative z-20">
              {/* Plot Summary Block */}
              <div className="space-y-2">
                <p className="font-display text-xs text-zinc-500 tracking-wider uppercase font-black">
                  PLOT BRIEFING / RESUMEN DEL NIVEL:
                </p>
                <div className="p-4 bg-zinc-950 border-2 border-zinc-800 rounded-none text-sm text-zinc-300 leading-relaxed font-sans shadow-inner">
                  {selectedLevel.description}
                </div>
              </div>

              {/* Literary Context Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lit Analysis */}
                <div className="p-4 bg-[#111] border-l-4 border-[#00E5FF] rounded-none space-y-1.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#00E5FF]" />
                    <span className="font-display text-xs font-black text-[#00E5FF] tracking-wider uppercase">
                      LITERARY STRATEGY:
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {selectedLevel.literaryContext}
                  </p>
                </div>

                {/* Boss Fight info */}
                <div className="p-4 bg-[#111] border-l-4 border-[#FF2E2E] rounded-none space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#FF2E2E]" />
                    <span className="font-display text-xs font-black text-[#FF2E2E] tracking-wider uppercase">
                      STAGE BOSS / JEFE:
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white font-display uppercase tracking-wide">
                      {selectedLevel.bossName}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Ataque Especial: <span className="text-[#FF2E2E] font-mono">{selectedLevel.bossSkill}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Decorative Bar */}
              <div className="pt-2 border-t border-zinc-800/80 flex justify-between items-center text-xs text-zinc-600 font-mono">
                <span>STAGE RECT: [3000 x 1080px]</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  ONLINE: SYSTEM_STABLE_V.17
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
