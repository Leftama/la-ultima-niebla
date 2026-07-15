import React, { useState } from 'react';
import { motion } from 'motion/react';
import { quizQuestionsData, challengesData } from '../data';
import { audio } from '../utils/audio';
import { Swords, Heart, Shield, RefreshCw, Trophy, Sparkles, Send, HelpCircle, FileText } from 'lucide-react';

interface EvaluationResult {
  score: string;
  rank: string;
  refereeVoice: string;
  literaryFeedback: string;
  specialMoveUnlocked: string;
}

export default function TrainingMode() {
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
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('dialogue');
  const [challengeTexts, setChallengeTexts] = useState<Record<string, string>>({
    dialogue: '',
    lover_status: '',
  });
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationResult>>({});
  const [evalLoading, setEvalLoading] = useState<boolean>(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  const activeChallenge = challengesData.find(c => c.id === selectedChallengeId) || challengesData[0];

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

    const question = quizQuestionsData[currentQuestionIndex];
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

    if (currentQuestionIndex < quizQuestionsData.length - 1) {
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
    <div className="space-y-8" id="training-section">
      {/* Upper Module Selector Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-zinc-800 pb-4">
        <div>
          <h2 className="font-display text-2xl font-black tracking-wider text-[#FF2E2E] uppercase text-shadow-neon-red flex items-center gap-2">
            <Swords className="text-[#FF2E2E] w-6 h-6 animate-pulse" />
            Training Mode: Zona de Combate
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Pon a prueba tu conocimiento de la novela en combates rápidos de opción múltiple o desafíos analíticos.
          </p>
        </div>

        {/* Submode Switcher */}
        <div className="flex bg-zinc-950 p-1 rounded-none border-2 border-zinc-800 shrink-0">
          <button
            onClick={() => {
              audio.playCoin();
              setActiveSubMode('quiz');
            }}
            className={`px-4 py-1.5 rounded-none font-display text-xs tracking-wider transition-all duration-300 ${
              activeSubMode === 'quiz'
                ? 'bg-[#FF2E2E] text-black font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
            id="submode-toggle-quiz"
          >
            SURVIVAL QUIZ (HP)
          </button>
          <button
            onClick={() => {
              audio.playCoin();
              setActiveSubMode('challenges');
            }}
            className={`px-4 py-1.5 rounded-none font-display text-xs tracking-wider transition-all duration-300 ${
              activeSubMode === 'challenges'
                ? 'bg-[#FF2E2E] text-black font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
            id="submode-toggle-challenges"
          >
            COMBO CHALLENGES (TEXT)
          </button>
        </div>
      </div>

      {/* --- SUBMODE A: SURVIVAL QUIZ --- */}
      {activeSubMode === 'quiz' && (
        <div className="bg-zinc-950 border-4 border-zinc-800 rounded-none p-6 relative overflow-hidden" id="survival-quiz-canvas">
          {/* Scanlines overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-transparent to-black/80 pointer-events-none z-10 animate-scanline" />

          {/* If quiz hasn't started */}
          {!quizStarted && (
            <div className="py-12 flex flex-col items-center text-center space-y-6 relative z-20">
              <div className="w-16 h-16 rounded-none bg-zinc-900 border-2 border-[#FF2E2E]/30 flex items-center justify-center animate-bounce">
                <Swords className="text-[#FF2E2E] w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="font-arcade text-sm text-[#FF2E2E] tracking-wider uppercase font-black">SURVIVAL MODE: LA ÚLTIMA NIEBLA</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Responde correctamente las preguntas clave de la novela. ¡Cuidado! Tienes una barra de vida de 100%. Cada respuesta errónea restará un <span className="text-[#FF2E2E] font-bold">25% de HP</span> de tu luchador.
                </p>
              </div>

              <button
                onClick={startQuiz}
                className="px-8 py-3.5 bg-[#FF2E2E] text-black font-arcade text-xs tracking-widest rounded-none border-2 border-black hover:bg-red-600 transition-all shadow-lg active:scale-95 font-black uppercase"
                id="btn-start-quiz"
              >
                INSERT COIN & FIGHT!
              </button>
            </div>
          )}

          {/* Active Quiz UI */}
          {quizStarted && !quizFinished && (
            <div className="space-y-6 relative z-20">
              {/* TOP HUD (HP BAR AND SCORE) */}
              <div className="bg-zinc-950 border-2 border-zinc-900 rounded-none p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Fighter HP bar */}
                <div className="flex-1 space-y-1.5 max-w-md">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-arcade text-[8px] text-[#FF2E2E] tracking-wider flex items-center gap-1 font-black">
                      <Heart className="w-3 h-3 text-[#FF2E2E] animate-pulse fill-[#FF2E2E]" />
                      FIGHTER HP / ENERGÍA LITERARIA:
                    </span>
                    <span className={`font-arcade text-[9px] font-black ${hp > 50 ? 'text-emerald-400' : hp > 25 ? 'text-amber-400' : 'text-[#FF2E2E] animate-ping'}`}>
                      {hp}%
                    </span>
                  </div>
                  {/* Styled life bar with red low-health alert */}
                  <div className="h-4 bg-zinc-900 rounded-none border-2 border-zinc-800 p-0.5 overflow-hidden flex items-center">
                    <motion.div
                      className={`h-full rounded-none ${
                        hp > 50 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : hp > 25 ? 'bg-amber-400' : 'bg-[#FF2E2E] animate-pulse'
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
                    <span className="text-yellow-400 text-shadow-neon-pink font-black">{score} pts</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[8px] block tracking-widest uppercase font-black">STAGE:</span>
                    <span className="text-white font-black">{currentQuestionIndex + 1}/{quizQuestionsData.length}</span>
                  </div>
                </div>
              </div>

              {/* Question card */}
              <div className="space-y-4">
                <span className="font-arcade text-[8px] tracking-widest text-[#00E5FF] uppercase font-black">
                  ACTIVE CHALLENGE // ENTRADA DE COMBATE
                </span>
                <h4 className="text-base font-black text-white font-display leading-relaxed border-l-4 border-l-[#00E5FF] pl-4 uppercase">
                  {quizQuestionsData[currentQuestionIndex].question}
                </h4>

                {/* Alternative list */}
                <div className="space-y-2.5 pt-2">
                  {quizQuestionsData[currentQuestionIndex].options.map((option) => {
                    const isSelected = option.key === selectedOptionKey;
                    
                    // Style depends on selection and validation status
                    let optionStyle = 'bg-zinc-950 border-2 border-zinc-900 hover:bg-zinc-900/60 hover:border-zinc-700 text-zinc-300';
                    if (isSelected) {
                      optionStyle = 'bg-sky-950 border-2 border-[#00E5FF] text-white';
                    }
                    if (quizFeedback) {
                      const isCorrectAnswer = option.key === quizQuestionsData[currentQuestionIndex].correctAnswer;
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
                          isSelected ? 'bg-[#00E5FF] text-black border-[#00E5FF] font-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
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
                    className={`px-6 py-2.5 font-display text-xs tracking-wider rounded-none border-2 transition-all ${
                      selectedOptionKey
                        ? 'bg-[#00E5FF] text-black border-black font-black hover:bg-sky-400 cursor-pointer'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                    id="btn-submit-answer"
                  >
                    LANZAR GOLPE (ENTER)
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-black font-display text-xs tracking-wider rounded-none font-black border-2 border-zinc-900 transition-all uppercase"
                    id="btn-next-question"
                  >
                    {hp <= 0 ? 'VER RESULTADO' : currentQuestionIndex === quizQuestionsData.length - 1 ? 'CONCLUIR COMBATE' : 'SIGUIENTE ASALTO →'}
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
                  <div className="w-16 h-16 rounded-none bg-zinc-900 border-2 border-emerald-500/30 flex items-center justify-center animate-bounce text-emerald-400">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="font-arcade text-sm text-emerald-400 tracking-widest uppercase font-black">¡VICTORIA INCONTESTABLE!</h3>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                      ¡Fabuloso! Has dominado el Survival Mode. Tu comprensión de la atmósfera, los símbolos y la vida de María Luisa Bombal ha resistido los golpes de Daniel.
                    </p>
                    <div className="p-4 bg-zinc-950 border-2 border-zinc-900 rounded-none inline-block mt-4">
                      <span className="font-display text-zinc-500 text-xs tracking-widest uppercase block font-black">HIGHSCORE FINAL:</span>
                      <span className="font-arcade text-lg text-yellow-400 font-black">{score + (hp * 10)} pts</span>
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
                      La niebla y la inercia doméstica han drenado tu energía vital. No te rindas frente al silencio del campo. ¡Carga tus nudillos de taekwondo y vuelve a intentarlo!
                    </p>
                  </div>
                </>
              )}

              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-display text-xs tracking-wider border-2 border-zinc-700 rounded-none transition-all font-black uppercase"
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

            {challengesData.map((challenge) => {
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
                      ? 'bg-zinc-900 border-l-8 border-[#FF2E2E] border-y-[#FF2E2E] border-r-[#FF2E2E] text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                  id={`challenge-tab-${challenge.id}`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${isSelected ? 'text-[#FF2E2E]' : 'text-zinc-500'}`} />
                    <span className="font-display text-xs font-black tracking-wide uppercase">
                      {challenge.title.split(': ')[1]}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* General Instructions Card */}
            <div className="p-4 bg-zinc-950 border-2 border-zinc-900 rounded-none space-y-2">
              <span className="font-arcade text-[8px] text-[#00E5FF] uppercase tracking-wider block font-black">
                NORMAS DEL ARBITRAJE:
              </span>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Escribe tu respuesta literaria en el panel. Al pulsar <span className="text-[#FF2E2E] font-black">EVALUAR COMBO</span>, enviaremos tus líneas al evaluador inteligente (Gemini API) para calificar tu nivel de daño crítico y tu conocimiento de Bombal.
              </p>
            </div>
          </div>

          {/* Interactive Workspace */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-zinc-950 border-4 border-zinc-800 rounded-none p-6 space-y-4">
              <div>
                <span className="font-arcade text-[8px] text-[#FF2E2E] uppercase tracking-widest font-black">
                  WORKSPACE AREA // COMBO CHALLENGE
                </span>
                <h3 className="font-display text-lg font-black text-white tracking-wide mt-1 uppercase">
                  {activeChallenge.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  {activeChallenge.description}
                </p>
              </div>

              {/* Text Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-zinc-500 font-mono font-black">
                  <span>ESCRIBE ABAJO TU COMBINACIÓN (MÍN. 5 PALABRAS)</span>
                  <span>{challengeTexts[selectedChallengeId]?.length || 0} caracteres</span>
                </div>
                <textarea
                  value={challengeTexts[selectedChallengeId] || ''}
                  onChange={(e) => handleChallengeTextChange(e.target.value)}
                  placeholder={activeChallenge.placeholder}
                  className="w-full h-36 p-4 bg-zinc-950 border-2 border-zinc-800 focus:border-[#FF2E2E] rounded-none text-sm text-zinc-100 font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#FF2E2E]"
                  id="challenge-text-input"
                />
              </div>

              {/* Alert Error Box */}
              {evalError && (
                <div className="p-3 bg-red-950/20 border-2 border-red-900 rounded-none text-xs text-[#FF2E2E] font-sans">
                  {evalError}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-between items-center gap-4 pt-1 flex-wrap">
                <button
                  onClick={loadExample}
                  className="px-4 py-2 font-display text-xs tracking-wider text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 rounded-none transition-all font-black uppercase"
                  id="btn-load-example"
                >
                  CARGAR EJEMPLO S-RANK
                </button>

                <button
                  onClick={submitChallenge}
                  disabled={evalLoading}
                  className="px-6 py-2.5 bg-[#FF2E2E] text-black hover:bg-red-600 disabled:bg-zinc-900 disabled:text-zinc-500 disabled:cursor-not-allowed font-display text-xs tracking-wider font-black rounded-none border-2 border-black hover:scale-105 transition-all flex items-center gap-2 uppercase"
                  id="btn-submit-challenge"
                >
                  {evalLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      ANALIZANDO COMBO CHAGI...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      EVALUAR COMBO (FIGHT)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* EVALUATION RESULTS CARD */}
            {evaluations[selectedChallengeId] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-950 border-4 border-zinc-800 rounded-none overflow-hidden"
                id="evaluation-result-monitor"
              >
                {/* Score Header */}
                <div className="bg-[#111] border-b-2 border-zinc-800 p-4 flex justify-between items-center">
                  <div>
                    <span className="font-arcade text-[8px] text-[#FF2E2E] uppercase tracking-widest font-black">
                      REFEREE OFFICIATION SCORECARD
                    </span>
                    <h4 className="text-sm font-arcade text-white tracking-wider mt-1 font-black">
                      {evaluations[selectedChallengeId].score}
                    </h4>
                  </div>
                  {/* Big flashing Rank tag */}
                  <div className="flex items-center gap-2">
                    <span className="font-arcade text-[8px] text-zinc-500 uppercase font-black">RANK:</span>
                    <span className="font-arcade text-2xl text-[#FF2E2E] animate-pulse text-shadow-neon-red px-3 py-1 bg-zinc-950 border-2 border-zinc-800 rounded-none font-black">
                      {evaluations[selectedChallengeId].rank}
                    </span>
                  </div>
                </div>

                {/* Score Details Body */}
                <div className="p-6 space-y-4">
                  {/* Announcer comment */}
                  <div className="p-4 bg-[#111] border-l-4 border-l-[#FF2E2E] border-y border-r border-zinc-900 rounded-none space-y-1">
                    <span className="font-arcade text-[8px] text-[#FF2E2E] uppercase tracking-wider block font-black">
                      ¡ANNOUNCER COMMENTARY!
                    </span>
                    <p className="text-xs font-mono italic text-zinc-300 leading-relaxed">
                      "{evaluations[selectedChallengeId].refereeVoice}"
                    </p>
                  </div>

                  {/* Academic critique */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-display text-zinc-500 uppercase tracking-widest block font-black">
                      CRÍTICA ACADÉMICA / EVALUACIÓN LITERARIA:
                    </span>
                    <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                      {evaluations[selectedChallengeId].literaryFeedback}
                    </p>
                  </div>

                  {/* Unlocked Move Alert */}
                  <div className="p-3 bg-zinc-900 border-2 border-[#00E5FF]/20 rounded-none flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-[#00E5FF] animate-pulse" />
                      <span className="text-xs font-sans text-zinc-400">
                        ¡COMBO CRÍTICO LOGRADO! Desbloqueaste la técnica especial:
                      </span>
                    </div>
                    <span className="font-display text-xs font-black text-[#00E5FF] uppercase tracking-wider bg-[#00E5FF]/10 px-2.5 py-1 rounded-none border-2 border-[#00E5FF]/30">
                      {evaluations[selectedChallengeId].specialMoveUnlocked}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
