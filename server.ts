import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Shared Gemini Client Utility with Telemetry User-Agent
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API endpoint for evaluating challenge answers
app.post('/api/evaluate', async (req, res) => {
  const { challengeId, userText } = req.body;

  if (!userText || userText.trim().length < 5) {
    return res.status(400).json({
      error: 'La respuesta es demasiado corta. Escribe al menos un combo de 5 caracteres o palabras para iniciar el combate.',
    });
  }

  // Define some details based on challengeId
  let challengeContext = '';
  if (challengeId === 'dialogue') {
    challengeContext = `Desafío: Escribir un diálogo de combate entre el sentido del deber de Daniel (realismo, tedio, frialdad) y el deseo de la protagonista (vuelo onírico, evasión, pasión).`;
  } else if (challengeId === 'lover_status') {
    challengeContext = `Desafío: Identificar si el Amante fue real o un fantasma basado en la escena de la casa del ciego (¿el carruaje, los ruidos, el olor a fruta?).`;
  } else {
    challengeContext = `Desafío general sobre 'La última niebla' de María Luisa Bombal: Analizar los símbolos (niebla, estanque, silencio) y la temática del matrimonio opresor.`;
  }

  // If Gemini API is available, use it!
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Evalúa la siguiente respuesta del estudiante al desafío literario.
Contexto: ${challengeContext}
Respuesta del estudiante: "${userText}"`,
        config: {
          systemInstruction: `Actúas como el réferi y comentarista oficial de un videojuego de peleas arcade cyberpunk y, al mismo tiempo, como un riguroso académico literario. Evalúas las respuestas de un estudiante de 17 años que practica Taekwondo y es fan de Tekken/Street Fighter sobre el libro 'La última niebla' de María Luisa Bombal.
Debes responder estrictamente en formato JSON con la siguiente estructura, sin rodeos, marcas de markdown de bloque u otros textos:
{
  "score": "Puntaje estilo arcade (ej: ¡PERFECT! 100/100, ¡GREAT COMBO! 85/100, ¡COMBO BREAKER! 60/100 o ¡K.O.! con puntaje)",
  "rank": "Rango de pelea (S, A, B, C, D)",
  "refereeVoice": "Un grito o comentario épico de réferi en español, usando terminología de Taekwondo (ej: ¡Kihap!, ¡Dollyo Chagi!) o de videojuegos de pelea (ej: ¡Counter Hit!, ¡Unstoppable!). Comenta con mucha energía la respuesta del estudiante.",
  "literaryFeedback": "Una crítica literaria breve, directa y de gran valor académico sobre el contenido de su respuesta. Explica cómo se relaciona con María Luisa Bombal, la opresión del matrimonio de Daniel, la naturaleza fantástica del amante, o el estanque de transformación, con analogías accesibles pero profundas.",
  "specialMoveUnlocked": "Nombre de una técnica o movimiento especial desbloqueado basado en su respuesta (ej: 'Vuelo Onírico Smash', 'Patada de Estanque Líquido', 'Bloqueo de Niebla Eterna')"
}`,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText.trim());
        return res.json(parsed);
      } catch (e) {
        console.error('Failed to parse JSON response from Gemini:', responseText);
        // Fallback to local evaluation if JSON fails to parse
      }
    } catch (error: any) {
      console.error('Error generating content with Gemini:', error);
      // Fallback to local evaluation if API fails
    }
  }

  // --- LOCAL EVALUATION ENGINE (FALLBACK) ---
  // If Gemini is not set up, or fails, we analyze the text locally for keywords to make the app fully functional!
  const text = userText.toLowerCase();
  let score = '¡GOOD COMBO! 75/100';
  let rank = 'B';
  let refereeVoice = '¡FIGHT ON! Buen intento, la defensa del rival resiste.';
  let literaryFeedback = 'Buen intento analizando la obra de María Luisa Bombal. Para maximizar tu daño, asegúrate de citar los contrastes claves: la frialdad estéril del matrimonio con Daniel versus la pasión liberadora (sea real o soñada) con el Amante.';
  let specialMoveUnlocked = 'Patada Básica de Taekwondo';

  if (challengeId === 'dialogue') {
    const hasDaniel = text.includes('daniel') || text.includes('marido') || text.includes('deber') || text.includes('oblig');
    const hasProtagonist = text.includes('yo') || text.includes('protagonista') || text.includes('sueño') || text.includes('deseo') || text.includes('niebla');
    
    if (hasDaniel && hasProtagonist) {
      score = '¡PERFECT COMBO! 95/100';
      rank = 'S';
      refereeVoice = '¡KIHAP! ¡SÚPER COMBO DE DOCTRINA VS DESEO! ¡Doble impacto directo en el orgullo de Daniel!';
      literaryFeedback = 'Excelente diálogo. Lograste contrastar el discurso seco, realista y rutinario de Daniel (que simboliza la brutalidad elemental del mundo masculino) con el vuelo interior de la protagonista, quien se niega a morir en vida y busca en el deseo un escape de la niebla familiar.';
      specialMoveUnlocked = 'Vuelo Onírico Doble Chagi';
    } else if (hasDaniel || hasProtagonist) {
      score = '¡GREAT COMBO! 80/100';
      rank = 'A';
      refereeVoice = '¡COUNTER HIT! Buen golpe, pero falta completar la guardia.';
      literaryFeedback = 'Tu respuesta captura un lado del conflicto (el deber o el deseo). Para desbloquear el verdadero poder de este combo, asegúrate de entrelazar ambos diálogos, haciendo que el conformismo hostil de Daniel choque de frente con el vuelo onírico de la protagonista.';
      specialMoveUnlocked = 'Barrida de Niebla';
    }
  } else if (challengeId === 'lover_status') {
    const hasReal = text.includes('real') || text.includes('verdad') || text.includes('físico') || text.includes('carruaje') || text.includes('ciego') || text.includes('casa');
    const hasFantasma = text.includes('fantasma') || text.includes('sueño') || text.includes('onírico') || text.includes('imagina') || text.includes('ilusión');
    const hasBoth = hasReal && hasFantasma;

    if (hasBoth) {
      score = '¡ULTIMATE K.O.! 100/100';
      rank = 'S';
      refereeVoice = '¡SÚPER CANCELACIÓN LITERARIA! ¡Has descifrado la ambigüedad existencial de Bombal!';
      literaryFeedback = '¡Espectacular! Entendiste la genialidad de Bombal: el Amante opera en una penumbra irresoluble. La escena del ciego aporta pistas contradictorias (el ciego sintió ruidos y el olor, pero todo se desvanece). La realidad para la protagonista no se define por lo fáctico, sino por la intensidad de la vivencia que salvó su cuerpo del tedio eterno.';
      specialMoveUnlocked = 'Kihap de Amplitud Cuántica';
    } else if (hasReal || hasFantasma) {
      score = '¡DIRECT HIT! 85/100';
      rank = 'A';
      refereeVoice = '¡GOLPE RECTO! Una postura clara e intimidante sobre el cuadrilátero.';
      literaryFeedback = `Te has posicionado firmemente sobre la teoría de que el Amante es ${text.includes('real') ? 'real' : 'un fantasma'}. ¡Es un argumento válido! Sin embargo, recuerda que María Luisa Bombal juega constantemente con la niebla de la ambigüedad: la casa del ciego es un elemento que, en lugar de resolver el misterio, añade más misterio al combate.`;
      specialMoveUnlocked = 'Guardia de la Casa del Ciego';
    }
  }

  return res.json({
    score,
    rank,
    refereeVoice,
    literaryFeedback,
    specialMoveUnlocked,
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
