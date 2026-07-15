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
