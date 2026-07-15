import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fightersData, fightersSeason2Data } from '../data';
import { Fighter } from '../types';
import { audio } from '../utils/audio';
import { Zap, ShieldAlert, Swords, Heart, Activity } from 'lucide-react';

interface FighterSelectProps {
  season?: number;
}

export default function FighterSelect({ season = 1 }: FighterSelectProps) {
  const activeFightersList = season === 2 ? fightersSeason2Data : fightersData;
  const [selectedId, setSelectedId] = useState<string>(season === 2 ? 'anamaria' : 'protagonist');

  useEffect(() => {
    setSelectedId(season === 2 ? 'anamaria' : 'protagonist');
  }, [season]);

  const selectedFighter = activeFightersList.find(f => f.id === selectedId) || activeFightersList[0];

  const handleSelectFighter = (id: string) => {
    setSelectedId(id);
    audio.playKihap(); // Every character selection outputs an action sound / Kihap!
  };

  // Helper for rendering arcade key tags (inputs)
  const renderInputKeys = (inputStr: string) => {
    return inputStr.split(' ').map((key, idx) => {
      const isArrow = ['↓', '↘', '→', '↙', '←', '↑'].includes(key);
      return (
        <span
          key={idx}
          className={`inline-block px-1.5 py-0.5 rounded font-arcade text-[10px] mx-0.5 select-none ${
            isArrow
              ? 'bg-zinc-800 border border-zinc-700 text-neon-blue'
              : season === 2
                ? 'bg-purple-950/20 border border-purple-500/40 text-purple-400 font-bold'
                : 'bg-neon-red/10 border border-neon-red/40 text-neon-red font-bold'
          }`}
        >
          {key}
        </span>
      );
    });
  };

  return (
    <div className="space-y-8 animate-fade-in" id="fighter-select-section">
      {/* Header */}
      <div className="border-b-2 border-zinc-800 pb-4">
        <h2 className={`font-display text-2xl font-black tracking-wider uppercase flex items-center gap-2 ${
          season === 2 
            ? 'text-purple-400 text-shadow-neon-purple' 
            : 'text-[#FF2E2E] text-shadow-neon-pink'
        }`}>
          <Zap className={`w-6 h-6 animate-pulse ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`} />
          {season === 2 ? 'Fighter Select Season 2: Elenco de La Amortajada' : 'Fighter Select: Elenco de Personajes'}
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          {season === 2
            ? 'Examina las fichas técnicas, atributos esenciales y los movimientos especiales de Ana María y sus vínculos terrenales.'
            : 'Examina las fichas técnicas, atributos esenciales y los movimientos especiales de cada protagonista.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CHARACTER GRID SELECTION */}
        <div className="lg:col-span-4 flex flex-col justify-start space-y-4">
          <span className="font-arcade text-[9px] tracking-widest text-zinc-500 uppercase font-black">
            CHOOSE YOUR FIGHTER / SELECCIONA FICHA:
          </span>

          <div className="grid grid-cols-2 gap-4">
            {activeFightersList.map((fighter) => {
              const isSelected = fighter.id === selectedId;
              
              // Custom neon style depending on character theme
              const neonBorder = 
                season === 2
                  ? 'hover:border-purple-500 border-purple-500'
                  : fighter.id === 'protagonist' 
                    ? 'hover:border-[#00E5FF] border-[#00E5FF]' 
                    : fighter.id === 'daniel'
                      ? 'hover:border-zinc-500 border-zinc-500'
                      : fighter.id === 'regina'
                        ? 'hover:border-[#FF2E2E] border-[#FF2E2E]'
                        : 'hover:border-cyan-400 border-cyan-400';

              const cardBg = isSelected 
                ? 'bg-zinc-900 border-l-8' 
                : 'bg-zinc-950 border-2 hover:bg-zinc-900/60';

              return (
                <motion.div
                  key={fighter.id}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectFighter(fighter.id)}
                  className={`cursor-pointer p-3 rounded-none border-2 flex flex-col items-center justify-center h-32 transition-all duration-300 relative overflow-hidden ${cardBg} ${
                    isSelected ? neonBorder : 'border-zinc-800'
                  }`}
                  id={`fighter-select-${fighter.id}`}
                >
                  {/* Small decorative grid lines */}
                  <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none" />

                  {/* Character Initial Indicator */}
                  <div className={`font-arcade text-lg rounded-none w-10 h-10 flex items-center justify-center border-2 mb-2 ${
                    isSelected 
                      ? 'bg-zinc-950 text-white' 
                      : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                  }`}
                  style={{
                    borderColor: isSelected 
                      ? season === 2 
                        ? '#A855F7'
                        : (fighter.id === 'protagonist' ? '#00E5FF' : fighter.id === 'regina' ? '#FF2E2E' : fighter.id === 'daniel' ? '#94a3b8' : '#22d3ee')
                      : '#27272a'
                  }}>
                    {fighter.name === 'Ana María' ? 'AM' : fighter.name[0]}
                  </div>

                  <span className={`font-display text-xs font-black tracking-wider uppercase text-center mt-1 truncate max-w-full ${
                    isSelected ? 'text-white font-black' : 'text-zinc-500'
                  }`}>
                    {fighter.name}
                  </span>

                  <span className="text-[9px] font-mono text-zinc-600 truncate uppercase mt-0.5">
                    {fighter.attribute}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Voice play button */}
          <button
            onClick={() => {
              audio.playKihap();
            }}
            className={`w-full py-2.5 mt-2 font-display text-xs tracking-wider bg-zinc-950 hover:bg-zinc-900 border-2 border-zinc-800 rounded-none transition-all duration-300 flex items-center justify-center gap-2 ${
              season === 2 ? 'text-purple-400 hover:border-purple-500' : 'text-[#00E5FF] hover:border-[#00E5FF]'
            }`}
          >
            <Activity className="w-4 h-4 animate-pulse" />
            REPRODUCIR KIHAP GRUNT (TAEKWONDO)
          </button>
        </div>

        {/* CHARACTER BIO AND STATS SCREEN */}
        <div className="lg:col-span-8">
          <motion.div
            key={selectedFighter.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-zinc-950 border-4 rounded-none p-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative ${
              season === 2 ? 'border-purple-900/60' : 'border-zinc-800'
            }`}
            id="fighter-profile-sheet"
          >
            {/* Fighter description Column */}
            <div className="space-y-4">
              <div>
                <span className={`font-arcade text-[8px] tracking-widest uppercase ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`}>
                  {season === 2 ? 'GHOST CHARACTER PORTFOLIO // STATS SHEET' : 'CHARACTER PORTFOLIO // STATS SHEET'}
                </span>
                <h3 className="font-display text-2xl font-black text-white uppercase tracking-wider mt-1">
                  {selectedFighter.name}
                </h3>
                <p className="text-xs text-zinc-400 font-mono italic mt-0.5">
                  "{selectedFighter.title}"
                </p>
              </div>

              {/* Bio Block */}
              <div className="space-y-1">
                <span className="text-[10px] font-display text-zinc-500 uppercase tracking-widest font-black">
                  BIOGRAPHY / PERFIL LITERARIO:
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {selectedFighter.bio}
                </p>
              </div>

              {/* Unique Attribute Block */}
              <div className="p-3 bg-[#111] border-2 border-zinc-800 rounded-none space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className={`font-arcade text-[9px] animate-pulse ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`}>
                    {season === 2 ? 'POST-MORTEM ATTRIBUTE:' : 'SPECIAL ABILITY:'}
                  </span>
                  <span className="text-xs font-display font-black text-white uppercase tracking-wide">
                    {selectedFighter.attribute}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {selectedFighter.attributeDesc}
                </p>
              </div>
            </div>

            {/* Fighter Stats and Moves Column */}
            <div className="space-y-5">
              {/* Stats Block */}
              <div className="space-y-2">
                <span className="text-[10px] font-display text-zinc-500 uppercase tracking-widest font-black">
                  {season === 2 ? 'GHOST STATS / VALORES POST-MORTEM:' : 'CHARACTER STATS / VALORES EXISTENCIALES:'}
                </span>
                <div className="space-y-2">
                  {selectedFighter.stats.map((stat, idx) => {
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-display text-zinc-300 tracking-wide font-black uppercase text-[11px]">{stat.name}</span>
                          <span className="font-arcade text-[9px] text-white">{stat.value}/100</span>
                        </div>
                        {/* Custom arcade progress bar with ticks */}
                        <div className="h-3 w-full bg-zinc-950 rounded-none overflow-hidden p-0.5 border-2 border-zinc-900 flex items-center">
                          <div
                            className={`h-full rounded-none ${stat.color} transition-all duration-1000`}
                            style={{ width: `${stat.value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Moves list block */}
              <div className="space-y-2 pt-2 border-t-2 border-zinc-800/60">
                <span className="text-[10px] font-display text-zinc-500 uppercase tracking-widest flex items-center gap-1 font-black">
                  <Swords className={`w-3.5 h-3.5 ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`} />
                  MOVE LIST / COMBOS LITERARIOS:
                </span>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {selectedFighter.specialMoves.map((move, idx) => {
                    return (
                      <div key={idx} className="p-2 bg-[#111] hover:bg-[#151515] border-2 border-zinc-900 rounded-none transition-all">
                        <div className="flex justify-between items-center flex-wrap gap-1">
                          <span className="text-xs font-black font-display text-white uppercase">{move.name}</span>
                          <div className="flex items-center">
                            {renderInputKeys(move.input)}
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-sans mt-1">
                          {move.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
