export interface HeroStats {
  id: string;
  name: string;
  icon: string;
  role: string;
  baseStats: {
    hp: number;
    hpGrowth: number;
    attack: number;
    attackGrowth: number;
    armor: number;
    armorGrowth: number;
    magicResist: number;
    magicResistGrowth: number;
    attackSpeed: number;
    attackSpeedGrowth: number;
    moveSpeed: number;
  };
  skills: {
    q: Skill;
    w: Skill;
    e: Skill;
    r: Skill;
  };
  powerSpikes: string[];
  strongPhase: 'early' | 'mid' | 'late';
}

export interface Skill {
  name: string;
  damage: number;
  damageType: 'physical' | 'magic' | 'true';
  cooldown: number;
  scaling: {
    ad?: number;
    ap?: number;
    hp?: number;
  };
  description: string;
}

export interface Item {
  id: string;
  name: string;
  cost: number;
  stats: {
    attack?: number;
    ap?: number;
    hp?: number;
    armor?: number;
    magicResist?: number;
    attackSpeed?: number;
    critChance?: number;
    critDamage?: number;
    lifesteal?: number;
    armorPen?: number;
    magicPen?: number;
  };
  passive?: string;
}

export interface CombatSettings {
  level: number;
  firstStrike: 'hero1' | 'hero2';
  skillHitRate: number;
  hasIgnite: boolean;
  hasFlash: boolean;
  dodgeRate: number;
  operationLevel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
}

export interface CombatResult {
  winner: 'hero1' | 'hero2' | 'draw';
  winRate: number;
  killTime: number;
  remainingHpPercent: number;
  keyFactors: string[];
  damageBreakdown: {
    hero1: number;
    hero2: number;
  };
}
