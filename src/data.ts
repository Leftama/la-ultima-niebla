import { Fighter, LoreLevel, ComboSymbol, QuizQuestion, Challenge, EasterEgg } from './types';

export const fightersData: Fighter[] = [
  {
    id: 'protagonist',
    name: 'Protagonista',
    title: 'La Soñadora Descalza',
    avatar: 'protagonist',
    attribute: 'Vuelo Onírico',
    attributeDesc: 'Vive entre la realidad física y el deseo puro, escapando de su cuerpo para hallar su libertad.',
    bio: 'Atrapada en un frío matrimonio de campo con Daniel, siente que se muere en vida en una existencia rutinaria. Un fugaz encuentro erótico en una noche de niebla con un desconocido despierta su sensualidad oculta, dándole una razón física para resistir el implacable avance del tedio.',
    stats: [
      { name: 'Fuerza Física', value: 40, color: 'bg-red-500' },
      { name: 'Misterio Onírico', value: 95, color: 'bg-neon-blue' },
      { name: 'Pasión Espiritual', value: 85, color: 'bg-neon-pink' },
      { name: 'Defensa de Silencio', value: 50, color: 'bg-yellow-500' }
    ],
    specialMoves: [
      {
        name: 'Evasión de Niebla',
        input: '↓ ↙ ← + B',
        description: 'Se funde con el aire húmedo para desmaterializarse, esquivando temporalmente los ataques de Daniel y la moralidad.'
      },
      {
        name: 'Inmersión en el Estanque',
        input: '→ ↓ ↘ + Punch',
        description: 'Sumerge su cuerpo en agua helada para purificar sus sentidos, activando una comunión divina con la naturaleza.'
      },
      {
        name: 'Vuelo del Deseo',
        input: '↑ ↑ + Heavy Kick',
        description: 'Ataque aéreo de gran poder espiritual que rompe la pesadez de las paredes domésticas y el matrimonio.'
      }
    ]
  },
  {
    id: 'daniel',
    name: 'Daniel',
    title: 'El Esposo Gélido',
    avatar: 'daniel',
    attribute: 'Hostilidad Real',
    attributeDesc: 'Representa la brutalidad del realismo pragmático y el tedio abrumador del mundo masculino.',
    bio: 'Un hacendado pragmático, frío y sumido en la rutina del campo. Se casó con la protagonista por mera inercia, pero vive emocionalmente sepultado en el recuerdo sagrado de su difunta primera esposa, tratando a su actual mujer como una sombra insustancial.',
    stats: [
      { name: 'Fuerza Física', value: 90, color: 'bg-red-500' },
      { name: 'Misterio Onírico', value: 10, color: 'bg-neon-blue' },
      { name: 'Pasión Espiritual', value: 30, color: 'bg-neon-pink' },
      { name: 'Defensa de Silencio', value: 95, color: 'bg-yellow-500' }
    ],
    specialMoves: [
      {
        name: 'Clonación del Pasado',
        input: '→ ↓ → + A',
        description: 'Obliga a la protagonista a recogerse el cabello, forzándola a imitar los gestos y modas de su primera esposa.'
      },
      {
        name: 'Ancla de Rutina',
        input: '↓ ↓ + Heavy Punch',
        description: 'Golpea el suelo invocando la pesadez de los quehaceres agrícolas y el orden doméstico, paralizando el vuelo del rival.'
      },
      {
        name: 'Barrera de Desdén',
        input: '← → + Block',
        description: 'Se escuda en una mirada fría de indiferencia que absorbe cualquier ataque emocional o reclamo de pasión.'
      }
    ]
  },
  {
    id: 'regina',
    name: 'Regina',
    title: 'La Guerrera de la Carne',
    avatar: 'regina',
    attribute: 'Pasión Real',
    attributeDesc: 'El contraste directo de la protagonista: vive una pasión prohibida pero real y de carne y hueso.',
    bio: 'Cuñada de Daniel. Es apasionada, audaz y sumamente sensual. Regina no se refugia en los sueños ni en las nieblas de la imaginación; ella vive una aventura adúltera ardiente y clandestina que desafía abiertamente las leyes del decoro, asumiendo riesgos físicos devastadores.',
    stats: [
      { name: 'Fuerza Física', value: 75, color: 'bg-red-500' },
      { name: 'Misterio Onírico', value: 35, color: 'bg-neon-blue' },
      { name: 'Pasión Espiritual', value: 98, color: 'bg-neon-pink' },
      { name: 'Defensa de Silencio', value: 40, color: 'bg-yellow-500' }
    ],
    specialMoves: [
      {
        name: 'Disparo del Amante',
        input: '↓ → + Kick',
        description: 'Invoca la presencia física de su amante real en una ráfaga de besos audaces y transgresores.'
      },
      {
        name: 'Grito de Rebeldía',
        input: '← ↙ ↓ ↘ → + Punch',
        description: 'Un estallido de energía carnal que rompe el silencio opresivo de la casa, aturdiendo a Daniel.'
      },
      {
        name: 'Sacrificio Trágico',
        input: '↓ ↓ + Special',
        description: 'Libera toda su energía vital en un intento desesperado por mantener viva su pasión, arriesgando su propia cordura.'
      }
    ]
  },
  {
    id: 'lover',
    name: 'El Amante',
    title: 'El Espectro Olvidado',
    avatar: 'lover',
    attribute: 'Atributo Fantasma',
    attributeDesc: 'Ser enigmático que huele a fruta estival, posee una medalla de primera comunión y desvanece la realidad.',
    bio: 'El guerrero de la niebla. Aparece misteriosamente para otorgar a la protagonista una noche de absoluta plenitud sensorial en una habitación con aroma a frutas y maderas. Su repentina y perpetua desaparición desata una batalla psicológica de décadas: ¿fue un sueño o fue real?',
    stats: [
      { name: 'Fuerza Física', value: 30, color: 'bg-red-500' },
      { name: 'Misterio Onírico', value: 100, color: 'bg-neon-blue' },
      { name: 'Pasión Espiritual', value: 90, color: 'bg-neon-pink' },
      { name: 'Defensa de Silencio', value: 65, color: 'bg-yellow-500' }
    ],
    specialMoves: [
      {
        name: 'Aroma de Fruta de Verano',
        input: '← → + Punch',
        description: 'Lanza un perfume de maderas y frutas que sumerge al oponente en un letargo nostálgico irrompible.'
      },
      {
        name: 'Reflejo de Comunión',
        input: '↓ ↑ + Heavy Kick',
        description: 'Muestra un destello dorado de su medalla de primera comunión, cegando al rival y confundiéndolo sobre la realidad.'
      },
      {
        name: 'Desvanecimiento de Niebla',
        input: '↓ ↙ ← + Block',
        description: 'Se disuelve instantáneamente en el aire húmedo, dejando al rival golpeando el vacío de su propia memoria.'
      }
    ]
  }
];

export const loreLevelsData: LoreLevel[] = [
  {
    id: 'level1',
    levelNum: 1,
    title: 'Nivel 1: El Matrimonio con Daniel',
    subtitle: 'Prisión en la Casa de Campo',
    description: 'La protagonista ingresa a una remota finca tras casarse con Daniel por mero descarte social. El ring está cubierto por el tedio doméstico y el desdén. Daniel no la mira: vive encadenado a la devoción ciega por su difunta primera esposa, y obliga a la protagonista a imitar sus gestos gélidos.',
    literaryContext: 'Este nivel representa la muerte en vida del matrimonio patriarcal y la opresión del realismo pragmático que asfixia el alma femenina.',
    status: 'unlocked',
    bossName: 'Daniel, El Censor de la Identidad',
    bossSkill: 'Ataque de Rutina Doméstica'
  },
  {
    id: 'level2',
    levelNum: 2,
    title: 'Nivel 2: El Encuentro en el Estanque',
    subtitle: 'El Despertar Sensual del Cuerpo',
    description: 'Bajo el manto de una niebla densa y misteriosa, la protagonista escapa de la finca hacia el estanque de agua helada y luego vaga por el bosque. Allí se encuentra con un Amante sin nombre. En una noche de comunión absoluta y entrega apasionada, ella descubre la sensualidad oculta de su cuerpo físico.',
    literaryContext: 'El agua y el estanque representan la purificación física y la reconciliación de la protagonista con su propio ser animal e independiente.',
    status: 'unlocked',
    bossName: 'La Duda Racional',
    bossSkill: 'Escepticismo del Tiempo'
  },
  {
    id: 'level3',
    levelNum: 3,
    title: 'Boss Final: La Vejez y el Silencio',
    subtitle: 'La Resignación Existencial',
    description: 'El Amante nunca regresa. Regina cae desangrada físicamente por su pasión imprudente. El estanque se cubre de lodo y hojas secas. La protagonista se enfrenta al enemigo definitivo: un silencio abrumador que devora la casa y sus recuerdos. La lucha culmina en la aceptación de una vejez opaca sin fervores.',
    literaryContext: 'El final de Bombal es un llamado a la cruda aceptación de la inercia social: vivir solo por deber, arrastrando un cuerpo privado de su pasión.',
    status: 'unlocked',
    bossName: 'El Silencio Eterno, Guardián de la Casa',
    bossSkill: 'Aniquilación del Recuerdo'
  },
  {
    id: 'level_arbol',
    levelNum: 4,
    title: 'Nivel Extra: El Refugio de Brígida',
    subtitle: 'La Ignorancia de "El Árbol"',
    description: 'Te trasladas al escenario de "El Árbol". Brígida, incomprendida por su marido Luis, se refugia en un cuarto de vestir protegido por la fresca copa de un gomero gigante y la música de Mozart. Su combate es pasivo: defender su ignorancia infantil de la frialdad utilitaria de su esposo.',
    literaryContext: 'Bombal explora aquí el capullo de la ignorancia como un escudo de supervivencia. Cuando el árbol es talado, la luz de la realidad la hiere de golpe.',
    status: 'unlocked',
    bossName: 'Luis, El Ingeniero Útil',
    bossSkill: 'Tala de la Sombra'
  },
  {
    id: 'level_amortajada',
    levelNum: 5,
    title: 'Nivel Extra: El Viaje de Ana María',
    subtitle: 'La Percepción de "La Amortajada"',
    description: 'Ingresas al ring post-mortem de "La Amortajada". Ana María yace en su ataúd, pero su mente experimenta una hipersensibilidad mística. A través de los ojos de los vivos que lloran su cuerpo, ella analiza sus viejas batallas amorosas y desata el combo definitivo: perdonar y comprender.',
    literaryContext: 'La muerte aquí no es aniquilación, sino un umbral de percepción suprema que otorga la sabiduría final para liberarse de las cadenas terrenales.',
    status: 'unlocked',
    bossName: 'El Juicio del Féretro',
    bossSkill: 'Mirada del Tránsito Eterno'
  }
];

export const comboSymbolsData: ComboSymbol[] = [
  {
    id: 'niebla',
    name: 'La Niebla',
    mechanicName: 'ENVIRONMENTAL DEBUFF',
    gameplayEffect: 'Reduce la visibilidad, distorsiona los tiempos de reacción y difumina el límite entre lo real y lo fantástico.',
    literaryMeaning: 'El manto amortiguador que envuelve la existencia de la protagonista. Actúa como un refugio poético para su insatisfacción, pero a la vez es una prisión húmeda que asfixia y borra el pasado y los contornos de la realidad fáctica.',
    color: 'from-slate-400 to-slate-600',
    icon: 'Cloud'
  },
  {
    id: 'estanque',
    name: 'El Estanque / Agua',
    mechanicName: 'HEALTH REGENERATOR & BUFF',
    gameplayEffect: 'Restaura instantáneamente la barra de energía espiritual y duplica el daño de los combos basados en el deseo.',
    literaryMeaning: 'El estanque representa la purificación sensorial de la mujer, el despertar erótico y la comunión instintiva con la naturaleza salvaje. Sumergirse en él es despojarse de la ropa social y reconciliarse con la gloria del propio cuerpo.',
    color: 'from-blue-500 to-cyan-500',
    icon: 'Waves'
  },
  {
    id: 'silencio',
    name: 'El Silencio',
    mechanicName: 'BOSS PASSIVE PRESSURE',
    gameplayEffect: 'Crece de forma pasiva durante el combate. Al llenarse, inhabilita las habilidades especiales e inflige daño constante.',
    literaryMeaning: 'El antagonista abstracto de la novela. El silencio coloniza la casa de Daniel, las habitaciones vacías y la mente de los personajes, representando la incomunicación forzada, el marchitamiento conyugal y la muerte de las pasiones.',
    color: 'from-red-600 to-purple-800',
    icon: 'VolumeX'
  }
];

export const quizQuestionsData: QuizQuestion[] = [
  {
    id: 'q1',
    question: '¿Por qué la protagonista se recoge y peina el cabello de manera tan específica?',
    options: [
      { key: 'A', text: 'Para estar a la moda en las exclusivas galas de la ópera en Santiago.' },
      { key: 'B', text: 'Porque Daniel la obliga sutilmente a imitar el peinado exacto de su difunta primera esposa.' },
      { key: 'C', text: 'Como un símbolo de emancipación física y rebeldía contra el orden patriarcal.' }
    ],
    correctAnswer: 'B',
    explanation: 'Daniel vive obsesionado con su fallecida primera esposa. Obligar a la protagonista a imitar su peinado es un acto de violencia psicológica que borra su propia individualidad.'
  },
  {
    id: 'q2',
    question: '¿Qué suceso despierta la conciencia corporal y sensorial de la protagonista?',
    options: [
      { key: 'A', text: 'Un inolvidable paseo a caballo junto a Daniel durante el amanecer.' },
      { key: 'B', text: 'Una noche de amor prohibida y sensual junto a un desconocido en la niebla.' },
      { key: 'C', text: 'El suicidio ritual de Regina que la hace valorar su propia vitalidad.' }
    ],
    correctAnswer: 'B',
    explanation: 'El efímero encuentro erótico con el Amante le devuelve el sentido de su cuerpo, la belleza y la calidez física, contrastando radicalmente con el gélido tedio matrimonial.'
  },
  {
    id: 'q3',
    question: '¿Cuál es el desenlace de la protagonista al final de "La última niebla"?',
    options: [
      { key: 'A', text: 'Se sumerge para siempre en el estanque buscando fundirse con la naturaleza.' },
      { key: 'B', text: 'Acepta resignadamente una vejez sin pasiones ni fervores, viviendo solo por deber.' },
      { key: 'C', text: 'Logra escapar de la hacienda para reunirse con el fantasma de su amante.' }
    ],
    correctAnswer: 'B',
    explanation: 'La novela concluye con la trágica aceptación del vacío existencial. Al comprobar que el Amante se ha desvanecido del todo, decide envejecer en un respetable pero estéril mutismo.'
  },
  {
    id: 'q4',
    question: '¿Qué aporta el personaje del ciego a la ambigüedad sobre la realidad del Amante?',
    options: [
      { key: 'A', text: 'El ciego afirma haber escuchado y olido al Amante en una escena clave, aportando pistas sensoriales reales.' },
      { key: 'B', text: 'Le regala una medalla dorada idéntica a la del Amante, confirmando su complot.' },
      { key: 'C', text: 'Revela que Daniel contrató a un actor para fingir la infidelidad y destruirla.' }
    ],
    correctAnswer: 'A',
    explanation: 'Cuando la protagonista visita la casa del ciego, este recuerda haber oído ruidos de carruaje y percibido el olor a fruta esa noche, lo que insinúa fuertemente que el Amante no fue una simple fantasía.'
  },
  {
    id: 'q5',
    question: 'En el cuento "El Árbol", ¿qué rol cumple el gomero gigante frente a la ventana de Brígida?',
    options: [
      { key: 'A', text: 'Le bloquea la luz del día y representa la opresión intelectual de su marido Luis.' },
      { key: 'B', text: 'Es un escudo protector que filtra la realidad y mantiene a Brígida en un cómodo refugio de ignorancia.' },
      { key: 'C', text: 'Es el lugar secreto donde esconde las partituras prohibidas de Mozart y Chopin.' }
    ],
    correctAnswer: 'B',
    explanation: 'El gomero aísla a Brígida de la rutina árida y de la hostilidad silenciosa de Luis. Al talarlo, el refugio protector cae y se ve forzada a enfrentarse a la horrible verdad de su matrimonio.'
  }
];

export const challengesData: Challenge[] = [
  {
    id: 'dialogue',
    title: 'Desafío Combo 1: Choque de Posturas',
    description: 'Escribe un breve diálogo de combate oral donde el sentido del deber gélido de Daniel choque con el deseo ardiente de la protagonista.',
    instructions: 'Escribe el diálogo usando el formato "Daniel: ..." y "Protagonista: ...". Asegúrate de reflejar la brutalidad material de Daniel y el vuelo onírico o la rebelión sensual de la protagonista.',
    placeholder: 'Daniel: Debes peinarte así, es lo correcto para una esposa...\nProtagonista: Pero bajo la niebla mi cuerpo clama por...',
    exampleText: 'Daniel: Debes amarrarte el pelo y actuar con prudencia. La cena está fría y la finca exige tu presencia real.\nProtagonista: ¡Te equivocas! Me suelto el cabello porque en mis sueños mi cuerpo vuela lejos de esta casa helada, donde tú solo rindes culto a un fantasma muerto.'
  },
  {
    id: 'lover_status',
    title: 'Desafío Combo 2: El Enigma del Ciego',
    description: 'Identifica y argumenta si el Amante fue un ser de carne y hueso o un simple fantasma de la mente, basándote estrictamente en la escena de la casa del ciego.',
    instructions: 'Desarrolla una tesis sólida analizando los indicios que Bombal deja en esa escena (el galope del carruaje, el olor a frutas estivales frente a la ceguera física del anfitrión).',
    placeholder: 'Creo que el Amante es... porque en la casa del ciego sucede que...',
    exampleText: 'El Amante representa la ambigüedad suprema de Bombal. En la casa del ciego, la ceguera física del anfitrión resalta el poder de los otros sentidos: el ciego oyó ruidos de carruaje y sintió olor a frutas frescas de verano, lo que actúa como un contraataque de realidad para contrarrestar la duda de la protagonista.'
  }
];

export const easterEggsData: EasterEgg[] = [
  {
    id: 'paris_neruda',
    title: 'París y Neruda: El Nacimiento en la Cocina',
    badge: 'STAGE REVEALED',
    description: 'María Luisa Bombal estudió literatura en la Sorbona de París y asimiló las técnicas de la vanguardia surrealista. Al regresar, se hizo íntima amiga de Pablo Neruda. De hecho, ¡escribió "La última niebla" en la mesa de la cocina del departamento de Neruda en Buenos Aires!',
    gameConnection: 'Pablo Neruda la llamaba cariñosamente "La Abeja de Fuego" por la intensidad indomable de su prosa y temperamento. En nuestro arcade, este dato te otorga un "Aura de Fuego" que incrementa tu daño contra el desdén patriarcal.'
  },
  {
    id: 'atentado_crillon',
    title: 'El Disparo del Crillón: ¡Un verdadero Boss Move!',
    badge: 'LETAL COMBO',
    description: 'En 1941, obsesionada y dolida por el abandono de su antiguo amante Eulogio Sánchez, María Luisa lo citó en el elegante Hotel Crillón de Santiago, sacó una pistola de su bolso y le disparó tres veces en la pierna en pleno vestíbulo público.',
    gameConnection: 'Eulogio sobrevivió y la eximió de toda culpa legal por el recuerdo de su amor. En nuestro simulador, este hecho histórico se conmemora como el ataque secreto definitivo: "El Disparo del Crillón" (↓ ↘ → + Heavy Punch), un golpe de Pasión Real letal.'
  },
  {
    id: 'amortajada_resurrect',
    title: 'La Amortajada: Origen del "Second Wind"',
    badge: 'SURVIVAL TECH',
    description: 'En su obra maestra "La Amortajada", la protagonista narra los acontecimientos desde su propio ataúd, experimentando el tránsito entre la muerte física y la liberación eterna a través del recuerdo de los vivos.',
    gameConnection: 'Esta genialidad narrativa inspiró el concepto del "Second Wind" (segundo aire) o barra de furia post-mortem en los juegos de pelea modernos. ¡La muerte de Ana María no es derrota, es un despertar de percepción cósmica!'
  }
];

// ==========================================
// --- SEASON 2: LA AMORTAJADA (DLC) DATA ---
// ==========================================

export const fightersSeason2Data: Fighter[] = [
  {
    id: 'anamaria',
    name: 'Ana María',
    title: 'La Amortajada Suprema',
    avatar: 'anamaria',
    attribute: 'Percepción Post-mortem',
    attributeDesc: 'Su mente despierta bajo el velo le permite ver la verdad descarnada detrás de las máscaras de los vivos.',
    bio: 'Yace inmóvil, velada por quienes marcaron su vida. En su tránsito cósmico, experimenta una hipersensibilidad telúrica que le otorga el poder final de comprender, juzgar y trascender.',
    stats: [
      { name: 'Fuerza Física', value: 20, color: 'bg-zinc-600' },
      { name: 'Misterio Post-mortem', value: 99, color: 'bg-purple-500' },
      { name: 'Percepción de Almas', value: 95, color: 'bg-indigo-500' },
      { name: 'Defensa de Mortaja', value: 80, color: 'bg-slate-500' }
    ],
    specialMoves: [
      {
        name: 'Evasión de Sábana',
        input: '↓ ↙ ← + B',
        description: 'Se desmaterializa bajo su velo transparente para esquivar remordimientos.'
      },
      {
        name: 'Juicio Silencioso',
        input: '→ ↓ ↘ + Punch',
        description: 'Lanza un destello de verdad que paraliza a los hipócritas.'
      },
      {
        name: 'Raíces del Tránsito',
        input: '↑ ↑ + Heavy Kick',
        description: 'Invoca la fuerza de la tierra húmeda para aferrar al rival.'
      }
    ]
  },
  {
    id: 'ricardo_s2',
    name: 'Ricardo',
    title: 'Crueldad Adolescente',
    avatar: 'ricardo',
    attribute: 'Crueldad Primaria',
    attributeDesc: 'Su primer amor y posterior abandono dejaron una herida incurable.',
    bio: 'Soberbio, indómito y marcado por el egoísmo juvenil. Su presencia en la vela de Ana María activa recuerdos dolorosos de pasión salvaje y desengaño brutal.',
    stats: [
      { name: 'Fuerza Física', value: 85, color: 'bg-zinc-600' },
      { name: 'Misterio Post-mortem', value: 30, color: 'bg-purple-500' },
      { name: 'Percepción de Almas', value: 45, color: 'bg-indigo-500' },
      { name: 'Defensa de Mortaja', value: 70, color: 'bg-slate-500' }
    ],
    specialMoves: [
      {
        name: 'Embate de Abandono',
        input: '→ → + Punch',
        description: 'Un golpe devastador que derriba al oponente con el peso de la frialdad adolescente.'
      },
      {
        name: 'Cicatriz Salvaje',
        input: '↓ ↘ → + Kick',
        description: 'Lanza una ráfaga cortante inspirada en su temperamento de campo indomable.'
      }
    ]
  },
  {
    id: 'antonio_s2',
    name: 'Antonio',
    title: 'Indiferencia Conyugal',
    avatar: 'antonio',
    attribute: 'Engaño Silencioso',
    attributeDesc: 'El esposo infiel y frío cuyas lágrimas tardías delatan arrepentimiento.',
    bio: 'Hacendado orgulloso que atrapó a Ana María en un matrimonio desprovisto de sintonía emocional, refugiándose en infidelidades.',
    stats: [
      { name: 'Fuerza Física', value: 80, color: 'bg-zinc-600' },
      { name: 'Misterio Post-mortem', value: 25, color: 'bg-purple-500' },
      { name: 'Percepción de Almas', value: 35, color: 'bg-indigo-500' },
      { name: 'Defensa de Mortaja', value: 75, color: 'bg-slate-500' }
    ],
    specialMoves: [
      {
        name: 'Barrera de Resentimiento',
        input: '↓ ↓ + Block',
        description: 'Bloquea el daño emocional proyectando una armadura de absoluto tedio conyugal.'
      },
      {
        name: 'Lágrima de Plomo',
        input: '↓ ↘ → + Punch',
        description: 'Un ataque pesado de arrepentimiento tardío que aturde al oponente.'
      }
    ]
  },
  {
    id: 'fernando_s2',
    name: 'Fernando',
    title: 'Envidia Venenosa',
    avatar: 'fernando',
    attribute: 'Obsesión Confidente',
    attributeDesc: 'El pretendiente sumiso que se siente extrañamente aliviado con su muerte.',
    bio: 'Celoso de la pasión que Ana María sentía por otros, Fernando actuaba como confidente solo para alimentarse de sus dolores cotidianos y verla sumida en la inercia.',
    stats: [
      { name: 'Fuerza Física', value: 55, color: 'bg-zinc-600' },
      { name: 'Misterio Post-mortem', value: 50, color: 'bg-purple-500' },
      { name: 'Percepción de Almas', value: 70, color: 'bg-indigo-500' },
      { name: 'Defensa de Mortaja', value: 60, color: 'bg-slate-500' }
    ],
    specialMoves: [
      {
        name: 'Drenaje de Secretos',
        input: '← ↙ ↓ + Special',
        description: 'Roba energía vital al oponente susurrando viejas confesiones ponzoñosas.'
      },
      {
        name: 'Escudo del Celoso',
        input: '→ ↓ ↘ + Block',
        description: 'Reprime y desvía los ataques usando su devoción pasivo-agresiva.'
      }
    ]
  },
  {
    id: 'fred_s2',
    name: 'Fred',
    title: 'El Susurro de la Tierra',
    avatar: 'fred',
    attribute: 'Conexión Mística',
    attributeDesc: 'El hijo capaz de sentir lo secreto y de comulgar con la tumba de su madre.',
    bio: 'Hijo preferido de Ana María, poseedor de una sensibilidad especial que le permite sentir las raíces, la humedad y el alma libre de su madre en su lecho de tierra.',
    stats: [
      { name: 'Fuerza Física', value: 65, color: 'bg-zinc-600' },
      { name: 'Misterio Post-mortem', value: 85, color: 'bg-purple-500' },
      { name: 'Percepción de Almas', value: 90, color: 'bg-indigo-500' },
      { name: 'Defensa de Mortaja', value: 70, color: 'bg-slate-500' }
    ],
    specialMoves: [
      {
        name: 'Llamado Telúrico',
        input: '↓ ↓ + Kick',
        description: 'Invoca un remolino de hojas húmedas y barro que ralentiza los ataques del oponente.'
      },
      {
        name: 'Sintonía Silvestre',
        input: '↑ ↑ + Heavy Punch',
        description: 'Otorga curación espiritual y escudo temporal gracias a la energía vegetal.'
      }
    ]
  }
];

export const loreLevelsSeason2Data: LoreLevel[] = [
  {
    id: 'padre_s2',
    levelNum: 1,
    title: 'Encuentro 1: El Padre',
    subtitle: 'La inocencia perdida y la infancia salvaje',
    description: 'Ana María rememora su infancia libre y el amor estricto pero protector de su padre. Ante su ataúd, el llanto de su padre resuena como el primer eco de un origen que ya se desvanece.',
    literaryContext: 'El padre representa la autoridad fundacional y la nostalgia por un pasado de pureza silvestre que antecede a las jaulas del matrimonio.',
    status: 'unlocked',
    bossName: 'La Memoria Primigenia',
    bossSkill: 'Lamento de Ceniza'
  },
  {
    id: 'ricardo_s2',
    levelNum: 2,
    title: 'Encuentro 2: Ricardo (El Primer Amor)',
    subtitle: 'La cicatriz de la crueldad adolescente',
    description: 'Ricardo, el primer amor que la abandonó dejándola marcada por el desengaño eterno. Al mirar su cuerpo amortajado, Ricardo siente el peso de su antigua soberbia.',
    literaryContext: 'Ricardo simboliza la pasión fundacional truncada, el arquetipo de amor salvaje que condena el resto de sus relaciones al fracaso comparativo.',
    status: 'locked',
    bossName: 'Ricardo, El Fantasma del Desprecio',
    bossSkill: 'Golpe de Abandono Crítico'
  },
  {
    id: 'antonio_s2',
    levelNum: 3,
    title: 'Encuentro 3: Antonio (El Marido Indiferente)',
    subtitle: 'El ring de las desilusiones conyugales',
    description: 'Antonio, el esposo con quien vivió un matrimonio de mutuo desdén y pasiones frustradas. Ante el féretro, se revelan las lágrimas tardías de un hombre que nunca supo amarla en vida.',
    literaryContext: 'Antonio encarna la inercia del deber social y el violento choque de resentimiento y atracción física inútil.',
    status: 'locked',
    bossName: 'Antonio, El Tirano del Desvío',
    bossSkill: 'Escudo de Indiferencia Absoluta'
  },
  {
    id: 'fernando_s2',
    levelNum: 4,
    title: 'Encuentro 4: Fernando (El Confidente Celoso)',
    subtitle: 'La envidia venenosa de la devoción',
    description: 'Fernando, el eterno pretendiente y confidente que en secreto envidiaba su vitalidad y que ahora experimenta un alivio enfermizo ante su inmovilidad mortal.',
    literaryContext: 'Fernando representa el deseo obsesivo, la sumisión rencorosa y la violencia psicológica del hombre débil frente a la mujer fuerte.',
    status: 'locked',
    bossName: 'Fernando, El Parásito de la Confidencia',
    bossSkill: 'Drenaje de Secretos'
  },
  {
    id: 'hijos_s2',
    levelNum: 5,
    title: 'Encuentro 5: Los Hijos (La Trascendencia)',
    subtitle: 'La conexión mística de Fred con la tierra',
    description: 'Sus hijos la despiden. Entre ellos destaca Fred, el hijo místico que comparte su comunión profunda con la naturaleza y puede percibir su latido secreto post-mortem.',
    literaryContext: 'Los hijos representan la prolongación biológica y espiritual de la mujer guerrera en la tierra.',
    status: 'locked',
    bossName: 'Fred, El Canalizador Telúrico',
    bossSkill: 'Eco de Raíces Salvajes'
  }
];

export const comboSymbolsSeason2Data: ComboSymbol[] = [
  {
    id: 'doble_muerte',
    name: 'La Doble Muerte',
    mechanicName: 'BOSS FINAL RESISTANCE',
    gameplayEffect: 'Reduce a cero el daño de golpes físicos; el rival solo puede ser derrotado vaciando su barra de arrepentimientos terrenales.',
    literaryMeaning: 'El descanso definitivo de la amortajada. No ocurre con el cese de los latidos, sino al agotar la red de pasiones, rencores y memorias de los vivos, permitiéndole fundirse libre con la tierra.',
    color: 'from-zinc-500 to-zinc-700',
    icon: 'ShieldAlert'
  },
  {
    id: 'velo_venda',
    name: 'El Velo / La Venda',
    mechanicName: 'PARALYSIS DEBUFF',
    gameplayEffect: 'Congela las habilidades especiales del oponente por 5 segundos y bloquea el movimiento lateral, simulando el confinamiento físico.',
    literaryMeaning: 'Símbolo del encierro patriarcal, el decoro social y la ceguera emocional impuesta a las mujeres en vida, que solo se rompe con la libertad mística de la muerte.',
    color: 'from-purple-500 to-indigo-700',
    icon: 'VolumeX'
  },
  {
    id: 'naturaleza_guerrera',
    name: 'Naturaleza Guerrera',
    mechanicName: 'TELURIC REGROWTH BUFF',
    gameplayEffect: 'Otorga regeneración constante de escudo y activa el contragolpe automático de raíces espinosas.',
    literaryMeaning: 'La comunión final femenina con el fango, las raíces, la lluvia y los insectos. La tierra no es una tumba inerte, sino un ejército activo que acoge el cuerpo de la mujer en una resistencia orgánica infinita.',
    color: 'from-emerald-700 to-teal-900',
    icon: 'Waves'
  }
];

export const quizQuestionsSeason2Data: QuizQuestion[] = [
  {
    id: 'q1_s2',
    question: '¿Qué elemento de la naturaleza acoge y unifica a Ana María en su tumba al final del relato?',
    options: [
      { key: 'A', text: 'Una densa neblina invernal que inunda el cementerio.' },
      { key: 'B', text: 'Una red de raíces de árboles que sube por su cuerpo y se entrelaza en su cabello.' },
      { key: 'C', text: 'Una ráfaga de viento seco que desintegra su mortaja.' }
    ],
    correctAnswer: 'B',
    explanation: 'Al descender a la fosa, Ana María siente cómo las raíces de los árboles la acogen, entrelazándose en su cuerpo como venas y arterias vegetales, integrándola en la vida secreta de la tierra húmeda.'
  },
  {
    id: 'q2_s2',
    question: '¿Por qué Ana María experimenta un despertar de conciencia después de muerta antes de su descanso definitivo?',
    options: [
      { key: 'A', text: 'Para vengarse de las infidelidades y malos tratos de su esposo Antonio.' },
      { key: 'B', text: 'Para juzgar y desatar los nudos emocionales con quienes la rodean, comprendiendo sus debilidades en vida.' },
      { key: 'C', text: 'Debido a un fenómeno puramente físico de letargo temporal.' }
    ],
    correctAnswer: 'B',
    explanation: 'La lucidez post-mortem de la amortajada le permite observar las almas de sus dolientes ante su féretro, logrando comprender sus motivos reprimidos y deshaciendo el nudo de rencores para poder morir en paz.'
  },
  {
    id: 'q3_s2',
    question: '¿Qué personaje es el confidente de Ana María que en secreto se complace y siente alivio por su muerte?',
    options: [
      { key: 'A', text: 'Su primer amor Ricardo.' },
      { key: 'B', text: 'Su pretendiente sumiso Fernando.' },
      { key: 'C', text: 'Su hijo predilecto Fred.' }
    ],
    correctAnswer: 'B',
    explanation: 'Fernando representa el amor obsesivo y pasivo-agresivo. En vida se alimentaba del sufrimiento y la inercia de Ana María, y ante su féretro experimenta un alivio egoísta, viéndola finalmente libre de los rivales.'
  },
  {
    id: 'q4_s2',
    question: '¿Qué representa conceptualmente la "muerte de los muertos" al concluir "La amortajada"?',
    options: [
      { key: 'A', text: 'El olvido social inmediato por parte de la gente del pueblo.' },
      { key: 'B', text: 'La reencarnación del alma en un animal silvestre.' },
      { key: 'C', text: 'La disolución de los recuerdos terrenales y la comunión definitiva y en calma con la materia universal.' }
    ],
    correctAnswer: 'C',
    explanation: 'La "muerte de los muertos" simboliza el desprendimiento absoluto del ego y de los recuerdos mundanos. Al perdonar a todos y agotar sus vínculos terrenales, Ana María alcanza un descanso total, libre de dolores y unida al fango eterno.'
  }
];

export const challengesSeason2Data: Challenge[] = [
  {
    id: 'confession_s2',
    title: 'Ranked Match: El Veredicto de la Amortajada',
    description: 'Decide a cuál de sus tres grandes detractores/amores (Ricardo, Antonio o Fernando) Ana María otorgaría su perdón definitivo basándote en las citas existenciales del libro.',
    instructions: 'Escribe una justificación académica profunda con el formato "Perdón para [Ricardo/Antonio/Fernando]: ...". Describe cómo su percepción post-mortem disuelve los agravios terrenales para alcanzar la paz telúrica.',
    placeholder: 'Perdón para Ricardo: Te libero de mi dolor de juventud porque en la eternidad del barro el desengaño carece de gravedad...',
    exampleText: 'Perdón para Antonio: Te perdono porque al contemplar tus lágrimas tardías junto a mi féretro, mi percepción post-mortem comprendió tu desamparo y la inmensa cobardía que te impedía sintonizar con mi pasión en vida. En el descanso del fango y la comunión con las raíces, todo matrimonio social y rencor conyugal pierden su consistencia terrenal.'
  }
];
