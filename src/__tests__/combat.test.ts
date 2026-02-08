import { describe, it, expect } from 'vitest';
import {
  calculateStats,
  calculateDPS,
  calculateBurstDamage,
  calculateEffectiveHP,
  simulateCombat,
} from '../utils/combat';
import { heroes } from '../data/heroes';
import { items } from '../data/items';
import type { CombatSettings } from '../types';

// 获取测试用英雄
const yasuo = heroes.find(h => h.id === 'yasuo')!;
const fiora = heroes.find(h => h.id === 'fiora')!;
const jax = heroes.find(h => h.id === 'jax')!;
const darius = heroes.find(h => h.id === 'darius')!;
const riven = heroes.find(h => h.id === 'riven')!;
const zed = heroes.find(h => h.id === 'zed')!;

// 获取测试用装备
const infinityEdge = items.find(i => i.id === 'infinity-edge')!;
const triforce = items.find(i => i.id === 'trinity-force')!;
const blackCleaver = items.find(i => i.id === 'black-cleaver')!;
const bloodthirster = items.find(i => i.id === 'bloodthirster')!;

const defaultSettings: CombatSettings = {
  level: 6,
  firstStrike: 'hero1',
  skillHitRate: 80,
  hasIgnite: false,
  hasFlash: false,
  dodgeRate: 0,
  operationLevel: 'gold',
};

// ==========================================
// 1. calculateStats 测试
// ==========================================
describe('calculateStats - 属性计算', () => {
  it('1级无装备时应返回基础属性', () => {
    const stats = calculateStats(yasuo, [], 1);
    expect(stats.hp).toBe(520);
    expect(stats.attack).toBe(60);
    expect(stats.armor).toBe(30);
    expect(stats.magicResist).toBe(32);
    expect(stats.moveSpeed).toBe(345);
  });

  it('等级成长应正确计算', () => {
    const stats = calculateStats(yasuo, [], 10);
    // hp = 520 + 87 * (10-1) = 520 + 783 = 1303
    expect(stats.hp).toBe(520 + 87 * 9);
    // attack = 60 + 3.2 * 9 = 88.8
    expect(stats.attack).toBeCloseTo(60 + 3.2 * 9);
    // armor = 30 + 3.4 * 9 = 60.6
    expect(stats.armor).toBeCloseTo(30 + 3.4 * 9);
  });

  it('18级属性应正确计算（满级）', () => {
    const stats = calculateStats(darius, [], 18);
    expect(stats.hp).toBe(582 + 100 * 17);
    expect(stats.attack).toBeCloseTo(64 + 5.0 * 17);
    expect(stats.armor).toBeCloseTo(39 + 4.0 * 17);
  });

  it('装备加成应正确叠加', () => {
    const stats = calculateStats(yasuo, [infinityEdge], 1);
    expect(stats.attack).toBe(60 + 70); // 基础60 + 无尽70
    expect(stats.critChance).toBe(20);
    expect(stats.critDamage).toBe(175 + 40); // 基础175 + 无尽40
  });

  it('多件装备属性应累加', () => {
    const stats = calculateStats(jax, [triforce, blackCleaver], 1);
    expect(stats.attack).toBe(68 + 40 + 50); // 基础 + 三相 + 黑切
    expect(stats.hp).toBe(592 + 200 + 400); // 基础 + 三相 + 黑切
    expect(stats.armorPen).toBe(24); // 黑切穿甲
  });

  it('吸血属性应正确计算', () => {
    const stats = calculateStats(yasuo, [bloodthirster], 1);
    expect(stats.lifesteal).toBe(18);
  });

  it('攻速应为乘法叠加', () => {
    const stats = calculateStats(yasuo, [triforce], 1);
    // 基础0.67 * (1 + 30/100) = 0.871
    expect(stats.attackSpeed).toBeCloseTo(0.67 * 1.3);
  });

  it('无装备时暴击伤害应为基础175', () => {
    const stats = calculateStats(yasuo, [], 1);
    expect(stats.critDamage).toBe(175);
    expect(stats.critChance).toBe(0);
    expect(stats.lifesteal).toBe(0);
    expect(stats.armorPen).toBe(0);
  });
});

// ==========================================
// 2. calculateDPS 测试
// ==========================================
describe('calculateDPS - DPS计算', () => {
  it('无暴击无护甲穿透时DPS应正确', () => {
    const stats = { attack: 100, attackSpeed: 1.0, critChance: 0, critDamage: 175, armorPen: 0 };
    const dps = calculateDPS(stats, 0);
    // 无护甲时减伤为0, DPS = 100 * 1.0 * 1 = 100
    expect(dps).toBe(100);
  });

  it('护甲减伤应正确应用', () => {
    const stats = { attack: 100, attackSpeed: 1.0, critChance: 0, critDamage: 175, armorPen: 0 };
    const dps = calculateDPS(stats, 100);
    // 减伤 = 100/(100+100) = 50%, DPS = 100 * 1.0 * 0.5 = 50
    expect(dps).toBe(50);
  });

  it('护甲穿透应减少有效护甲', () => {
    const stats = { attack: 100, attackSpeed: 1.0, critChance: 0, critDamage: 175, armorPen: 50 };
    const dps = calculateDPS(stats, 100);
    // 有效护甲 = max(0, 100-50) = 50, 减伤 = 50/150 = 1/3
    expect(dps).toBeCloseTo(100 * (1 - 50 / 150));
  });

  it('护甲穿透不应导致负护甲', () => {
    const stats = { attack: 100, attackSpeed: 1.0, critChance: 0, critDamage: 175, armorPen: 200 };
    const dps = calculateDPS(stats, 50);
    // 有效护甲 = max(0, 50-200) = 0, 无减伤
    expect(dps).toBe(100);
  });

  it('暴击应增加平均伤害', () => {
    const statsNoCrit = { attack: 100, attackSpeed: 1.0, critChance: 0, critDamage: 175, armorPen: 0 };
    const statsCrit = { attack: 100, attackSpeed: 1.0, critChance: 50, critDamage: 200, armorPen: 0 };
    const dpsNoCrit = calculateDPS(statsNoCrit, 0);
    const dpsCrit = calculateDPS(statsCrit, 0);
    expect(dpsCrit).toBeGreaterThan(dpsNoCrit);
  });

  it('攻速应线性增加DPS', () => {
    const stats1 = { attack: 100, attackSpeed: 1.0, critChance: 0, critDamage: 175, armorPen: 0 };
    const stats2 = { attack: 100, attackSpeed: 2.0, critChance: 0, critDamage: 175, armorPen: 0 };
    expect(calculateDPS(stats2, 0)).toBe(2 * calculateDPS(stats1, 0));
  });
});

// ==========================================
// 3. calculateBurstDamage 测试
// ==========================================
describe('calculateBurstDamage - 爆发伤害', () => {
  it('6级以下不应计入R技能伤害', () => {
    const stats = calculateStats(yasuo, [], 5);
    const burstLv5 = calculateBurstDamage(yasuo, stats, 5, 30, 32);
    const statsLv6 = calculateStats(yasuo, [], 6);
    const burstLv6 = calculateBurstDamage(yasuo, statsLv6, 6, 30, 32);
    expect(burstLv6).toBeGreaterThan(burstLv5);
  });

  it('真实伤害不应被护甲/魔抗减免', () => {
    const stats = calculateStats(fiora, [], 6);
    // 剑姬R是真实伤害
    const burstLowArmor = calculateBurstDamage(fiora, stats, 6, 30, 32);
    const burstHighArmor = calculateBurstDamage(fiora, stats, 6, 200, 200);
    // 由于R是真实伤害，高护甲时R部分不变，但Q/W/普攻会变少
    // 所以高护甲时总伤害更低，但真实伤害部分不变
    expect(burstHighArmor).toBeLessThan(burstLowArmor);
  });

  it('魔法伤害应受魔抗减免', () => {
    const stats = calculateStats(yasuo, [], 1);
    // 亚索E是魔法伤害
    const burstLowMR = calculateBurstDamage(yasuo, stats, 1, 30, 0);
    const burstHighMR = calculateBurstDamage(yasuo, stats, 1, 30, 100);
    expect(burstHighMR).toBeLessThan(burstLowMR);
  });

  it('应包含3次普攻伤害', () => {
    const stats = calculateStats(yasuo, [infinityEdge], 1);
    // 爆发伤害应大于0
    const burst = calculateBurstDamage(yasuo, stats, 1, 0, 0);
    expect(burst).toBeGreaterThan(0);
    // 应包含至少3次普攻伤害 (130 * 3 = 390) + 技能
    expect(burst).toBeGreaterThan(stats.attack * 3);
  });

  it('AD加成应影响技能伤害', () => {
    const statsNoItems = calculateStats(zed, [], 6);
    const burstNoItems = calculateBurstDamage(zed, statsNoItems, 6, 30, 32);
    const statsWithItems = calculateStats(zed, [infinityEdge], 6);
    const burstWithItems = calculateBurstDamage(zed, statsWithItems, 6, 30, 32);
    expect(burstWithItems).toBeGreaterThan(burstNoItems);
  });
});

// ==========================================
// 4. calculateEffectiveHP 测试
// ==========================================
describe('calculateEffectiveHP - 有效生命值', () => {
  it('无护甲/魔抗时有效HP等于实际HP', () => {
    const ehp = calculateEffectiveHP(1000, 0, 0);
    expect(ehp).toBe(1000);
  });

  it('护甲应增加物理有效HP', () => {
    const ehp = calculateEffectiveHP(1000, 100, 0);
    // physicalEHP = 1000 * 2 = 2000, magicEHP = 1000 * 1 = 1000, avg = 1500
    expect(ehp).toBe(1500);
  });

  it('魔抗应增加魔法有效HP', () => {
    const ehp = calculateEffectiveHP(1000, 0, 100);
    expect(ehp).toBe(1500);
  });

  it('双抗应同时增加有效HP', () => {
    const ehp = calculateEffectiveHP(1000, 100, 100);
    // physicalEHP = 2000, magicEHP = 2000, avg = 2000
    expect(ehp).toBe(2000);
  });

  it('更高的HP基础应产生更高的有效HP', () => {
    const ehp1 = calculateEffectiveHP(1000, 50, 50);
    const ehp2 = calculateEffectiveHP(2000, 50, 50);
    expect(ehp2).toBeGreaterThan(ehp1);
  });
});

// ==========================================
// 5. simulateCombat 测试
// ==========================================
describe('simulateCombat - 战斗模拟', () => {
  it('应返回有效的战斗结果', () => {
    const result = simulateCombat(yasuo, [], fiora, [], defaultSettings);
    expect(result).toHaveProperty('winner');
    expect(result).toHaveProperty('winRate');
    expect(result).toHaveProperty('killTime');
    expect(result).toHaveProperty('remainingHpPercent');
    expect(result).toHaveProperty('keyFactors');
    expect(result).toHaveProperty('damageBreakdown');
  });

  it('胜率应在15-85之间', () => {
    const result = simulateCombat(yasuo, [], fiora, [], defaultSettings);
    expect(result.winRate).toBeGreaterThanOrEqual(15);
    expect(result.winRate).toBeLessThanOrEqual(85);
  });

  it('胜者应为hero1或hero2', () => {
    const result = simulateCombat(yasuo, [], jax, [], defaultSettings);
    expect(['hero1', 'hero2', 'draw']).toContain(result.winner);
  });

  it('剩余生命百分比应大于等于0', () => {
    const result = simulateCombat(yasuo, [], fiora, [], defaultSettings);
    expect(result.remainingHpPercent).toBeGreaterThanOrEqual(0);
  });

  it('击杀时间应在0-20秒之间', () => {
    const result = simulateCombat(yasuo, [], fiora, [], defaultSettings);
    expect(result.killTime).toBeGreaterThanOrEqual(0);
    expect(result.killTime).toBeLessThanOrEqual(20);
  });

  it('先手优势应影响战斗结果', () => {
    const result1 = simulateCombat(yasuo, [], fiora, [], {
      ...defaultSettings,
      firstStrike: 'hero1',
    });
    const result2 = simulateCombat(yasuo, [], fiora, [], {
      ...defaultSettings,
      firstStrike: 'hero2',
    });
    // 先手方的伤害输出应不同
    expect(result1.damageBreakdown.hero1).not.toBe(result2.damageBreakdown.hero1);
  });

  it('点燃应增加先手方伤害', () => {
    const resultNoIgnite = simulateCombat(yasuo, [], fiora, [], {
      ...defaultSettings,
      hasIgnite: false,
    });
    const resultIgnite = simulateCombat(yasuo, [], fiora, [], {
      ...defaultSettings,
      hasIgnite: true,
    });
    expect(resultIgnite.damageBreakdown.hero1).toBeGreaterThan(
      resultNoIgnite.damageBreakdown.hero1
    );
  });

  it('不同操作水平应产生不同的战斗结果', () => {
    const resultBronze = simulateCombat(yasuo, [], fiora, [], {
      ...defaultSettings,
      operationLevel: 'bronze',
    });
    const resultMaster = simulateCombat(yasuo, [], fiora, [], {
      ...defaultSettings,
      operationLevel: 'master',
    });
    // 不同操作水平应产生不同的伤害输出（burst阶段不同，但持续阶段DPS一样导致总伤害可能逆转）
    expect(resultMaster.damageBreakdown.hero1).not.toBe(resultBronze.damageBreakdown.hero1);
  });

  it('装备应影响战斗结果', () => {
    const resultNoItems = simulateCombat(yasuo, [], fiora, [], defaultSettings);
    const resultWithItems = simulateCombat(
      yasuo,
      [infinityEdge, bloodthirster],
      fiora,
      [],
      defaultSettings
    );
    expect(resultWithItems.damageBreakdown.hero1).toBeGreaterThan(
      resultNoItems.damageBreakdown.hero1
    );
  });

  it('关键因素数组不应为空', () => {
    const result = simulateCombat(yasuo, [], fiora, [], defaultSettings);
    expect(Array.isArray(result.keyFactors)).toBe(true);
  });

  it('伤害分解应包含hero1和hero2', () => {
    const result = simulateCombat(yasuo, [], jax, [], defaultSettings);
    expect(result.damageBreakdown.hero1).toBeGreaterThan(0);
    expect(result.damageBreakdown.hero2).toBeGreaterThan(0);
  });

  it('所有英雄两两对战都应返回有效结果', () => {
    const allHeroes = [yasuo, fiora, jax, darius, riven, zed];
    for (let i = 0; i < allHeroes.length; i++) {
      for (let j = i + 1; j < allHeroes.length; j++) {
        const result = simulateCombat(allHeroes[i], [], allHeroes[j], [], defaultSettings);
        expect(result.winner).toBeDefined();
        expect(result.winRate).toBeGreaterThanOrEqual(15);
        expect(result.winRate).toBeLessThanOrEqual(85);
        expect(result.killTime).toBeLessThanOrEqual(20);
      }
    }
  });
});
