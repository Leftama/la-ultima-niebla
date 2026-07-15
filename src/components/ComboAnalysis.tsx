import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { comboSymbolsData, comboSymbolsSeason2Data } from '../data';
import { audio } from '../utils/audio';
import { Cloud, Waves, VolumeX, ShieldAlert, Zap, AlertOctagon } from 'lucide-react';

interface ComboAnalysisProps {
  season?: number;
}

export default function ComboAnalysis({ season = 1 }: ComboAnalysisProps) {
  const activeSymbolsList = season === 2 ? comboSymbolsSeason2Data : comboSymbolsData;
  const [activeSymbolId, setActiveSymbolId] = useState<string>(season === 2 ? 'doble_muerte' : 'niebla');

  useEffect(() => {
    setActiveSymbolId(season === 2 ? 'doble_muerte' : 'niebla');
  }, [season]);

  const activeSymbol = activeSymbolsList.find(s => s.id === activeSymbolId) || activeSymbolsList[0];

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
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      default:
        return <ShieldAlert className={className} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="combo-analysis-section">
      {/* Header */}
      <div className="border-b-2 border-zinc-800 pb-4">
        <h2 className={`font-display text-2xl font-black tracking-wider uppercase flex items-center gap-2 ${
          season === 2 
            ? 'text-purple-400 text-shadow-neon-purple' 
            : 'text-[#00E5FF] text-shadow-neon-blue'
        }`}>
          <ShieldAlert className={`w-6 h-6 animate-pulse ${season === 2 ? 'text-purple-400' : 'text-[#00E5FF]'}`} />
          {season === 2 ? 'Combo Analysis Season 2: Los Símbolos de La Amortajada' : 'Combo Analysis: Los Símbolos como Mecánicas'}
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          {season === 2
            ? 'La simbología telúrica y mística de La amortajada redefinida como estados de combate post-mortem.'
            : 'La simbología de María Luisa Bombal redefinida como estados alterados de pelea (Buffs, Debuffs y Presión).'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeSymbolsList.map((symbol) => {
          const isSelected = symbol.id === activeSymbolId;
          const isS1Niebla = symbol.id === 'niebla';
          const isS1Estanque = symbol.id === 'estanque';
          const isS1Silencio = symbol.id === 'silencio';

          const isS2DobleMuerte = symbol.id === 'doble_muerte';
          const isS2Velo = symbol.id === 'velo_venda';
          const isS2Naturaleza = symbol.id === 'naturaleza_guerrera';

          // Accent colors
          let accentColorClass = '';
          if (season === 2) {
            accentColorClass = isS2DobleMuerte
              ? 'text-zinc-400 border-zinc-800 hover:border-zinc-400'
              : isS2Velo
              ? 'text-purple-400 border-purple-950 hover:border-purple-400'
              : 'text-emerald-400 border-emerald-950 hover:border-emerald-400';
          } else {
            accentColorClass = isS1Niebla
              ? 'text-slate-400 border-slate-700 hover:border-slate-400'
              : isS1Estanque
              ? 'text-[#00E5FF] border-sky-950 hover:border-[#00E5FF]'
              : 'text-[#FF2E2E] border-red-950 hover:border-[#FF2E2E]';
          }

          let selectBorderColor = 'border-zinc-800';
          if (isSelected) {
            if (season === 2) {
              selectBorderColor = isS2DobleMuerte ? 'border-zinc-400' : isS2Velo ? 'border-purple-400' : 'border-emerald-400';
            } else {
              selectBorderColor = isS1Niebla ? 'border-slate-400' : isS1Estanque ? 'border-[#00E5FF]' : 'border-[#FF2E2E]';
            }
          }

          const cardBgClass = isSelected
            ? 'bg-zinc-900 border-l-8'
            : 'bg-zinc-950 border-2 hover:bg-zinc-900/40';

          return (
            <motion.div
              key={symbol.id}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectSymbol(symbol.id)}
              className={`cursor-pointer p-5 rounded-none border-2 flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden ${cardBgClass} ${accentColorClass} ${selectBorderColor}`}
              id={`symbol-card-${symbol.id}`}
            >
              {/* Top status indicator tag */}
              <span className={`text-[8px] font-arcade px-2 py-0.5 rounded-none uppercase border-2 font-bold mb-4 ${
                isSelected ? 'bg-zinc-950' : 'bg-transparent text-zinc-600 border-zinc-800'
              }`}
              style={{
                color: isSelected 
                  ? season === 2
                    ? (isS2DobleMuerte ? '#a1a1aa' : isS2Velo ? '#c084fc' : '#34d399')
                    : (isS1Niebla ? '#94a3b8' : isS1Estanque ? '#00E5FF' : '#FF2E2E') 
                  : '',
                borderColor: isSelected
                  ? season === 2
                    ? (isS2DobleMuerte ? '#27272a' : isS2Velo ? '#581c87' : '#064e3b')
                    : (isS1Niebla ? '#475569' : isS1Estanque ? '#082f49' : '#7f1d1d')
                  : ''
              }}>
                {symbol.mechanicName}
              </span>

              {/* Icon Container */}
              <div className={`p-4 rounded-none border-2 mb-4 transition-all ${
                isSelected
                  ? season === 2
                    ? isS2DobleMuerte
                      ? 'bg-zinc-900 border-zinc-500 text-zinc-300 animate-pulse'
                      : isS2Velo
                      ? 'bg-purple-950 border-purple-500 text-purple-400 animate-pulse'
                      : 'bg-emerald-950 border-emerald-500 text-emerald-400 animate-pulse'
                    : isS1Niebla
                    ? 'bg-slate-900 border-slate-500 text-slate-300 animate-pulse'
                    : isS1Estanque
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
        className={`bg-zinc-950 border-4 rounded-none p-6 relative overflow-hidden ${
          season === 2 ? 'border-purple-900/50' : 'border-zinc-800'
        }`}
        id="symbol-mechanic-monitor"
      >
        {/* Subtle grid lines background to resemble an arcade CRT screen */}
        <div className="absolute inset-0 retro-grid opacity-5 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          {/* Action Header Column */}
          <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0 md:pr-6">
            <div>
              <span className={`font-arcade text-[8px] tracking-wider uppercase ${season === 2 ? 'text-purple-400' : 'text-[#00E5FF]'}`}>
                {season === 2 ? 'POST-MORTEM SYSTEMS DIAGNOSTICS' : 'GAME SYSTEMS DIAGNOSTICS'}
              </span>
              <h3 className="font-display text-xl font-black text-white uppercase tracking-wide mt-1">
                {activeSymbol.name}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                Mecánica: <span className={`font-black ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`}>{activeSymbol.mechanicName}</span>
              </p>
            </div>

            <div className="mt-4 p-4 bg-[#111] border-2 border-zinc-900 rounded-none space-y-1">
              <span className={`font-arcade text-[8px] tracking-wide uppercase block font-black ${
                season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'
              }`}>
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
              <AlertOctagon className={`w-4 h-4 ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`} />
              <span className={`font-display text-xs font-black tracking-widest uppercase ${
                season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'
              }`}>
                LITERARY SIGNIFICANCE / EL SECRETO DEL SÍMBOLO:
              </span>
            </div>

            <p className={`text-sm text-zinc-300 leading-relaxed font-sans first-letter:text-3xl first-letter:font-black first-letter:mr-1 ${
              season === 2 ? 'first-letter:text-purple-400' : 'first-letter:text-[#FF2E2E]'
            }`}>
              {activeSymbol.literaryMeaning}
            </p>

            {/* Quick tips */}
            <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>{season === 2 ? 'CLASS_ANALYSIS: LA_AMORTAJADA_1938' : 'CLASS_ANALYSIS: BOMBAL_1934'}</span>
              <span>METÁFORAS ACTIVAS</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
