import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { easterEggsData } from '../data';
import { audio } from '../utils/audio';
import { Trophy, AlertOctagon, Sparkles, Gift, Key, HelpCircle } from 'lucide-react';

export default function EasterEggs() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bombal_unlocked_eggs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return ['paris_neruda']; // One starts unlocked as teaser
  });

  const [selectedEggId, setSelectedEggId] = useState<string>('paris_neruda');

  // Keep state synchronized with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('bombal_unlocked_eggs');
      if (saved) {
        try {
          setUnlockedIds(JSON.parse(saved));
        } catch (e) {}
      }
    };
    
    window.addEventListener('focus', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('focus', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const selectedEgg = easterEggsData.find(e => e.id === selectedEggId) || easterEggsData[0];

  const handleSelectEgg = (id: string) => {
    audio.playSlash();
    setSelectedEggId(id);
  };

  // Custom hint helper depending on which secret egg is locked
  const getUnlockHint = (id: string) => {
    switch (id) {
      case 'paris_neruda':
        return 'Pista de Acceso: El nacimiento secreto en la cocina de Neruda. Busca y haz clic en la barra celeste de "ONIRISMO: 99%" de la protagonista en el HUD superior de combate.';
      case 'atentado_crillon':
        return 'Pista de Acceso: ¡El ataque letal en el elegante Hotel Crillón en 1941! Busca el indicador de salud rojo de "DANIEL STAMINA (BOSS)" en el HUD superior de combate y haz clic sobre él para forzar la apertura.';
      case 'amortajada_resurrect':
        return 'Pista de Acceso: El misterio narrativo del ataúd que inspiró el "Second Wind". Busca una LLAVE dorada pequeña parpadeante junto al subtítulo de "La Última Niebla Edition" en el centro del HUD superior y haz clic para desbloquear este dato.';
      default:
        return 'Pista de Acceso: Explora los rincones secretos e interactivos del HUD de combate o interactúa con el sitio para forzar el descifrado.';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="easter-eggs-section">
      {/* Header */}
      <div className="border-b-2 border-zinc-800 pb-4">
        <h2 className="font-display text-2xl font-black tracking-wider text-yellow-400 uppercase text-shadow-neon-pink flex items-center gap-2">
          <Gift className="text-yellow-400 w-6 h-6 animate-bounce" />
          Easter Eggs: Archivo Secreto de Bombal
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          Secretos de la tormentosa e inigualable biografía de María Luisa Bombal, diseñados como trofeos arcade. ¡Debes descubrirlos haciendo clic en partes específicas del diseño superior!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* TROPHY CABINET GRID */}
        <div className="lg:col-span-5 space-y-3">
          <span className="font-arcade text-[8px] tracking-widest text-zinc-500 uppercase block font-black">
            SELECT TROPHY / COFRE DE SECRETOS:
          </span>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {easterEggsData.map((egg) => {
              const isUnlocked = unlockedIds.includes(egg.id);
              const isSelected = egg.id === selectedEggId;

              return (
                <motion.div
                  key={egg.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    handleSelectEgg(egg.id);
                  }}
                  className={`cursor-pointer p-4 rounded-none border-2 transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? 'bg-zinc-900 border-yellow-500'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                  id={`egg-card-${egg.id}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Trophy icon or locked sign */}
                    <div className={`w-10 h-10 rounded-none border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-yellow-400 border-yellow-400 text-black'
                        : isUnlocked
                        ? 'bg-zinc-900 border-yellow-600/50 text-yellow-500'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-700'
                    }`}>
                      {isUnlocked ? (
                        <Trophy className="w-5 h-5 animate-pulse" />
                      ) : (
                        <Key className="w-5 h-5 text-zinc-600 animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className={`font-display text-xs font-black tracking-wider uppercase block truncate ${
                        isUnlocked ? (isSelected ? 'text-yellow-400' : 'text-zinc-200') : 'text-zinc-500 font-bold'
                      }`}>
                        {isUnlocked ? egg.title : 'SECRET DATA LOCKED'}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block mt-0.5 font-bold">
                        {egg.badge} // {isUnlocked ? 'DESBLOQUEADO' : 'MISTERIO ENCRIPTADO'}
                      </span>
                    </div>
                  </div>

                  {/* Locked indicator tag overlay */}
                  {!isUnlocked && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-900 border-2 border-zinc-800 px-2 py-1 rounded-none text-[8px] font-arcade text-[#FF2E2E] animate-pulse font-black">
                      LOCKED
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* DETAILS VIEWER PANELS */}
        <div className="lg:col-span-7">
          <motion.div
            key={selectedEggId + '_' + unlockedIds.includes(selectedEggId)}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-950 border-4 border-zinc-800 rounded-none p-6 relative overflow-hidden h-full flex flex-col justify-between"
            id="egg-viewer"
          >
            {/* Retro overlay grids */}
            <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none" />

            {unlockedIds.includes(selectedEggId) ? (
              <div className="space-y-6 relative z-10 animate-fade-in">
                {/* Header info */}
                <div>
                  <span className="font-arcade text-[8px] text-yellow-400 uppercase tracking-widest block font-black">
                    BIOGRAPHICAL EASTER EGG // ARCHIVO UNLOCKED
                  </span>
                  <h3 className="font-display text-lg font-black text-white uppercase tracking-wider mt-1">
                    {selectedEgg.title}
                  </h3>
                  <div className="inline-block px-2.5 py-0.5 mt-1.5 rounded-none border-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-[10px] font-display uppercase tracking-wider font-black">
                    {selectedEgg.badge}
                  </div>
                </div>

                {/* Descriptive Body */}
                <div className="space-y-2">
                  <span className="text-[10px] font-display text-zinc-500 uppercase tracking-widest block font-black">
                    ANÉCDOTA HISTÓRICA / EL RELATO:
                  </span>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed p-4 bg-[#111] border-2 border-zinc-900 rounded-none">
                    {selectedEgg.description}
                  </p>
                </div>

                {/* Game application connection */}
                <div className="p-4 bg-zinc-900 border-2 border-l-8 border-l-yellow-400 border-zinc-900 rounded-none space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="font-display text-xs font-black text-yellow-400 tracking-wider uppercase">
                      COMBO IMPACT / EFECTO ARCADE:
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    {selectedEgg.gameConnection}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-6 relative z-10">
                <AlertOctagon className="w-12 h-12 text-[#FF2E2E] animate-pulse" />
                <div className="space-y-2">
                  <h4 className="font-arcade text-[10px] text-red-500 tracking-wider font-black">ARCHIVO ENCRIPTADO</h4>
                  <p className="text-xs text-zinc-400 font-sans mt-1 max-w-sm">
                    Este archivo biográfico está sellado por la censura del tiempo. Debes descifrarlo interactuando sutilmente con los elementos del HUD superior del sitio.
                  </p>
                </div>

                {/* Customized Unlock Hint block */}
                <div className="p-4 bg-zinc-900/60 border-2 border-dashed border-zinc-800 rounded-none max-w-md w-full space-y-2 text-left">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span className="font-arcade text-[8px] text-yellow-500 font-black uppercase tracking-wider">
                      CÓDIGO DE DESCIFRADO (PISTA):
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed italic">
                    "{getUnlockHint(selectedEggId)}"
                  </p>
                </div>
              </div>
            )}

            {/* Technical Footer */}
            <div className="pt-4 mt-6 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-600 font-mono relative z-10 font-black">
              <span>ESTATUS: {unlockedIds.length}/{easterEggsData.length} SECRETOS REVELADOS</span>
              <span>BOMBAL_BIOGRAPHY_SYS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
