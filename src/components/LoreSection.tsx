import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { loreLevelsData, loreLevelsSeason2Data } from '../data';
import { LoreLevel } from '../types';
import { audio } from '../utils/audio';
import { Play, Shield, Lock, Swords, HelpCircle, BookOpen } from 'lucide-react';

interface LoreSectionProps {
  season?: number;
}

export default function LoreSection({ season = 1 }: LoreSectionProps) {
  const activeLoreList = season === 2 ? loreLevelsSeason2Data : loreLevelsData;
  const [selectedLevelId, setSelectedLevelId] = useState<string>(season === 2 ? 'padre_s2' : 'level1');
  const [showExtraStories, setShowExtraStories] = useState<boolean>(true);

  useEffect(() => {
    setSelectedLevelId(season === 2 ? 'padre_s2' : 'level1');
  }, [season]);

  const selectedLevel = activeLoreList.find(l => l.id === selectedLevelId) || activeLoreList[0];

  const handleSelectLevel = (id: string) => {
    audio.playSlash();
    setSelectedLevelId(id);
  };

  // Filter levels
  const displayedLevels = activeLoreList.filter(level => {
    if (level.id.startsWith('level_arbol') || level.id.startsWith('level_amortajada')) {
      return showExtraStories;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in" id="lore-section">
      {/* Header and Story Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-zinc-800 pb-4">
        <div>
          <h2 className={`font-display text-2xl font-black tracking-wider uppercase flex items-center gap-2 ${
            season === 2 
              ? 'text-purple-400 text-shadow-neon-purple' 
              : 'text-[#00E5FF] text-shadow-neon-blue'
          }`}>
            <Swords className={`w-6 h-6 animate-pulse ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`} />
            {season === 2 ? 'Season 2: Retrospectiva de La Amortajada' : 'The Lore: Etapas del Combate Existencial'}
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {season === 2
              ? 'Ana María desata su combo mental analizando los lazos terrestres y pasados desde el ataúd.'
              : 'La trama de "La última niebla" estructurada como niveles de un videojuego de pelea.'}
          </p>
        </div>

        {/* Toggle Extra Levels */}
        {season === 1 && (
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
        )}
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
                      ? season === 2
                        ? 'bg-zinc-900 border-l-8 border-purple-500 border-y-purple-500 border-r-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-zinc-900 border-l-8 border-[#FF2E2E] border-y-[#FF2E2E] border-r-[#FF2E2E]'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                  id={`stage-card-${level.id}`}
                >
                  {/* Visual Background Glow for current */}
                  {isSelected && (
                    <div className={`absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l pointer-events-none ${
                      season === 2 ? 'from-purple-500/10 to-transparent' : 'from-[#FF2E2E]/10 to-transparent'
                    }`} />
                  )}

                  <div className="flex items-center gap-4">
                    {/* Level Number Indicator */}
                    <div
                      className={`font-arcade text-xs w-10 h-10 rounded-none flex items-center justify-center border-2 shrink-0 transition-all ${
                        isSelected
                          ? season === 2
                            ? 'bg-purple-600 border-purple-500 text-white font-black'
                            : 'bg-[#FF2E2E] border-[#FF2E2E] text-black font-black'
                          : isExtra
                          ? season === 2
                            ? 'bg-zinc-900 border-zinc-800 text-purple-400'
                            : 'bg-zinc-900 border-zinc-800 text-[#FF2E2E]'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isExtra ? 'EX' : `0${level.levelNum}`}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-display text-xs font-black tracking-wider uppercase ${
                          isSelected 
                            ? season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]' 
                            : 'text-zinc-300'
                        }`}>
                          {level.title.includes(': ') ? level.title.split(': ')[1] : level.title}
                        </span>
                        {isExtra && (
                          <span className={`text-[9px] px-1.5 py-0.5 font-arcade bg-purple-950/20 rounded-none border ${
                            season === 2 ? 'text-purple-400 border-purple-500/30' : 'text-[#FF2E2E] border-[#FF2E2E]/30'
                          }`}>
                            DLC
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{level.subtitle}</p>
                    </div>

                    {/* Indicator Icon */}
                    <div>
                      {isSelected ? (
                        <span className={`font-arcade text-[9px] animate-pulse ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`}>
                          {season === 2 ? 'TRÁNSITO' : 'FIGHT!'}
                        </span>
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
            className={`bg-zinc-950 border-4 rounded-none overflow-hidden relative ${
              season === 2 ? 'border-purple-900/60' : 'border-zinc-800'
            }`}
            id="active-stage-preview"
          >
            {/* Scanlines overlay on preview screen */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-transparent to-black/80 pointer-events-none z-10" />

            {/* Stage Title Header */}
            <div className="bg-[#111] border-b-2 border-zinc-800 p-4 flex justify-between items-center z-20 relative">
              <div>
                <span className={`font-arcade text-[9px] tracking-wider uppercase ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`}>
                  {season === 2 ? 'ACTIVE STAGE AREA // GHOST LORE AREA' : 'ACTIVE STAGE AREA // LORE AREA'}
                </span>
                <h3 className="font-display text-lg font-black text-white tracking-wide mt-1 uppercase">
                  {selectedLevel.title}
                </h3>
              </div>
              <div className="px-3 py-1 bg-zinc-950 rounded-none text-xs text-zinc-400 font-mono border-2 border-zinc-800">
                {season === 2 ? 'DLC SEASON 2' : selectedLevel.id.includes('arbol') || selectedLevel.id.includes('amortajada') ? 'UNLOCKED EXTRA' : 'STAGE CAMPAIGN'}
              </div>
            </div>

            {/* Stage Core Info Panel */}
            <div className="p-6 space-y-6 relative z-20">
              {/* Plot Summary Block */}
              <div className="space-y-2">
                <p className="font-display text-xs text-zinc-500 tracking-wider uppercase font-black">
                  {season === 2 ? 'MISSION RETROSPECTIVE / REVELACIÓN EN EL ATAÚD:' : 'PLOT BRIEFING / RESUMEN DEL NIVEL:'}
                </p>
                <div className={`p-4 bg-zinc-950 border-2 rounded-none text-sm text-zinc-300 leading-relaxed font-sans shadow-inner ${
                  season === 2 ? 'border-purple-900/40' : 'border-zinc-800'
                }`}>
                  {selectedLevel.description}
                </div>
              </div>

              {/* Literary Context Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lit Analysis */}
                <div className={`p-4 bg-[#111] border-l-4 rounded-none space-y-1.5 ${
                  season === 2 ? 'border-purple-500' : 'border-[#00E5FF]'
                }`}>
                  <div className="flex items-center gap-2">
                    <BookOpen className={`w-4 h-4 ${season === 2 ? 'text-purple-400' : 'text-[#00E5FF]'}`} />
                    <span className={`font-display text-xs font-black tracking-wider uppercase ${
                      season === 2 ? 'text-purple-400' : 'text-[#00E5FF]'
                    }`}>
                      LITERARY STRATEGY:
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {selectedLevel.literaryContext}
                  </p>
                </div>

                {/* Boss Fight info */}
                <div className={`p-4 bg-[#111] border-l-4 rounded-none space-y-1.5 ${
                  season === 2 ? 'border-purple-400' : 'border-[#FF2E2E]'
                }`}>
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`} />
                    <span className={`font-display text-xs font-black tracking-wider uppercase ${
                      season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'
                    }`}>
                      {season === 2 ? 'STAGE OBSTACLE / LAZO:' : 'STAGE BOSS / JEFE:'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white font-display uppercase tracking-wide">
                      {selectedLevel.bossName}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {season === 2 ? 'Fuerza Desatada: ' : 'Ataque Especial: '}
                      <span className={`font-mono ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`}>
                        {selectedLevel.bossSkill}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Decorative Bar */}
              <div className="pt-2 border-t border-zinc-800/80 flex justify-between items-center text-xs text-zinc-600 font-mono">
                <span>STAGE RECT: [3000 x 1080px]</span>
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full animate-ping inline-block ${season === 2 ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                  {season === 2 ? 'ONLINE: GHOST_MODE_ACTIVE_V.2' : 'ONLINE: SYSTEM_STABLE_V.17'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
