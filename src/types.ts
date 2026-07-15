export interface Stat {
  name: string;
  value: number; // 0 to 100
  color: string;
}

export interface Fighter {
  id: string;
  name: string;
  title: string;
  avatar: string; // SVG path or generic descriptor
  attribute: string; // Special quality, e.g. "Vuelo Onírico"
  attributeDesc: string;
  bio: string;
  stats: Stat[];
  specialMoves: {
    name: string;
    input: string; // Keyboard button combo like "↓ ↘ → + A"
    description: string;
  }[];
}

export interface LoreLevel {
  id: string;
  levelNum: number;
  title: string;
  subtitle: string;
  description: string;
  literaryContext: string;
  status: 'locked' | 'unlocked' | 'cleared';
  bossName: string;
  bossSkill: string;
}

export interface ComboSymbol {
  id: string;
  name: string;
  mechanicName: string; // e.g. "DEBUFF", "BUFF", "BOSS RESISTANCE"
  gameplayEffect: string;
  literaryMeaning: string;
  color: string;
  icon: string; // Lucide icon identifier
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string; // e.g. "B"
  explanation: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string;
  placeholder: string;
  exampleText: string;
}

export interface EasterEgg {
  id: string;
  title: string;
  badge: string;
  description: string;
  gameConnection: string;
}
