import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../utils/audio';
import { 
  Play, 
  Tv, 
  RotateCcw, 
  Cpu, 
  Zap, 
  Activity, 
  Flame, 
  Cloud, 
  Waves, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  CornerDownRight, 
  ShieldAlert 
} from 'lucide-react';

interface ComboStep {
  text: string;
  action: 'idle' | 'charge' | 'strike' | 'special' | 'finish' | 'evade';
  attacker: 'protagonist' | 'daniel' | 'regina' | 'lover' | 'none';
  defender: 'protagonist' | 'daniel' | 'regina' | 'lover' | 'none';
  hpImpact: { protagonist?: number; daniel?: number };
  kihapSound?: boolean;
  hitSound?: boolean;
}

interface SpectatorItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'character' | 'symbol';
  description: string;
  literarySignificance: string;
  themeColor: string; // hex or tailwind text class
  bgGradient: string;
  steps: ComboStep[];
}

const spectatorCombos: SpectatorItem[] = [
  {
    id: 'vuelo_deseo',
    title: 'Protagonista vs Daniel: "Vuelo del Deseo"',
    subtitle: 'Choque de Evasión Onírica vs Silencio Conyugal',
    type: 'character',
    description: 'La protagonista rompe la inercia doméstica y asesta un combo aéreo de alta intensidad espiritual contra Daniel.',
    literarySignificance: 'Simboliza el escape de las limitaciones reales de la protagonista. Al desmaterializarse en la niebla y atacar con su deseo onírico, ella derrota la asfixia silenciosa impuesta por Daniel y su moralidad pragmática.',
    themeColor: '#00E5FF',
    bgGradient: 'from-sky-950/40 via-zinc-950 to-zinc-950',
    steps: [
      {
        text: 'ROUND 1... FIGHT! Ambos contrincantes toman distancia.',
        action: 'idle',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: 'Daniel acumula "Presión de Rutina" (Barrera de Desdén activa). Su defensa aumenta.',
        action: 'charge',
        attacker: 'daniel',
        defender: 'protagonist',
        hpImpact: {}
      },
      {
        text: 'La Protagonista esquiva la inercia con "Evasión de Niebla" y se desmaterializa en el aire húmedo.',
        action: 'evade',
        attacker: 'protagonist',
        defender: 'daniel',
        hpImpact: {},
        kihapSound: true
      },
      {
        text: '¡IMPACTO CRÍTICO! La Protagonista desciende en picado con "Vuelo del Deseo", quebrando el silencio de Daniel.',
        action: 'strike',
        attacker: 'protagonist',
        defender: 'daniel',
        hpImpact: { daniel: -35 },
        kihapSound: true,
        hitSound: true
      },
      {
        text: 'Daniel queda aturdido (STUNNED) por la revelación de la sensualidad y el color del amor prohibido.',
        action: 'special',
        attacker: 'protagonist',
        defender: 'daniel',
        hpImpact: { daniel: -25 },
        hitSound: true
      },
      {
        text: '¡K.O. COGNITIVO! El deseo vence momentáneamente a la moral doméstica. Daniel se retrae en su gélido desprecio.',
        action: 'finish',
        attacker: 'protagonist',
        defender: 'daniel',
        hpImpact: { daniel: -40 },
        kihapSound: true,
        hitSound: true
      }
    ]
  },
  {
    id: 'furia_carnal',
    title: 'Regina vs Daniel: "Furia Carnal"',
    subtitle: 'Pasión Tangible vs La Norma Patriarcal',
    type: 'character',
    description: 'Regina desata una ofensiva ruidosa, terrenal y transgresora que golpea las leyes de decoro impuestas por Daniel.',
    literarySignificance: 'Regina no sueña: ella vive su pasión prohibida en el plano carnal con un amante de carne y hueso. Su rebelión es un golpe directo y sangriento contra el aburrimiento familiar, asumiendo riesgos destructivos pero reales.',
    themeColor: '#FF2E2E',
    bgGradient: 'from-red-950/40 via-zinc-950 to-zinc-950',
    steps: [
      {
        text: '¡ASALTO REBELDE! Regina avanza con postura ofensiva. Daniel prepara su contraataque.',
        action: 'idle',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: 'Regina desata el "Grito de Rebeldía". Las ondas sonoras de su pasión carnal agrietan las paredes de la casa.',
        action: 'charge',
        attacker: 'regina',
        defender: 'daniel',
        hpImpact: { daniel: -15 },
        kihapSound: true
      },
      {
        text: 'Daniel intenta bloquear usando "Ancla de Rutina", invocando las responsabilidades de la finca.',
        action: 'special',
        attacker: 'daniel',
        defender: 'regina',
        hpImpact: { protagonist: -15 },
        hitSound: true
      },
      {
        text: '¡FUEGO DIRECTO! Regina golpea con "Disparo del Amante", rompiendo la guardia fría del hacendado.',
        action: 'strike',
        attacker: 'regina',
        defender: 'daniel',
        hpImpact: { daniel: -45 },
        kihapSound: true,
        hitSound: true
      },
      {
        text: 'Regina utiliza el "Sacrificio Trágico". Entrega su estabilidad mental para asestar el golpe final.',
        action: 'finish',
        attacker: 'regina',
        defender: 'daniel',
        hpImpact: { daniel: -40 },
        kihapSound: true,
        hitSound: true
      }
    ]
  },
  {
    id: 'eco_niebla',
    title: 'El Amante: "Letargo de Fruta Estival"',
    subtitle: 'El Fantasma contra la Razón Pragmática',
    type: 'character',
    description: 'El Amante desvanece la realidad fáctica de Daniel envolviéndolo en un letargo sensorial irrompible.',
    literarySignificance: 'El Amante actúa como una anomalía mística. Su aroma de maderas y frutas estivales deshace el mundo utilitario del hacendado pragmático, demostrando que la fantasía sensorial tiene un peso existencial devastador.',
    themeColor: '#FACC15',
    bgGradient: 'from-yellow-950/30 via-zinc-950 to-zinc-950',
    steps: [
      {
        text: '¡ENCUENTRO FANTASMAL! El Amante flota en un halo dorado de misterio. Daniel desconfía de sus ojos.',
        action: 'idle',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: 'El Amante activa "Reflejo de Comunión", proyectando la luz dorada de su medalla de comunión.',
        action: 'charge',
        attacker: 'lover',
        defender: 'daniel',
        hpImpact: { daniel: -20 },
        kihapSound: true
      },
      {
        text: 'La realidad física de Daniel comienza a desestabilizarse por la nostalgia.',
        action: 'evade',
        attacker: 'lover',
        defender: 'daniel',
        hpImpact: {}
      },
      {
        text: '¡HECHIZO COMPLETO! El Amante lanza el "Aroma de Fruta de Verano", sumergiendo a Daniel en un letargo con aroma a pino.',
        action: 'strike',
        attacker: 'lover',
        defender: 'daniel',
        hpImpact: { daniel: -50 },
        kihapSound: true,
        hitSound: true
      },
      {
        text: 'El Amante se disuelve en "Desvanecimiento de Niebla", dejando al rival golpeando el vacío de su propia duda.',
        action: 'finish',
        attacker: 'lover',
        defender: 'daniel',
        hpImpact: { daniel: -30 },
        hitSound: true
      }
    ]
  },
  {
    id: 'simbolo_niebla',
    title: 'Invocación: La Niebla',
    subtitle: 'Environmental Debuff y Distorsión del Tiempo',
    type: 'symbol',
    description: 'El manto denso cubre el escenario de combate, diluyendo los ataques físicos y abriendo paso a la fantasía.',
    literarySignificance: 'La niebla amortigua la violencia conyugal, envolviendo el dolor de la protagonista en un capullo protector. Sin embargo, también impide ver la verdad de su confinamiento, actuando como refugio y trampa a la vez.',
    themeColor: '#94A3B8',
    bgGradient: 'from-slate-900/50 via-zinc-950 to-zinc-950',
    steps: [
      {
        text: 'La atmósfera de la hacienda se torna pesada y húmeda. La visibilidad se reduce a cero.',
        action: 'idle',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: 'El vapor cubre las miradas de Daniel y la moral social. Se desvanece la precisión física.',
        action: 'evade',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: '¡GOLPE DE AMBIGÜEDAD! La niebla distorsiona el flujo de las horas y los años, restando efectividad a la lógica.',
        action: 'special',
        attacker: 'none',
        defender: 'none',
        hpImpact: { daniel: -40 },
        kihapSound: true,
        hitSound: true
      },
      {
        text: 'La niebla triunfa como amortiguador poético. El combate se desplaza al plano subjetivo.',
        action: 'finish',
        attacker: 'none',
        defender: 'none',
        hpImpact: { daniel: -20 }
      }
    ]
  },
  {
    id: 'simbolo_estanque',
    title: 'Activación: El Estanque / Agua Helada',
    subtitle: 'Spiritual Recovery and Erotic Awakening',
    type: 'symbol',
    description: 'Sumergir el cuerpo purifica los sentidos y duplica instantáneamente la barra de energía erótica.',
    literarySignificance: 'El agua representa la purificación de la protagonista frente al polvo estéril de la finca. En el estanque ella recupera su dignidad carnal y se funde armónicamente con la frescura e independencia de la naturaleza.',
    themeColor: '#00E5FF',
    bgGradient: 'from-[#00E5FF]/10 via-zinc-950 to-zinc-950',
    steps: [
      {
        text: 'La protagonista huye de la cama matrimonial hacia la noche helada en busca de aire.',
        action: 'idle',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: 'Inmersión en el Estanque. El agua helada penetra su piel, devolviéndole la conciencia de su cuerpo.',
        action: 'charge',
        attacker: 'protagonist',
        defender: 'none',
        hpImpact: { protagonist: +40 },
        kihapSound: true
      },
      {
        text: '¡RENACIMIENTO SENSORIAL! La frescura de la naturaleza limpia el tedio doméstico y revitaliza el deseo.',
        action: 'strike',
        attacker: 'protagonist',
        defender: 'none',
        hpImpact: { protagonist: +30, daniel: -20 },
        kihapSound: true,
        hitSound: true
      },
      {
        text: 'El agua se asienta. La protagonista vuelve al combate vestida de gloria salvaje e independiente.',
        action: 'finish',
        attacker: 'protagonist',
        defender: 'none',
        hpImpact: { protagonist: +20 },
        hitSound: true
      }
    ]
  },
  {
    id: 'simbolo_silencio',
    title: 'Dominación: El Silencio',
    subtitle: 'El Antagonista Abstracto y la Devastación de los Años',
    type: 'symbol',
    description: 'El enemigo final e invisible que coloniza las habitaciones vacías y marchita los fervores.',
    literarySignificance: 'El silencio es el elemento letal definitivo en la narrativa de Bombal. No ataca de frente, sino que se infiltra por las rendijas del tiempo, consumiendo el vigor de la juventud y empujando a la mujer a la resignación muda.',
    themeColor: '#A855F7',
    bgGradient: 'from-purple-950/30 via-zinc-950 to-zinc-950',
    steps: [
      {
        text: 'La casa de campo se sume en un mutismo sepulcral. Daniel ya no habla, solo lee el periódico.',
        action: 'idle',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: 'El silencio devora las preguntas y los reclamos de pasión. Las cuerdas vocales se atrofian.',
        action: 'charge',
        attacker: 'daniel',
        defender: 'protagonist',
        hpImpact: { protagonist: -25 },
        hitSound: true
      },
      {
        text: 'Paso implacable del tiempo. La juventud de la protagonista es drenada día a día.',
        action: 'special',
        attacker: 'daniel',
        defender: 'protagonist',
        hpImpact: { protagonist: -35 },
        hitSound: true
      },
      {
        text: '¡IMPACTO FINAL! El silencio se consolida. Los sueños se marchitan. Se acepta una vejez gris sin dolor ni júbilo.',
        action: 'finish',
        attacker: 'daniel',
        defender: 'protagonist',
        hpImpact: { protagonist: -40 },
        kihapSound: true,
        hitSound: true
      }
    ]
  }
];

const spectatorCombosSeason2: SpectatorItem[] = [
  {
    id: 'doble_muerte_s2',
    title: 'Ana María vs Fernando: "Juicio Silencioso"',
    subtitle: 'El Veredicto de la Percepción Post-mortem',
    type: 'character',
    description: 'Ana María mira a Fernando desde su féretro, quebrando su obsesión celosa con una ráfaga de verdad descarnada.',
    literarySignificance: 'Fernando pretendía alimentarse de las debilidades de Ana María. Pero con su percepción post-mortem despierta, ella ve su cobardía y lo desarma por completo, rompiendo la inmovilidad conyugal.',
    themeColor: '#A855F7',
    bgGradient: 'from-purple-950/40 via-zinc-950 to-zinc-950',
    steps: [
      {
        text: 'INICIA EL JUICIO... ¡FIGHT! Fernando se acerca con falsas lágrimas.',
        action: 'idle',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: 'Fernando susurra viejas confesiones ponzoñosas para drenar el espíritu de Ana María.',
        action: 'charge',
        attacker: 'lover',
        defender: 'protagonist',
        hpImpact: { protagonist: -15 }
      },
      {
        text: '¡CONTRAATAQUE! Ana María ejecuta "Evasión de Sábana" y se vuelve incorpórea.',
        action: 'evade',
        attacker: 'protagonist',
        defender: 'none',
        hpImpact: {},
        kihapSound: true
      },
      {
        text: '¡IMPACTO DE VERDAD! Ana María desata el "Juicio Silencioso", revelando la sumisión cobarde de Fernando.',
        action: 'strike',
        attacker: 'protagonist',
        defender: 'lover',
        hpImpact: { daniel: -45 },
        kihapSound: true,
        hitSound: true
      },
      {
        text: '¡K.O. DEFECTUOSO! Fernando queda sepultado bajo el peso de su propia ridiculez. El alma de Ana María se libera.',
        action: 'finish',
        attacker: 'protagonist',
        defender: 'lover',
        hpImpact: { daniel: -40 },
        kihapSound: true,
        hitSound: true
      }
    ]
  },
  {
    id: 'ring_conyugal_s2',
    title: 'Ana María vs Antonio: "Lágrimas de Plomo"',
    subtitle: 'La Herida Conyugal deshecha por el Descanso',
    type: 'character',
    description: 'Antonio llora arrepentido ante el ataúd de Ana María. Ella lo observa con desapasionada piedad, perdonándolo.',
    literarySignificance: 'Las lágrimas tardías de Antonio delatan que el matrimonio opresor fue un infierno para ambos. Ana María, libre del resentimiento terrenal, disuelve la disputa mediante el perdón supremo de la muerte.',
    themeColor: '#A855F7',
    bgGradient: 'from-zinc-900/40 via-zinc-950 to-zinc-950',
    steps: [
      {
        text: '¡ROUND DE REDENCIÓN! Antonio contempla el rostro pálido de su esposa.',
        action: 'idle',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: 'Antonio gime y golpea el suelo con "Lágrimas de Plomo" cargadas de culpa conyugal.',
        action: 'charge',
        attacker: 'daniel',
        defender: 'protagonist',
        hpImpact: { protagonist: -10 }
      },
      {
        text: '¡CONEXIÓN TELÚRICA! Ana María convoca "Raíces del Tránsito" para absorber el golpe en la tierra.',
        action: 'evade',
        attacker: 'protagonist',
        defender: 'daniel',
        hpImpact: {},
        kihapSound: true
      },
      {
        text: '¡PERDÓN S-COMBO! Ana María proyecta una luz de comprensión post-mortem que libera a ambos del odio conyugal.',
        action: 'strike',
        attacker: 'protagonist',
        defender: 'daniel',
        hpImpact: { daniel: -55 },
        kihapSound: true,
        hitSound: true
      },
      {
        text: '¡FINISH! El dolor del matrimonio se disuelve en el fango sagrado. Antonio queda consolado y Ana María lista para partir.',
        action: 'finish',
        attacker: 'protagonist',
        defender: 'daniel',
        hpImpact: { daniel: -35 },
        hitSound: true
      }
    ]
  },
  {
    id: 'comunion_tierra_s2',
    title: 'Invocación: "Naturaleza Guerrera"',
    subtitle: 'La Fusión Orgánica con las Raíces y la Humedad',
    type: 'symbol',
    description: 'La tierra húmeda y las raíces se entrelazan con el cabello de Ana María, otorgándole la regeneración definitiva.',
    literarySignificance: 'El descenso a la fosa no representa aniquilación, sino una integración activa con las fuerzas telúricas. Las raíces actúan como un ejército de arterias que le brindan descanso definitivo frente al polvo doméstico de la hacienda.',
    themeColor: '#10B981',
    bgGradient: 'from-emerald-950/40 via-zinc-950 to-zinc-950',
    steps: [
      {
        text: 'El ataúd es descendido. Se inicia el contacto con la tierra mojada.',
        action: 'idle',
        attacker: 'none',
        defender: 'none',
        hpImpact: {}
      },
      {
        text: 'Las raíces del bosque penetran la mortaja y abrazan el cuerpo cansado de Ana María.',
        action: 'charge',
        attacker: 'protagonist',
        defender: 'none',
        hpImpact: { protagonist: +50 }
      },
      {
        text: '¡REGENERACIÓN TOTAL! El fango, el humus y los insectos la limpian del tedio mundano.',
        action: 'special',
        attacker: 'protagonist',
        defender: 'none',
        hpImpact: { protagonist: +40 },
        kihapSound: true,
        hitSound: true
      },
      {
        text: '¡DESPERTAR DEFINITIVO! Ana María alcanza la "muerte de los muertos": paz absoluta unida al cosmos.',
        action: 'finish',
        attacker: 'protagonist',
        defender: 'none',
        hpImpact: { protagonist: +10 }
      }
    ]
  }
];

export default function SpectatorMode({ season = 1 }: { season?: number }) {
  const activeCombosList = season === 2 ? spectatorCombosSeason2 : spectatorCombos;
  const [selectedId, setSelectedId] = useState<string>(season === 2 ? 'doble_muerte_s2' : 'vuelo_deseo');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1); // 1 = 1x, 1.5 = 1.5x, 2 = 2x, 0.5 = slowmo
  const [autoLoop, setAutoLoop] = useState<boolean>(false);
  const [protagonistHP, setProtagonistHP] = useState<number>(85);
  const [danielHP, setDanielHP] = useState<number>(60);
  const [battleOverlayText, setBattleOverlayText] = useState<string>('SPECTATOR MODE ENABLED');
  const [battleOverlayColor, setBattleOverlayColor] = useState<string>('text-[#00E5FF]');
  const [flashScreen, setFlashScreen] = useState<boolean>(false);
  const [comboCounter, setComboCounter] = useState<number>(0);

  // Update selectedId and reset when season changes
  useEffect(() => {
    setSelectedId(season === 2 ? 'doble_muerte_s2' : 'vuelo_deseo');
    resetBattleStatus();
  }, [season]);

  const activeCombo = activeCombosList.find(c => c.id === selectedId) || activeCombosList[0];

  // Handle combo selection
  const handleSelectCombo = (id: string) => {
    if (isPlaying) {
      setIsPlaying(false);
    }
    audio.playSlash();
    setSelectedId(id);
    resetBattleStatus();
  };

  const resetBattleStatus = () => {
    setCurrentStepIdx(0);
    setProtagonistHP(85);
    setDanielHP(60);
    setComboCounter(0);
    setBattleOverlayText('READY');
    setBattleOverlayColor('text-[#00E5FF]');
  };

  // Start/Stop animation
  const togglePlay = () => {
    if (!isPlaying) {
      audio.playCoin(); // Insert coin chime when starting spectator duel
      setIsPlaying(true);
      if (currentStepIdx >= activeCombo.steps.length - 1) {
        setCurrentStepIdx(0);
        setProtagonistHP(activeCombo.id === 'simbolo_estanque' ? 50 : 85);
        setDanielHP(60);
        setComboCounter(0);
      }
      setBattleOverlayText('FIGHT!');
      setBattleOverlayColor('text-red-500 animate-pulse font-black');
      audio.playKihap(); // Launch with high action sound!
    } else {
      setIsPlaying(false);
    }
  };

  // Step driver effect
  useEffect(() => {
    if (!isPlaying) return;

    const currentStep = activeCombo.steps[currentStepIdx];
    if (!currentStep) return;

    // Trigger visual triggers for this step
    if (currentStep.kihapSound) {
      audio.playKihap();
    }
    if (currentStep.hitSound) {
      audio.playHit();
      setFlashScreen(true);
      setTimeout(() => setFlashScreen(false), 120);
    }

    // Apply HP impacts
    if (currentStep.hpImpact.daniel) {
      setDanielHP(prev => Math.max(0, Math.min(100, prev + currentStep.hpImpact.daniel!)));
      setComboCounter(prev => prev + 1);
      setBattleOverlayText('CRITICAL HIT!');
      setBattleOverlayColor('text-[#FF2E2E] animate-bounce');
    }
    if (currentStep.hpImpact.protagonist) {
      setProtagonistHP(prev => Math.max(0, Math.min(100, prev + currentStep.hpImpact.protagonist!)));
      if (currentStep.hpImpact.protagonist < 0) {
        setBattleOverlayText('REVERSE STRIKE!');
        setBattleOverlayColor('text-yellow-500');
      } else {
        setBattleOverlayText('SPIRITUAL RECOVERY!');
        setBattleOverlayColor('text-[#00E5FF] animate-pulse');
      }
    }

    // Set overlay text based on actions
    if (currentStep.action === 'evade') {
      setBattleOverlayText('PERFECT EVASION');
      setBattleOverlayColor('text-slate-300 font-bold');
    } else if (currentStep.action === 'finish') {
      setBattleOverlayText('FINISH HIM!');
      setBattleOverlayColor('text-yellow-400 font-black tracking-widest text-shadow-neon-pink');
      audio.playSuccess();
    }

    // Determine delay based on speed
    const stepDelay = (currentStep.action === 'finish' ? 3000 : 2500) / speed;

    const timer = setTimeout(() => {
      if (currentStepIdx < activeCombo.steps.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        // Finished combo
        setBattleOverlayText('COMBO COMPLETED!');
        setBattleOverlayColor('text-emerald-400 font-black animate-pulse');
        audio.playKihap(); // Final victory Kihap!
        setIsPlaying(false);
        
        if (autoLoop) {
          // Move to next combo
          const currentIdx = activeCombosList.findIndex(c => c.id === selectedId);
          const nextIdx = (currentIdx + 1) % activeCombosList.length;
          setTimeout(() => {
            handleSelectCombo(activeCombosList[nextIdx].id);
            setIsPlaying(true);
          }, 2000);
        }
      }
    }, stepDelay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, selectedId, speed, autoLoop]);

  return (
    <div className="space-y-8 animate-fade-in" id="spectator-mode-section">
      {/* Header */}
      <div className="border-b-2 border-zinc-800 pb-4">
        <h2 className="font-display text-2xl font-black tracking-wider text-[#00E5FF] uppercase text-shadow-neon-blue flex items-center gap-2">
          <Tv className="text-[#00E5FF] w-6 h-6 animate-pulse" />
          Modo Espectador: Teatro de Combate Símbolico
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          Observa animaciones rápidas de los combos y duelos más emblemáticos de la novela. Conecta con el poder místico de las metáforas de Bombal con la adrenalina de los juegos de lucha.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COMBO SELECTION SIDEBAR */}
        <div className="lg:col-span-4 space-y-4">
          <span className="font-arcade text-[8px] tracking-widest text-zinc-500 uppercase block font-black">
            SELECT SIMULATION / SELECCIONA DEMO:
          </span>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {activeCombosList.map((combo) => {
              const isSelected = combo.id === selectedId;
              const isChar = combo.type === 'character';

              return (
                <motion.div
                  key={combo.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectCombo(combo.id)}
                  className={`cursor-pointer p-4 rounded-none border-2 transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? isChar
                        ? 'bg-zinc-900 border-[#FF2E2E] border-l-8'
                        : 'bg-zinc-900 border-[#00E5FF] border-l-8'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                  id={`spectator-card-${combo.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-none border-2 mt-0.5 ${
                      isSelected
                        ? isChar
                          ? 'bg-red-950 border-[#FF2E2E] text-[#FF2E2E]'
                          : 'bg-sky-950 border-[#00E5FF] text-[#00E5FF]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}>
                      {isChar ? <Flame className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className={`font-display text-xs font-black tracking-wider uppercase block truncate ${
                        isSelected 
                          ? isChar ? 'text-[#FF2E2E]' : 'text-[#00E5FF]' 
                          : 'text-zinc-300'
                      }`}>
                        {combo.title.split(': ')[1] || combo.title}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block mt-1 truncate">
                        {combo.subtitle}
                      </span>
                      <span className={`inline-block text-[7px] font-arcade px-1.5 py-0.5 mt-2 border ${
                        isChar 
                          ? 'bg-red-950/30 text-[#FF2E2E] border-[#FF2E2E]/30' 
                          : 'bg-sky-950/30 text-[#00E5FF] border-[#00E5FF]/30'
                      }`}>
                        {combo.type === 'character' ? 'DUELO DE COMBATE' : 'ESTRUCTURA DE ARENA'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* SIMULATION ENGINE CONTROLS */}
          <div className="bg-zinc-950 border-2 border-zinc-900 p-4 rounded-none space-y-4">
            <span className="font-arcade text-[8px] text-[#00E5FF] uppercase block font-black">
              COMBAT ENGINE CONTROLS:
            </span>

            <div className="space-y-3">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className={`w-full py-2.5 rounded-none font-arcade text-xs tracking-wider border-2 transition-all duration-300 uppercase font-black flex items-center justify-center gap-2 ${
                  isPlaying
                    ? 'bg-red-950 border-[#FF2E2E] text-[#FF2E2E] hover:bg-red-900'
                    : 'bg-[#00E5FF] border-black text-black hover:bg-sky-400'
                }`}
                id="btn-spectator-play"
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4 animate-pulse" />
                    DETENER SIMULACIÓN
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 animate-bounce" />
                    INICIAR COMBATE (KIHAP!)
                  </>
                )}
              </button>

              {/* Reset Replay */}
              <button
                onClick={resetBattleStatus}
                disabled={isPlaying}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-zinc-800 rounded-none text-zinc-400 hover:text-white font-arcade text-[10px] tracking-wider transition-all flex items-center justify-center gap-1 uppercase"
                id="btn-spectator-reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                REINICIAR ESCENARIO
              </button>

              {/* Speed Slider */}
              <div className="space-y-1.5 pt-1 border-t border-zinc-900">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 font-bold">
                  <span>VELOCIDAD DE TRANSICIÓN:</span>
                  <span className="text-[#00E5FF]">{speed}x</span>
                </div>
                <div className="flex gap-2">
                  {[0.5, 1, 1.5, 2].map(s => (
                    <button
                      key={s}
                      disabled={isPlaying}
                      onClick={() => setSpeed(s)}
                      className={`flex-1 py-1 font-arcade text-[9px] border-2 transition-all ${
                        speed === s
                          ? 'bg-zinc-800 text-[#00E5FF] border-[#00E5FF]'
                          : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:text-white'
                      }`}
                    >
                      {s === 0.5 ? 'SLOW' : `${s}x`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Replay Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-xs font-mono text-zinc-500">
                <span className="font-bold uppercase text-[10px]">REPRODUCCIÓN CONTINUA (AUTO):</span>
                <button
                  onClick={() => setAutoLoop(!autoLoop)}
                  className={`px-3 py-1 border-2 font-arcade text-[9px] transition-all ${
                    autoLoop
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                      : 'bg-zinc-950 text-zinc-600 border-zinc-900'
                  }`}
                >
                  {autoLoop ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CRT FIGHT ARENA STAGE */}
        <div className="lg:col-span-8 space-y-6">
          <div 
            className={`bg-zinc-950 border-4 border-zinc-800 rounded-none p-6 relative overflow-hidden transition-all duration-300 ${
              flashScreen ? 'bg-red-950/40 border-red-500' : 'border-zinc-800'
            }`} 
            style={{ minHeight: '420px' }}
            id="spectator-crt-screen"
          >
            {/* Scanline / Grid effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-transparent to-black/80 pointer-events-none z-10 animate-scanline" />
            <div className="absolute inset-0 bg-grid-lines opacity-5 pointer-events-none" />

            {/* Battle Arena Title Bar */}
            <div className="flex justify-between items-center text-xs border-b-2 border-zinc-800 pb-3 relative z-20">
              <div className="flex items-center gap-1.5 font-arcade text-[8px] text-zinc-500">
                <Cpu className="w-3.5 h-3.5 animate-spin text-zinc-600" style={{ animationDuration: '4s' }} />
                <span>TEATRO_BOMBAL_SYS // SPECTATOR MONITOR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF2E2E] animate-ping" />
                <span className="font-arcade text-[9px] text-yellow-500 font-bold animate-pulse">LIVE REPLAY</span>
              </div>
            </div>

            {/* ARENA FIGTHER HUD */}
            <div className="grid grid-cols-2 gap-4 mt-4 relative z-20">
              {/* Left Side: Protagonista / Ana María HP bar */}
              <div>
                <div className="flex justify-between items-end text-xs mb-1.5 font-black">
                  <span className={`${season === 2 ? 'text-purple-400' : 'text-[#00E5FF]'} font-display tracking-wide uppercase`}>
                    {season === 2 ? 'ANA MARÍA' : 'PROTAGONISTA'}
                  </span>
                  <span className="font-mono text-zinc-500 text-[10px]">
                    {protagonistHP}% HP
                  </span>
                </div>
                <div className={`h-4 bg-zinc-900 border-2 ${season === 2 ? 'border-purple-500' : 'border-[#00E5FF]'} p-0.5`}>
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${season === 2 ? 'from-purple-600 to-purple-400' : 'from-cyan-500 to-[#00E5FF]'}`}
                    animate={{ width: `${protagonistHP}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                </div>
              </div>

              {/* Right Side: Daniel / Doliente HP bar */}
              <div>
                <div className="flex justify-between items-end text-xs mb-1.5 font-black">
                  <span className="font-mono text-zinc-500 text-[10px]">
                    {danielHP}% HP
                  </span>
                  <span className={`${season === 2 ? 'text-zinc-400' : 'text-[#FF2E2E]'} font-display tracking-wide uppercase`}>
                    {season === 2 
                      ? (selectedId === 'doble_muerte_s2' ? 'FERNANDO (BOSS)' : selectedId === 'ring_conyugal_s2' ? 'ANTONIO (BOSS)' : 'LA TIERRA') 
                      : 'DANIEL (BOSS)'}
                  </span>
                </div>
                <div className={`h-4 bg-zinc-900 border-2 ${season === 2 ? 'border-zinc-500' : 'border-[#FF2E2E]'} p-0.5 rotate-180`}>
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${season === 2 ? 'from-zinc-600 to-zinc-400' : 'from-red-600 to-[#FF2E2E]'}`}
                    animate={{ width: `${danielHP}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                </div>
              </div>
            </div>

            {/* SCREEN OVERLAYS & COUNTER */}
            <div className="absolute top-28 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none">
              {comboCounter > 0 && (
                <motion.div
                  key={comboCounter}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1.3, 1], opacity: 1 }}
                  className="font-arcade text-lg text-yellow-400 font-black tracking-widest text-shadow-neon-pink"
                >
                  {comboCounter} HITS COMBO!
                </motion.div>
              )}
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={battleOverlayText}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`font-arcade text-base tracking-widest uppercase text-center mt-2 ${battleOverlayColor}`}
                >
                  {battleOverlayText}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ARENA GRAPHICAL STAGE */}
            <div className="h-48 border-2 border-zinc-900/60 bg-black/60 my-6 relative flex items-center justify-around overflow-hidden p-4 rounded-none">
              
              {/* Backdrops based on active Combo */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800" />
                <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-zinc-900" />
              </div>

              {/* Interactive Symbol backdrop animations */}
              {selectedId === 'simbolo_niebla' && (
                <motion.div 
                  animate={{ opacity: [0.3, 0.7, 0.3], x: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute inset-0 bg-slate-500/10 blur-xl z-0 pointer-events-none"
                />
              )}
              {selectedId === 'simbolo_estanque' && (
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute bottom-0 left-0 right-0 h-16 bg-blue-500/15 blur-lg z-0 pointer-events-none"
                />
              )}
              {selectedId === 'simbolo_silencio' && (
                <motion.div 
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                  className="absolute inset-0 bg-purple-950/20 z-0 pointer-events-none"
                />
              )}
              {selectedId === 'comunion_tierra_s2' && (
                <motion.div 
                  animate={{ y: [4, -4, 4], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute bottom-0 left-0 right-0 h-24 bg-emerald-900/20 z-0 pointer-events-none border-t border-emerald-800/40"
                />
              )}

              {/* Dynamic visual representations of combatants */}
              {/* Fighter A: Protagonist / Regina / Lover / Symbol / Ana María */}
              <div className="w-1/3 flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCombo.steps[currentStepIdx]?.action + '_' + selectedId}
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ 
                      x: isPlaying && activeCombo.steps[currentStepIdx]?.attacker === 'protagonist' ? 40 : 0,
                      scale: isPlaying && activeCombo.steps[currentStepIdx]?.attacker === 'protagonist' ? 1.15 : 1,
                      opacity: 1 
                    }}
                    exit={{ x: 20, opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    {/* Character Avatar/Sprite representation */}
                    <div className={`w-14 h-14 rounded-none border-2 flex items-center justify-center font-display text-lg font-black uppercase relative shadow-2xl ${
                      season === 2
                        ? selectedId === 'comunion_tierra_s2'
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 text-shadow-neon-green shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-purple-950/80 border-purple-500 text-purple-400 text-shadow-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : selectedId === 'furia_carnal'
                          ? 'bg-red-950/80 border-[#FF2E2E] text-[#FF2E2E] text-shadow-neon-pink'
                          : selectedId === 'eco_niebla'
                            ? 'bg-yellow-950/80 border-yellow-400 text-yellow-400 text-shadow-neon-yellow'
                            : selectedId.startsWith('simbolo_')
                              ? 'bg-slate-900 border-slate-500 text-slate-300'
                              : 'bg-sky-950/80 border-[#00E5FF] text-[#00E5FF] text-shadow-neon-blue'
                    }`}>
                      {/* Internal Icon representation */}
                      {season === 2 ? (
                        selectedId === 'comunion_tierra_s2' ? (
                          <Waves className="w-7 h-7 animate-pulse" />
                        ) : (
                          <span>AM</span>
                        )
                      ) : selectedId === 'furia_carnal' ? (
                        <span>R</span>
                      ) : selectedId === 'eco_niebla' ? (
                        <span>A</span>
                      ) : selectedId === 'simbolo_niebla' ? (
                        <Cloud className="w-7 h-7" />
                      ) : selectedId === 'simbolo_estanque' ? (
                        <Waves className="w-7 h-7 animate-pulse" />
                      ) : selectedId === 'simbolo_silencio' ? (
                        <VolumeX className="w-7 h-7" />
                      ) : (
                        <span>P</span>
                      )}

                      {/* Neon action particle overlays */}
                      {isPlaying && activeCombo.steps[currentStepIdx]?.attacker !== 'none' && (
                        <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[7px] font-arcade px-1.5 py-0.5 rounded-none font-bold animate-ping">
                          HIT
                        </span>
                      )}
                    </div>
                    
                    <span className="text-[9px] font-arcade text-zinc-500 uppercase mt-1.5">
                      {season === 2
                        ? selectedId === 'comunion_tierra_s2'
                          ? 'TIERRA_CORE'
                          : 'ANA MARÍA'
                        : selectedId === 'furia_carnal' 
                          ? 'REGINA' 
                          : selectedId === 'eco_niebla' 
                            ? 'AMANTE'
                            : selectedId === 'simbolo_niebla'
                              ? 'NIEBLA_CORE'
                              : selectedId === 'simbolo_estanque'
                                ? 'ESTANQUE_CORE'
                                : selectedId === 'simbolo_silencio'
                                  ? 'SILENCIO_CORE'
                                  : 'PROTAGONISTA'}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mid Stage Clash FX */}
              <div className="w-1/4 flex flex-col items-center justify-center pointer-events-none relative z-20">
                <AnimatePresence>
                  {isPlaying && activeCombo.steps[currentStepIdx]?.action === 'strike' && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: [1.4, 1], rotate: 45 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute bg-yellow-400/10 border-2 border-yellow-400 p-2.5 rounded-none animate-ping text-yellow-400 font-black font-arcade text-xs"
                    >
                      CRASH!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fighter B: Daniel / past husbands */}
              <div className="w-1/3 flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCombo.steps[currentStepIdx]?.action + '_daniel'}
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ 
                      x: isPlaying && activeCombo.steps[currentStepIdx]?.attacker === 'daniel' ? -40 : 0,
                      scale: isPlaying && activeCombo.steps[currentStepIdx]?.attacker === 'daniel' ? 1.15 : 1,
                      opacity: 1 
                    }}
                    exit={{ x: -20, opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-14 h-14 rounded-none border-2 flex items-center justify-center font-display text-lg font-black uppercase relative ${
                      isPlaying && activeCombo.steps[currentStepIdx]?.defender && activeCombo.steps[currentStepIdx]?.hitSound
                        ? 'bg-red-950 border-red-500 text-red-500 animate-bounce'
                        : season === 2
                          ? 'bg-zinc-950 border-zinc-800 text-zinc-500'
                          : 'bg-zinc-950 border-zinc-700 text-zinc-500'
                    }`}>
                      <span>
                        {season === 2
                          ? selectedId === 'doble_muerte_s2' ? 'F' : selectedId === 'ring_conyugal_s2' ? 'AN' : 'T'
                          : 'D'}
                      </span>
                      {isPlaying && activeCombo.steps[currentStepIdx]?.defender && activeCombo.steps[currentStepIdx]?.hitSound && (
                        <div className="absolute inset-0 border-4 border-red-500 animate-ping rounded-none" />
                      )}
                    </div>
                    <span className="text-[9px] font-arcade text-zinc-500 uppercase mt-1.5">
                      {season === 2
                        ? selectedId === 'doble_muerte_s2' ? 'FERNANDO' : selectedId === 'ring_conyugal_s2' ? 'ANTONIO' : 'LA TIERRA'
                        : 'DANIEL'}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* REAL-TIME SIMULATOR SCROLLING CONSOLE FEED */}
            <div className="bg-zinc-950 border-2 border-zinc-900 p-4 rounded-none font-mono text-xs text-zinc-300 relative z-20 space-y-2">
              <div className="flex justify-between border-b border-zinc-900 pb-1.5 text-zinc-500 text-[10px] font-bold">
                <span>COMBO STEP Feed ({currentStepIdx + 1}/{activeCombo.steps.length})</span>
                <span>STATUS: {isPlaying ? 'RUNNING' : 'IDLE'}</span>
              </div>
              
              <div className="min-h-[50px] flex items-start gap-1.5">
                <CornerDownRight className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {activeCombo.steps[currentStepIdx]?.text || 'Selecciona un combo y pulsa "INICIAR COMBATE" para ver la simulación.'}
                </p>
              </div>
            </div>

            {/* SCHOLARLY CRITIQUE PANEL */}
            <div className="mt-4 p-4 bg-[#111] border-2 border-zinc-900 rounded-none space-y-2 relative z-20">
              <div className="flex items-center gap-1.5 text-[10px] font-arcade text-yellow-500 font-black">
                <BookOpen className="w-4 h-4 text-yellow-500" />
                <span>EXÉGESIS CRÍTICA / ANÁLISIS LITERARIO:</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {activeCombo.literarySignificance}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
