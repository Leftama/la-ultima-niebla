import React, { useState } from 'react';
import { motion } from 'motion/react';
import { comboSymbolsData } from '../data';
import { audio } from '../utils/audio';
import { Cloud, Waves, VolumeX, ShieldAlert, Zap, AlertOctagon } from 'lucide-react';

export default function ComboAnalysis() {
  const [activeSymbolId, setActiveSymbolId] = useState<string>('niebla');

  const activeSymbol = comboSymbolsData.find(s => s.id === activeSymbolId) || comboSymbolsData[0];

  const handleSelectSymbol = (id: string) => {
    audio.playSlash();
    setActiveSymbolId(id);
  };

  // Icon mapping
  const renderIcon = (iconId: string, className: string) => {
    switch (iconId) {
      case 'Cloud':
        return <Cloud className={className} />;
      case 'Waves':
        return <Waves className={className} />;
      case 'VolumeX':
        return <VolumeX className={className} />;
      default:
        return <ShieldAlert className={className} />;
    }
  };

  return (
    <div className="space-y-8" id="combo-analysis-section">
      {/* Header */}
      <div className="border-b-2 border-zinc-800 pb-4">
        <h2 className="font-display text-2xl font-black tracking-wider text-[#00E5FF] uppercase text-shadow-neon-blue flex items-center gap-2">
          <ShieldAlert className="text-[#00E5FF] w-6 h-6 animate-pulse" />
          Combo Analysis: Los Símbolos como Mecánicas
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          La simbología de María Luisa Bombal redefinida como estados alterados de pelea (Buffs, Debuffs y Presión).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comboSymbolsData.map((symbol) => {
          const isSelected = symbol.id === activeSymbolId;
          const isNiebla = symbol.id === 'niebla';
          const isEstanque = symbol.id === 'estanque';
          const isSilencio = symbol.id === 'silencio';

          // Accent colors
          const accentColorClass = isNiebla
            ? 'text-slate-400 border-slate-700 hover:border-slate-400'
            : isEstanque
            ? 'text-[#00E5FF] border-sky-950 hover:border-[#00E5FF]'
            : 'text-[#FF2E2E] border-red-950 hover:border-[#FF2E2E]';

          const cardBgClass = isSelected
            ? 'bg-zinc-900 border-l-8'
            : 'bg-zinc-950 border-2 hover:bg-zinc-900/40';

          return (
            <motion.div
              key={symbol.id}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectSymbol(symbol.id)}
              className={`cursor-pointer p-5 rounded-none border-2 flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden ${cardBgClass} ${accentColorClass} ${
                isSelected
                  ? isNiebla
                    ? 'border-slate-400'
                    : isEstanque
                    ? 'border-[#00E5FF]'
                    : 'border-[#FF2E2E]'
                  : 'border-zinc-800'
              }`}
              id={`symbol-card-${symbol.id}`}
            >
              {/* Top status indicator tag */}
              <span className={`text-[8px] font-arcade px-2 py-0.5 rounded-none uppercase border-2 font-bold mb-4 ${
                isSelected ? 'bg-zinc-950' : 'bg-transparent text-zinc-600 border-zinc-800'
              }`}
              style={{
                color: isSelected 
                  ? (isNiebla ? '#94a3b8' : isEstanque ? '#00E5FF' : '#FF2E2E') 
                  : '',
                borderColor: isSelected
                  ? (isNiebla ? '#475569' : isEstanque ? '#082f49' : '#7f1d1d')
                  : ''
              }}>
                {symbol.mechanicName}
              </span>

              {/* Icon Container */}
              <div className={`p-4 rounded-none border-2 mb-4 transition-all ${
                isSelected
                  ? isNiebla
                    ? 'bg-slate-900 border-slate-500 text-slate-300 animate-pulse'
                    : isEstanque
                    ? 'bg-sky-950 border-[#00E5FF] text-[#00E5FF] animate-pulse'
                    : 'bg-red-950 border-[#FF2E2E] text-[#FF2E2E] animate-pulse'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
              }`}>
                {renderIcon(symbol.icon, 'w-8 h-8')}
              </div>

              {/* Symbol Name */}
              <span className={`font-display text-base font-black tracking-wider uppercase ${
                isSelected ? 'text-white font-black' : 'text-zinc-500'
              }`}>
                {symbol.name}
              </span>

              <span className="text-[10px] font-mono text-zinc-600 tracking-wide mt-1 uppercase font-black">
                {symbol.mechanicName.split(' ')[1] || 'MECHANIC'} SYSTEM
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* DETAIL DISPLAY MONITOR */}
      <motion.div
        key={activeSymbol.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-950 border-4 border-zinc-800 rounded-none p-6 relative overflow-hidden"
        id="symbol-mechanic-monitor"
      >
        {/* Subtle grid lines background to resemble an arcade CRT screen */}
        <div className="absolute inset-0 retro-grid opacity-5 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          {/* Action Header Column */}
          <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0 md:pr-6">
            <div>
              <span className="font-arcade text-[8px] tracking-wider text-[#00E5FF] uppercase">
                GAME SYSTEMS DIAGNOSTICS
              </span>
              <h3 className="font-display text-xl font-black text-white uppercase tracking-wide mt-1">
                {activeSymbol.name}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                Mecánica: <span className="text-[#FF2E2E] font-black">{activeSymbol.mechanicName}</span>
              </p>
            </div>

            <div className="mt-4 p-4 bg-[#111] border-2 border-zinc-900 rounded-none space-y-1">
              <span className="font-arcade text-[8px] tracking-wide text-[#FF2E2E] uppercase block font-black">
                GAMEPLAY EFFECT / IMPACTO EN JUEGO:
              </span>

              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {activeSymbol.gameplayEffect}
              </p>
            </div>
          </div>

          {/* Deep Literary analysis column */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-4 md:pl-4">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-[#FF2E2E]" />
              <span className="font-display text-xs font-black text-[#FF2E2E] tracking-widest uppercase">
                LITERARY SIGNIFICANCE / EL SECRETO DEL SÍMBOLO:
              </span>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed font-sans first-letter:text-3xl first-letter:font-black first-letter:text-[#FF2E2E] first-letter:mr-1">
              {activeSymbol.literaryMeaning}
            </p>

            {/* Quick tips */}
            <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>CLASS_ANALYSIS: BOMBAL_1934</span>
              <span>METÁFORAS ACTIVAS</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
