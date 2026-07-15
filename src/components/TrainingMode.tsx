import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { quizQuestionsData, quizQuestionsSeason2Data, challengesData, challengesSeason2Data } from '../data';
import { audio } from '../utils/audio';
import { Swords, Heart, Shield, RefreshCw, Trophy, Sparkles, Send, HelpCircle, FileText } from 'lucide-react';

interface EvaluationResult {
  score: string;
  rank: string;
  refereeVoice: string;
  literaryFeedback: string;
  specialMoveUnlocked: string;
}

interface TrainingModeProps {
  season?: number;
}

export default function TrainingMode({ season = 1 }: TrainingModeProps) {
  // Select data based on active season
  const activeQuizQuestions = season === 2 ? quizQuestionsSeason2Data : quizQuestionsData;
  const activeChallenges = season === 2 ? challengesSeason2Data : challengesData;

  // Mode selection: 'quiz' (Survival Mode) or 'challenges' (Desafíos)
  const [activeSubMode, setActiveSubMode] = useState<'quiz' | 'challenges'>('quiz');

  // --- QUIZ (SURVIVAL MODE) STATE ---
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [hp, setHp] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(null);

  // --- CHALLENGES STATE ---
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(season === 2 ? 'confession_s2' : 'dialogue');
  const [challengeTexts, setChallengeTexts] = useState<Record<string, string>>({
    dialogue: '',
    lover_status: '',
    confession_s2: '',
  });
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationResult>>({});
  const [evalLoading, setEvalLoading] = useState<boolean>(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Synchronize active challenge ID with season switches
  useEffect(() => {
    setSelectedChallengeId(season === 2 ? 'confession_s2' : 'dialogue');
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setHp(100);
    setScore(0);
    setQuizFeedback(null);
    setSelectedOptionKey(null);
  }, [season]);

  const activeChallenge = activeChallenges.find(c => c.id === selectedChallengeId) || activeChallenges[0];

  // --- QUIZ HANDLERS ---
  const startQuiz = () => {
    audio.playCoin();
    setHp(100);
    setScore(0);
    setCurrentQuestionIndex(0);
    setQuizFeedback(null);
    setSelectedOptionKey(null);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  const handleOptionSelect = (optionKey: string) => {
    if (quizFeedback) return; // Prevent double select
    setSelectedOptionKey(optionKey);
  };

  const submitAnswer = () => {
    if (!selectedOptionKey || quizFeedback) return;

    const question = activeQuizQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionKey === question.correctAnswer;

    if (isCorrect) {
      audio.playHit();
      setScore(prev => prev + 200);
      setQuizFeedback({
        isCorrect: true,
        explanation: question.explanation,
      });
    } else {
      audio.playSlash();
      const newHp = Math.max(0, hp - 25);
      setHp(newHp);
      setQuizFeedback({
        isCorrect: false,
        explanation: question.explanation,
      });

      if (newHp <= 0) {
        audio.playGameOver();
      }
    }
  };

  const handleNextQuestion = () => {
    setQuizFeedback(null);
    setSelectedOptionKey(null);

    if (hp <= 0) {
      setQuizFinished(true);
      return;
    }

    if (currentQuestionIndex < activeQuizQuestions.length - 1) {
      audio.playSlash();
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      audio.playVictory();
      setQuizFinished(true);
    }
  };

  // --- CHALLENGE EVALUATOR HANDLER ---
  const handleChallengeTextChange = (text: string) => {
    setChallengeTexts(prev => ({
      ...prev,
      [selectedChallengeId]: text,
    }));
  };

  const submitChallenge = async () => {
    const textToEvaluate = challengeTexts[selectedChallengeId] || '';
    if (textToEvaluate.trim().length < 5) {
      setEvalError('La respuesta es demasiado corta. Escribe al menos un combo de 5 palabras para iniciar la evaluación.');
      return;
    }

    setEvalLoading(true);
    setEvalError(null);
    audio.playKihap();

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: selectedChallengeId,
          userText: textToEvaluate,
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo establecer conexión con el árbitro. Activando motor de evaluación local...');
      }

      const data: EvaluationResult = await res.json();
      setEvaluations(prev => ({
        ...prev,
        [selectedChallengeId]: data,
      }));

      // Play victory chime if Rank is S or A, else standard success chime
      if (data.rank === 'S' || data.rank === 'A') {
        audio.playVictory();
      } else {
        audio.playSuccess();
      }
    } catch (err: any) {
      console.warn('Network error, triggering local fallback evaluator:', err);
      
      // Fallback evaluation locally to guarantee offline resilience and compliance
      const localResult = getLocalEvaluationFallback(selectedChallengeId, textToEvaluate);
      setEvaluations(prev => ({
        ...prev,
        [selectedChallengeId]: localResult,
      }));
      
      if (localResult.rank === 'S' || localResult.rank === 'A') {
        audio.playVictory();
      } else {
        audio.playSuccess();
      }
    } finally {
      setEvalLoading(false);
    }
  };

  // Helper for offline evaluation fallback
  const getLocalEvaluationFallback = (id: string, userText: string): EvaluationResult => {
    const text = userText.toLowerCase();
    let score = '¡GOOD COMBO! 75/100';
    let rank = 'B';
    let refereeVoice = '¡FIGHT ON! Buen intento, la defensa de Daniel resiste.';
    let literaryFeedback = 'Has presentado una buena respuesta. Para maximizar tu daño, asegúrate de citar la opresión silenciosa de la hacienda y la fragilidad poética.';
    let specialMoveUnlocked = 'Patada Básica de Taekwondo';

    if (id === 'dialogue') {
      const hasDaniel = text.includes('daniel') || text.includes('marido') || text.includes('deber') || text.includes('oblig');
      const hasProtagonist = text.includes('yo') || text.includes('protagonista') || text.includes('sueño') || text.includes('deseo') || text.includes('niebla');

      if (hasDaniel && hasProtagonist) {
        score = '¡PERFECT COMBO! 95/100';
        rank = 'S';
        refereeVoice = '¡KIHAP! ¡SÚPER COMBO DE DEBER VS PASIÓN! ¡Doble impacto directo!';
        literaryFeedback = 'Excelente diálogo. Lograste contrastar el discurso frío, utilitario de Daniel con el grito de libertad espiritual de la protagonista. Se siente la tensión existencial clásica de Bombal.';
        specialMoveUnlocked = 'Vuelo Onírico Chagi';
      } else if (hasDaniel || hasProtagonist) {
        score = '¡GREAT COMBO! 80/100';
        rank = 'A';
        refereeVoice = '¡COUNTER HIT! Buen ataque, pero te falta la guardia del rival.';
        literaryFeedback = 'Has plasmado muy bien una de las voces. Para perfeccionar este diálogo, intenta entrelazar ambas de modo que choquen directamente (ej: la frialdad utilitaria de Daniel versus el anhelo interior de ella).';
        specialMoveUnlocked = 'Guardia de Niebla';
      }
    } else if (id === 'lover_status') {
      const hasReal = text.includes('real') || text.includes('verdad') || text.includes('ciego') || text.includes('carruaje') || text.includes('casa');
      const hasFantasma = text.includes('fantasma') || text.includes('sueño') || text.includes('onírico') || text.includes('mente');
      
      if (hasReal && hasFantasma) {
        score = '¡ULTIMATE K.O.! 100/100';
        rank = 'S';
        refereeVoice = '¡COMBO ANULADOR! ¡Has descifrado el misterio más grande de la niebla!';
        literaryFeedback = '¡Formidable! Entendiste que María Luisa Bombal no busca dar respuestas binarias. El Amante es ambiguo: la escena del ciego provee pistas táctiles (el ruido, el aroma) pero la realidad de la protagonista se rige por la intensidad estética, no por la física.';
        specialMoveUnlocked = 'Kihap de Luz Onírica';
      } else if (hasReal || hasFantasma) {
        score = '¡DIRECT HIT! 85/100';
        rank = 'A';
        refereeVoice = '¡GOLPE FIRME! Has plantado tu bandera en el centro del tatami.';
        literaryFeedback = `Muy bien argumentado el por qué el Amante es ${text.includes('real') ? 'real' : 'un fantasma'}. Para elevar tu análisis al rango S, recuerda que Bombal mantiene deliberadamente una ambigüedad poética: la realidad no importa tanto como el sentir interior.`;
        specialMoveUnlocked = 'Barrida de Estanque';
      }
    } else if (id === 'confession_s2') {
      const hasRicardo = text.includes('ricardo') || text.includes('primer');
      const hasAntonio = text.includes('antonio') || text.includes('marido') || text.includes('esposo');
      const hasFernando = text.includes('fernando') || text.includes('pretendiente') || text.includes('confidente');
      const hasAcademic = text.includes('perdón') || text.includes('perdon') || text.includes('tierra') || text.includes('raíces') || text.includes('raices') || text.includes('post-mortem') || text.includes('muert') || text.includes('paz');

      if (hasAcademic && (hasRicardo || hasAntonio || hasFernando)) {
        score = '¡ULTIMATE K.O.! 100/100';
        rank = 'S';
        refereeVoice = '¡COMBO ABSOLUTO DE REDENCIÓN TELÚRICA! ¡Rango S alcanzado!';
        literaryFeedback = 'Formidable análisis. Lograste entrelazar de manera soberbia las pasiones terrenales con la disolución cósmica de la muerte de los muertos. Al perdonar a través del fango, Ana María trasciende la mezquindad social de su tiempo y sella su comunión poética eterna.';
        specialMoveUnlocked = 'Shatter Screen Dollyo Chagi';
      } else {
        score = '¡GREAT COMBO! 85/100';
        rank = 'A';
        refereeVoice = '¡GOLPE BIEN DIRIGIDO! El oponente siente el peso de su memoria.';
        literaryFeedback = 'Muy buena defensa y fundamentación del perdón. Para elevar tu nivel, intenta emplear más de la terminología de Bombal relacionada con la comunión con las raíces vegetales, los insectos y la muerte mística.';
        specialMoveUnlocked = 'Escudo de Ceniza';
      }
    }

    return { score, rank, refereeVoice, literaryFeedback, specialMoveUnlocked };
  };

  const loadExample = () => {
    audio.playCoin();
    setChallengeTexts(prev => ({
      ...prev,
      [selectedChallengeId]: activeChallenge.exampleText,
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in" id="training-section">
      {/* Upper Module Selector Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-zinc-800 pb-4">
        <div>
          <h2 className={`font-display text-2xl font-black tracking-wider uppercase flex items-center gap-2 ${
            season === 2 ? 'text-purple-400 text-shadow-neon-purple' : 'text-[#FF2E2E] text-shadow-neon-red'
          }`}>
            <Swords className={`w-6 h-6 animate-pulse ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`} />
            {season === 2 ? 'Training Mode: Zona de Comunión' : 'Training Mode: Zona de Combate'}
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {season === 2
              ? 'Pon a prueba tu conocimiento de La amortajada mediante el Survival Quiz o el Desafío de Redención Literaria.'
              : 'Pon a prueba tu conocimiento de la novela en combates rápidos de opción múltiple o desafíos analíticos.'}
          </p>
        </div>

        {/* Submode Switcher */}
        <div className="flex bg-zinc-950 p-1 rounded-none border-2 border-zinc-800 shrink-0">
          <button
            onClick={() => {
              audio.playCoin();
              setActiveSubMode('quiz');
            }}
            className={`px-4 py-1.5 rounded-none font-display text-xs tracking-wider transition-all duration-300 cursor-pointer ${
              activeSubMode === 'quiz'
                ? season === 2
                  ? 'bg-purple-600 text-white font-black shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                  : 'bg-[#FF2E2E] text-black font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
            id="submode-toggle-quiz"
          >
            {season === 2 ? 'GHOST QUIZ (HP)' : 'SURVIVAL QUIZ (HP)'}
          </button>
          <button
            onClick={() => {
              audio.playCoin();
              setActiveSubMode('challenges');
            }}
            className={`px-4 py-1.5 rounded-none font-display text-xs tracking-wider transition-all duration-300 cursor-pointer ${
              activeSubMode === 'challenges'
                ? season === 2
                  ? 'bg-purple-600 text-white font-black shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                  : 'bg-[#FF2E2E] text-black font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
            id="submode-toggle-challenges"
          >
            {season === 2 ? 'CONFESSION COMBO (TEXT)' : 'COMBO CHALLENGES (TEXT)'}
          </button>
        </div>
      </div>

      {/* --- SUBMODE A: SURVIVAL QUIZ --- */}
      {activeSubMode === 'quiz' && (
        <div className={`bg-zinc-950 border-4 rounded-none p-6 relative overflow-hidden ${
          season === 2 ? 'border-purple-900/60' : 'border-zinc-800'
        }`} id="survival-quiz-canvas">
          {/* Scanlines overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-transparent to-black/80 pointer-events-none z-10 animate-scanline" />

          {/* If quiz hasn't started */}
          {!quizStarted && (
            <div className="py-12 flex flex-col items-center text-center space-y-6 relative z-20">
              <div className={`w-16 h-16 rounded-none bg-zinc-900 border-2 flex items-center justify-center animate-bounce ${
                season === 2 ? 'border-purple-500/30 text-purple-400' : 'border-[#FF2E2E]/30 text-[#FF2E2E]'
              }`}>
                <Swords className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className={`font-arcade text-sm tracking-wider uppercase font-black ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`}>
                  {season === 2 ? 'GHOST SURVIVAL MODE: LA AMORTAJADA' : 'SURVIVAL MODE: LA ÚLTIMA NIEBLA'}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {season === 2
                    ? 'Responde las preguntas de lucidez mística sobre La amortajada. Tu barra de HP literaria es de 100%. ¡Cada error te restará un 25% de HP!'
                    : 'Responde correctamente las preguntas clave de la novela. ¡Cuidado! Tienes una barra de vida de 100%. Cada respuesta errónea restará un 25% de HP de tu luchador.'}
                </p>
              </div>

              <button
                onClick={startQuiz}
                className={`px-8 py-3.5 text-black font-arcade text-xs tracking-widest rounded-none border-2 border-black transition-all shadow-lg active:scale-95 font-black uppercase cursor-pointer ${
                  season === 2 
                    ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                    : 'bg-[#FF2E2E] hover:bg-red-600'
                }`}
                id="btn-start-quiz"
              >
                {season === 2 ? 'ACTIVATE GHOST ENERGY & START!' : 'INSERT COIN & FIGHT!'}
              </button>
            </div>
          )}

          {/* Active Quiz UI */}
          {quizStarted && !quizFinished && (
            <div className="space-y-6 relative z-20 animate-fade-in">
              {/* TOP HUD (HP BAR AND SCORE) */}
              <div className="bg-zinc-950 border-2 border-zinc-900 rounded-none p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Fighter HP bar */}
                <div className="flex-1 space-y-1.5 max-w-md">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-arcade text-[8px] tracking-wider flex items-center gap-1 font-black ${
                      season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'
                    }`}>
                      <Heart className={`w-3 h-3 animate-pulse ${season === 2 ? 'text-purple-400 fill-purple-400' : 'text-[#FF2E2E]'}`} />
                      {season === 2 ? 'GHOST ENERGY / ALMA EN COMUNIÓN:' : 'FIGHTER HP / ENERGÍA LITERARIA:'}
                    </span>
                    <span className={`font-arcade text-[9px] font-black ${hp > 50 ? 'text-emerald-400' : hp > 25 ? 'text-amber-400' : 'text-[#FF2E2E] animate-ping'}`}>
                      {hp}%
                    </span>
                  </div>
                  {/* Styled life bar with red low-health alert */}
                  <div className="h-4 bg-zinc-900 rounded-none border-2 border-zinc-800 p-0.5 overflow-hidden flex items-center">
                    <motion.div
                      className={`h-full rounded-none ${
                        hp > 50 
                          ? season === 2 ? 'bg-gradient-to-r from-purple-500 to-indigo-400' : 'bg-gradient-to-r from-emerald-500 to-green-400' 
                          : hp > 25 ? 'bg-amber-400' : 'bg-[#FF2E2E] animate-pulse'
                      }`}
                      animate={{ width: `${hp}%` }}
                      transition={{ type: 'spring', stiffness: 80 }}
                    />
                  </div>
                </div>

                {/* Score panel */}
                <div className="flex items-center gap-6 shrink-0 font-arcade text-xs font-black">
                  <div>
                    <span className="text-zinc-500 text-[8px] block tracking-widest uppercase font-black">SCORE:</span>
                    <span className={`font-black ${season === 2 ? 'text-purple-400' : 'text-yellow-400 text-shadow-neon-pink'}`}>{score} pts</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[8px] block tracking-widest uppercase font-black">STAGE:</span>
                    <span className="text-white font-black">{currentQuestionIndex + 1}/{activeQuizQuestions.length}</span>
                  </div>
                </div>
              </div>

              {/* Question card */}
              <div className="space-y-4">
                <span className={`font-arcade text-[8px] tracking-widest uppercase font-black ${season === 2 ? 'text-purple-400' : 'text-[#00E5FF]'}`}>
                  ACTIVE CHALLENGE // ENTRADA DE COMBATE
                </span>
                <h4 className={`text-base font-black text-white font-display leading-relaxed border-l-4 pl-4 uppercase ${
                  season === 2 ? 'border-l-purple-500' : 'border-l-[#00E5FF]'
                }`}>
                  {activeQuizQuestions[currentQuestionIndex].question}
                </h4>

                {/* Alternative list */}
                <div className="space-y-2.5 pt-2">
                  {activeQuizQuestions[currentQuestionIndex].options.map((option) => {
                    const isSelected = option.key === selectedOptionKey;
                    
                    // Style depends on selection and validation status
                    let optionStyle = 'bg-zinc-950 border-2 border-zinc-900 hover:bg-zinc-900/60 hover:border-zinc-700 text-zinc-300';
                    if (isSelected) {
                      optionStyle = season === 2 
                        ? 'bg-purple-950/40 border-2 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        : 'bg-sky-950 border-2 border-[#00E5FF] text-white';
                    }
                    if (quizFeedback) {
                      const isCorrectAnswer = option.key === activeQuizQuestions[currentQuestionIndex].correctAnswer;
                      if (isCorrectAnswer) {
                        optionStyle = 'bg-emerald-950 border-2 border-emerald-500 text-emerald-300';
                      } else if (isSelected) {
                        optionStyle = 'bg-red-950 border-2 border-[#FF2E2E] text-[#FF2E2E]';
                      } else {
                        optionStyle = 'opacity-40 border-2 border-zinc-900 text-zinc-600 cursor-not-allowed';
                      }
                    }

                    return (
                      <div
                        key={option.key}
                        onClick={() => !quizFeedback && handleOptionSelect(option.key)}
                        className={`cursor-pointer p-4 rounded-none border-2 transition-all duration-300 flex items-start gap-3 text-sm font-sans leading-relaxed ${optionStyle}`}
                        id={`option-${option.key}`}
                      >
                        <div className={`font-arcade text-[9px] w-6 h-6 rounded-none border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected 
                            ? season === 2 ? 'bg-purple-500 text-white border-purple-500 font-black' : 'bg-[#00E5FF] text-black border-[#00E5FF] font-black' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        }`}>
                          {option.key}
                        </div>
                        <p className="flex-1">{option.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Alert Block */}
              {quizFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-none border-2 space-y-1 ${
                    quizFeedback.isCorrect 
                      ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300' 
                      : 'bg-red-950/20 border-red-900 text-[#FF2E2E]'
                  }`}
                  id="quiz-feedback-box"
                >
                  <span className="font-arcade text-[8px] uppercase tracking-wider block font-black">
                    {quizFeedback.isCorrect ? '¡HIT CONFIRMED! IMPACTO PERFECTO:' : '¡BLOCK BROKEN! TU RESPUESTA FALLÓ:'}
                  </span>
                  <p className="text-xs font-sans leading-relaxed text-zinc-300">
                    {quizFeedback.explanation}
                  </p>
                </motion.div>
              )}

              {/* Submit / Next Actions */}
              <div className="pt-2 flex justify-end gap-3">
                {!quizFeedback ? (
                  <button
                    onClick={submitAnswer}
                    disabled={!selectedOptionKey}
                    className={`px-6 py-2.5 font-display text-xs tracking-wider rounded-none border-2 transition-all cursor-pointer ${
                      selectedOptionKey
                        ? season === 2
                          ? 'bg-purple-600 text-white border-black font-black hover:bg-purple-500'
                          : 'bg-[#00E5FF] text-black border-black font-black hover:bg-sky-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                    id="btn-submit-answer"
                  >
                    LANZAR GOLPE (ENTER)
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-black font-display text-xs tracking-wider rounded-none font-black border-2 border-zinc-900 transition-all uppercase cursor-pointer"
                    id="btn-next-question"
                  >
                    {hp <= 0 ? 'VER RESULTADO' : currentQuestionIndex === activeQuizQuestions.length - 1 ? 'CONCLUIR COMBATE' : 'SIGUIENTE ASALTO →'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quiz End Screen (Victory / Defeat) */}
          {quizStarted && quizFinished && (
            <div className="py-12 flex flex-col items-center text-center space-y-6 relative z-20">
              {hp > 0 ? (
                <>
                  <div className={`w-16 h-16 rounded-none bg-zinc-900 border-2 flex items-center justify-center animate-bounce ${
                    season === 2 ? 'border-purple-500/30 text-purple-400' : 'border-emerald-500/30 text-emerald-400'
                  }`}>
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className={`font-arcade text-sm tracking-widest uppercase font-black ${season === 2 ? 'text-purple-400' : 'text-emerald-400'}`}>
                      {season === 2 ? '¡TRASCENDENCIA COMPLETA!' : '¡VICTORIA INCONTESTABLE!'}
                    </h3>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                      {season === 2
                        ? '¡Excelente! Has alcanzado el descanso definitivo de la amortajada. Tu sintonía con las raíces terrenales y la redención biológica te corona como académico experto.'
                        : '¡Fabuloso! Has dominado el Survival Mode. Tu comprensión de la atmósfera, los símbolos y la vida de María Luisa Bombal ha resistido los golpes de Daniel.'}
                    </p>
                    <div className="p-4 bg-zinc-950 border-2 border-zinc-900 rounded-none inline-block mt-4">
                      <span className="font-display text-zinc-500 text-xs tracking-widest uppercase block font-black">HIGHSCORE FINAL:</span>
                      <span className={`font-arcade text-lg font-black ${season === 2 ? 'text-purple-400' : 'text-yellow-400 text-shadow-neon-pink'}`}>{score + (hp * 10)} pts</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-none bg-zinc-900 border-2 border-[#FF2E2E]/30 flex items-center justify-center animate-pulse text-[#FF2E2E]">
                    <RefreshCw className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="font-arcade text-sm text-[#FF2E2E] tracking-widest uppercase font-black">¡GAME OVER!</h3>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {season === 2
                        ? 'El peso de los remordimientos terrenales de Antonio y Fernando ha asfixiado tu energía post-mortem. ¡Vuelve a cargarte de mística y ataca de nuevo!'
                        : 'La niebla y la inercia doméstica han drenado tu energía vital. No te rindas frente al silencio del campo. ¡Carga tus nudillos de taekwondo y vuelve a intentarlo!'}
                    </p>
                  </div>
                </>
              )}

              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-display text-xs tracking-wider border-2 border-zinc-700 rounded-none transition-all font-black uppercase cursor-pointer"
                id="btn-retry-quiz"
              >
                ¿OTRO ASALTO? (RETRY)
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- SUBMODE B: COMBO CHALLENGES --- */}
      {activeSubMode === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="combo-challenges-canvas">
          {/* Challenge Selector */}
          <div className="lg:col-span-4 space-y-3">
            <span className="font-arcade text-[8px] tracking-widest text-zinc-500 uppercase block mb-1 font-black">
              CHOOSE YOUR FIGHT / SELECCIONA DESAFÍO:
            </span>

            {activeChallenges.map((challenge) => {
              const isSelected = challenge.id === selectedChallengeId;
              return (
                <div
                  key={challenge.id}
                  onClick={() => {
                    audio.playSlash();
                    setSelectedChallengeId(challenge.id);
                    setEvalError(null);
                  }}
                  className={`cursor-pointer p-4 rounded-none border-2 transition-all duration-300 ${
                    isSelected
                      ? season === 2
                        ? 'bg-purple-950/40 border-l-8 border-purple-500 border-y-purple-500 border-r-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        : 'bg-zinc-900 border-l-8 border-[#FF2E2E] border-y-[#FF2E2E] border-r-[#FF2E2E] text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                  id={`challenge-tab-${challenge.id}`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${isSelected ? (season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]') : 'text-zinc-500'}`} />
                    <span className="font-display text-xs font-black tracking-wide uppercase">
                      {challenge.title.split(': ')[1] || challenge.title}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* General Instructions Card */}
            <div className={`p-4 bg-[#111] border-2 rounded-none space-y-3 ${
              season === 2 ? 'border-purple-900/40' : 'border-zinc-900'
            }`}>
              <div className="flex items-center gap-1.5">
                <HelpCircle className={`w-4 h-4 ${season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'}`} />
                <span className="text-white text-[10px] font-display font-black uppercase tracking-wider">REGLAS DEL COMBATE ACADÉMICO:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-zinc-400 leading-relaxed font-sans list-disc list-inside">
                <li>Responde el desafío poético en el área de texto.</li>
                <li>Estructura tu respuesta combinando conceptos académicos profundos.</li>
                <li>Presiona el botón <span className="text-white">"LANZAR RESPUESTA"</span> para enviar tu combo al Árbitro de la Academia Literaria.</li>
                <li>Consigue rango <span className="text-yellow-400 font-bold">A o S</span> para desbloquear ataques literarios definitivos en tu perfil de juego.</li>
              </ul>
            </div>
          </div>

          {/* Challenge Workspace */}
          <div className="lg:col-span-8 flex flex-col justify-start">
            <div className={`bg-zinc-950 border-4 rounded-none p-6 space-y-6 ${
              season === 2 ? 'border-purple-900/60' : 'border-zinc-800'
            }`} id="challenge-workspace-box">
              {/* Challenge Instructions */}
              <div>
                <span className={`font-arcade text-[8px] uppercase tracking-widest block font-black ${
                  season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'
                }`}>
                  {season === 2 ? 'ACTIVE GHOST RANKED MATCH' : 'ACTIVE LITERARY DUEL'}
                </span>
                <h3 className="font-display text-lg font-black text-white uppercase tracking-wider mt-1">
                  {activeChallenge.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-2">
                  {activeChallenge.description}
                </p>
                <div className="p-3 bg-zinc-900 border-2 border-dashed border-zinc-800 text-[11px] text-zinc-300 font-sans leading-relaxed mt-4 italic">
                  <span className="font-bold text-white not-italic uppercase block mb-1">MÉTODO DE IMPACTO COMBO:</span>
                  {activeChallenge.instructions}
                </div>
              </div>

              {/* Text Input Panel */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-display font-black uppercase">TU COMBO POÉTICO DE RESPUESTA:</span>
                  <button
                    onClick={loadExample}
                    className={`font-arcade text-[9px] hover:underline transition-all bg-transparent border-0 cursor-pointer ${
                      season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'
                    }`}
                  >
                    [CARGAR COMBO DEMO ARCADE]
                  </button>
                </div>

                <textarea
                  value={challengeTexts[selectedChallengeId] || ''}
                  onChange={(e) => handleChallengeTextChange(e.target.value)}
                  placeholder={activeChallenge.placeholder}
                  className={`w-full h-36 p-4 bg-zinc-950 border-2 text-xs font-sans text-zinc-200 placeholder-zinc-700 focus:outline-none rounded-none leading-relaxed resize-none transition-all ${
                    season === 2 ? 'border-purple-900 focus:border-purple-500' : 'border-zinc-800 focus:border-[#FF2E2E]'
                  }`}
                  id="challenge-textarea"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between items-center gap-4">
                <div className="text-[10px] font-mono text-zinc-600 uppercase font-bold">
                  SISTEMA DE ANÁLISIS DE COMBOS DE BOMBAL V2.4
                </div>

                <button
                  onClick={submitChallenge}
                  disabled={evalLoading}
                  className={`px-6 py-3 font-display text-xs tracking-wider rounded-none border-2 transition-all duration-300 flex items-center gap-2 font-black uppercase cursor-pointer ${
                    evalLoading
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-wait'
                      : season === 2
                        ? 'bg-purple-600 text-white border-black hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-[#FF2E2E] text-black border-black hover:bg-red-600'
                  }`}
                  id="btn-submit-challenge"
                >
                  {evalLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      EVALUANDO COMBO...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      LANZAR RESPUESTA (KICK!)
                    </>
                  )}
                </button>
              </div>

              {/* Error messages */}
              {evalError && (
                <div className="p-3 bg-red-950/20 border-2 border-[#FF2E2E] text-xs text-[#FF2E2E] font-sans rounded-none uppercase font-bold">
                  {evalError}
                </div>
              )}

              {/* RESULT DISPLAY PANEL */}
              {evaluations[selectedChallengeId] && !evalLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`border-4 rounded-none p-5 relative overflow-hidden ${
                    season === 2 ? 'bg-purple-950/10 border-purple-900/60' : 'bg-[#050505] border-zinc-900'
                  }`}
                  id="evaluation-result-panel"
                >
                  <div className="absolute inset-0 bg-grid-lines opacity-5 pointer-events-none" />

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
                    {/* Rank column */}
                    <div className="md:col-span-3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-900 pb-4 md:pb-0 md:pr-4">
                      <span className="font-arcade text-[8px] text-zinc-500 uppercase tracking-widest block mb-2 font-black">LITERARY RANK</span>
                      <div className={`w-16 h-16 rounded-none border-4 flex items-center justify-center font-display text-4xl font-black italic shadow-inner select-none ${
                        evaluations[selectedChallengeId].rank === 'S'
                          ? 'bg-yellow-400 text-black border-yellow-400 animate-pulse'
                          : evaluations[selectedChallengeId].rank === 'A'
                          ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                          : 'bg-zinc-900 text-white border-zinc-800'
                      }`}>
                        {evaluations[selectedChallengeId].rank}
                      </div>
                      <span className={`font-arcade text-[9px] mt-2 block font-black ${
                        season === 2 ? 'text-purple-400' : 'text-[#FF2E2E]'
                      }`}>
                        {evaluations[selectedChallengeId].score}
                      </span>
                    </div>

                    {/* Feedback details column */}
                    <div className="md:col-span-9 space-y-4 md:pl-4 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="font-arcade text-[8px] text-zinc-500 uppercase tracking-widest block font-black">ÁRBITRO DE LA ACADEMIA:</span>
                        <p className={`text-xs font-arcade leading-tight ${
                          season === 2 ? 'text-purple-400' : 'text-[#00E5FF]'
                        }`}>
                          "{evaluations[selectedChallengeId].refereeVoice}"
                        </p>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-zinc-900">
                        <span className="text-[10px] font-display text-zinc-500 uppercase tracking-widest block font-black">ANÁLISIS CRÍTICO LITERARIO:</span>
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                          {evaluations[selectedChallengeId].literaryFeedback}
                        </p>
                      </div>

                      {/* Unlocked Special Move */}
                      {evaluations[selectedChallengeId].specialMoveUnlocked && (
                        <div className="pt-2 border-t border-zinc-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse shrink-0" />
                          <span className="text-[10px] font-display text-zinc-400 font-black uppercase">
                            MOVIMIENTO ESPECIAL UNLOCKED EN SELECCIÓN:{' '}
                            <span className="text-yellow-400 underline font-black uppercase">
                              {evaluations[selectedChallengeId].specialMoveUnlocked}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
