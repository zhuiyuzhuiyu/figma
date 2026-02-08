import type { HeroStats, Item, CombatSettings, CombatResult } from '../types';

export function calculateStats(hero: HeroStats, items: Item[], level: number) {
  const { baseStats } = hero;
  
  // 计算等级成长
  const hp = baseStats.hp + baseStats.hpGrowth * (level - 1);
  const attack = baseStats.attack + baseStats.attackGrowth * (level - 1);
  const armor = baseStats.armor + baseStats.armorGrowth * (level - 1);
  const magicResist = baseStats.magicResist + baseStats.magicResistGrowth * (level - 1);
  const attackSpeed = baseStats.attackSpeed * (1 + baseStats.attackSpeedGrowth * (level - 1));
  
  // 装备加成
  let totalAttack = attack;
  let totalHp = hp;
  let totalArmor = armor;
  let totalMagicResist = magicResist;
  let totalAttackSpeed = attackSpeed;
  let critChance = 0;
  let critDamage = 175; // 基础暴击伤害
  let lifesteal = 0;
  let armorPen = 0;
  
  items.forEach(item => {
    totalAttack += item.stats.attack || 0;
    totalHp += item.stats.hp || 0;
    totalArmor += item.stats.armor || 0;
    totalMagicResist += item.stats.magicResist || 0;
    totalAttackSpeed *= (1 + (item.stats.attackSpeed || 0) / 100);
    critChance += item.stats.critChance || 0;
    critDamage += item.stats.critDamage || 0;
    lifesteal += item.stats.lifesteal || 0;
    armorPen += item.stats.armorPen || 0;
  });
  
  return {
    hp: totalHp,
    attack: totalAttack,
    armor: totalArmor,
    magicResist: totalMagicResist,
    attackSpeed: totalAttackSpeed,
    critChance,
    critDamage,
    lifesteal,
    armorPen,
    moveSpeed: baseStats.moveSpeed,
  };
}

export function calculateDPS(stats: any, targetArmor: number) {
  const effectiveArmor = Math.max(0, targetArmor - stats.armorPen);
  const damageReduction = effectiveArmor / (100 + effectiveArmor);
  
  const avgDamage = stats.attack * (1 + (stats.critChance / 100) * (stats.critDamage / 100));
  const dps = avgDamage * stats.attackSpeed * (1 - damageReduction);
  
  return dps;
}

export function calculateBurstDamage(hero: HeroStats, stats: any, level: number, targetArmor: number, targetMR: number) {
  const effectiveArmor = Math.max(0, targetArmor - stats.armorPen);
  const armorReduction = effectiveArmor / (100 + effectiveArmor);
  const mrReduction = targetMR / (100 + targetMR);
  
  let totalBurst = 0;
  
  // Q技能伤害
  const qDamage = hero.skills.q.damage + (hero.skills.q.scaling.ad || 0) * stats.attack;
  if (hero.skills.q.damageType === 'physical') {
    totalBurst += qDamage * (1 - armorReduction);
  } else if (hero.skills.q.damageType === 'magic') {
    totalBurst += qDamage * (1 - mrReduction);
  } else {
    totalBurst += qDamage;
  }
  
  // W技能伤害
  const wDamage = hero.skills.w.damage + (hero.skills.w.scaling.ad || 0) * stats.attack;
  if (hero.skills.w.damageType === 'physical') {
    totalBurst += wDamage * (1 - armorReduction);
  } else if (hero.skills.w.damageType === 'magic') {
    totalBurst += wDamage * (1 - mrReduction);
  } else {
    totalBurst += wDamage;
  }
  
  // E技能伤害
  const eDamage = hero.skills.e.damage + (hero.skills.e.scaling.ad || 0) * stats.attack;
  if (hero.skills.e.damageType === 'physical') {
    totalBurst += eDamage * (1 - armorReduction);
  } else if (hero.skills.e.damageType === 'magic') {
    totalBurst += eDamage * (1 - mrReduction);
  } else {
    totalBurst += eDamage;
  }
  
  // R技能伤害（6级以上）
  if (level >= 6) {
    const rDamage = hero.skills.r.damage + (hero.skills.r.scaling.ad || 0) * stats.attack;
    if (hero.skills.r.damageType === 'physical') {
      totalBurst += rDamage * (1 - armorReduction);
    } else if (hero.skills.r.damageType === 'magic') {
      totalBurst += rDamage * (1 - mrReduction);
    } else {
      totalBurst += rDamage;
    }
  }
  
  // 加上3次普攻
  const aaDamage = stats.attack * (1 - armorReduction) * 3;
  totalBurst += aaDamage;
  
  return totalBurst;
}

export function calculateEffectiveHP(hp: number, armor: number, magicResist: number) {
  const physicalEHP = hp * (1 + armor / 100);
  const magicEHP = hp * (1 + magicResist / 100);
  
  // 返回平均有效生命值
  return (physicalEHP + magicEHP) / 2;
}

export function simulateCombat(
  hero1: HeroStats,
  hero1Items: Item[],
  hero2: HeroStats,
  hero2Items: Item[],
  settings: CombatSettings
): CombatResult {
  const stats1 = calculateStats(hero1, hero1Items, settings.level);
  const stats2 = calculateStats(hero2, hero2Items, settings.level);
  
  // 计算DPS
  const dps1 = calculateDPS(stats1, stats2.armor);
  const dps2 = calculateDPS(stats2, stats1.armor);
  
  // 计算爆发伤害
  const burst1 = calculateBurstDamage(hero1, stats1, settings.level, stats2.armor, stats2.magicResist);
  const burst2 = calculateBurstDamage(hero2, stats2, settings.level, stats1.armor, stats1.magicResist);
  
  // 技能命中率影响
  const effectiveBurst1 = burst1 * (settings.skillHitRate / 100);
  const effectiveBurst2 = burst2 * (settings.skillHitRate / 100);
  
  // 操作水平影响（提升伤害和减少受到的伤害）
  const operationMultipliers = {
    bronze: 0.7,
    silver: 0.8,
    gold: 0.9,
    platinum: 1.0,
    diamond: 1.1,
    master: 1.2,
  };
  const opMultiplier = operationMultipliers[settings.operationLevel];
  
  // 先手优势
  let damage1 = effectiveBurst1 * opMultiplier;
  let damage2 = effectiveBurst2 * opMultiplier;
  
  if (settings.firstStrike === 'hero1') {
    damage1 *= 1.15; // 先手15%优势
  } else {
    damage2 *= 1.15;
  }
  
  // 点燃伤害
  if (settings.hasIgnite) {
    const igniteDamage = 70 + (settings.level * 20);
    if (settings.firstStrike === 'hero1') {
      damage1 += igniteDamage;
    } else {
      damage2 += igniteDamage;
    }
  }
  
  // 模拟战斗
  let hp1 = stats1.hp;
  let hp2 = stats2.hp;
  let time = 0;
  
  // 爆发阶段（前3秒）
  hp2 -= damage1;
  hp1 -= damage2;
  time = 3;
  
  // 持续输出阶段
  while (hp1 > 0 && hp2 > 0 && time < 20) {
    // 吸血效果
    const heal1 = dps1 * (stats1.lifesteal / 100) * 0.5;
    const heal2 = dps2 * (stats2.lifesteal / 100) * 0.5;
    
    hp2 -= dps1 * 0.5;
    hp1 -= dps2 * 0.5;
    
    hp1 += heal1 * 0.5;
    hp2 += heal2 * 0.5;
    
    time += 0.5;
  }
  
  // 确定结果
  let winner: 'hero1' | 'hero2' | 'draw';
  let remainingHpPercent = 0;
  
  if (hp1 > 0 && hp2 <= 0) {
    winner = 'hero1';
    remainingHpPercent = (hp1 / stats1.hp) * 100;
  } else if (hp2 > 0 && hp1 <= 0) {
    winner = 'hero2';
    remainingHpPercent = (hp2 / stats2.hp) * 100;
  } else {
    winner = hp1 > hp2 ? 'hero1' : 'hero2';
    remainingHpPercent = hp1 > hp2 ? (hp1 / stats1.hp) * 100 : (hp2 / stats2.hp) * 100;
  }
  
  // 计算胜率（基于多项因素）
  const damageRatio = damage1 / damage2;
  const dpsRatio = dps1 / dps2;
  const hpRatio = stats1.hp / stats2.hp;
  
  let winRate = 50;
  if (winner === 'hero1') {
    winRate = 50 + Math.min(45, (damageRatio - 1) * 30 + (dpsRatio - 1) * 15 + (hpRatio - 1) * 10);
  } else {
    winRate = 50 - Math.min(45, (1 / damageRatio - 1) * 30 + (1 / dpsRatio - 1) * 15 + (1 / hpRatio - 1) * 10);
  }
  
  winRate = Math.max(15, Math.min(85, winRate));
  
  // 关键因素分析
  const keyFactors: string[] = [];
  
  if (settings.firstStrike === winner) {
    keyFactors.push('先手优势明显');
  }
  
  if (damageRatio > 1.3 || damageRatio < 0.77) {
    keyFactors.push('爆发伤害差距较大');
  }
  
  if (stats1.lifesteal > 10 || stats2.lifesteal > 10) {
    keyFactors.push('吸血效果明显');
  }
  
  if (settings.skillHitRate < 70) {
    keyFactors.push('技能命中率较低影响输出');
  }
  
  if (hero1.id === 'fiora' && keyFactors.length < 3) {
    keyFactors.push('剑姬W格挡成功');
  }
  
  if (hero2.id === 'jax' && keyFactors.length < 3) {
    keyFactors.push('武器E闪避普攻');
  }
  
  return {
    winner,
    winRate,
    killTime: time,
    remainingHpPercent,
    keyFactors,
    damageBreakdown: {
      hero1: damage1 + dps1 * (time - 3),
      hero2: damage2 + dps2 * (time - 3),
    },
  };
}
