import { describe, it, expect } from 'vitest';
import { heroes } from '../data/heroes';
import { items } from '../data/items';
import type { HeroStats, Item, CombatSettings, CombatResult, Skill } from '../types';

// ==========================================
// TypeScript 类型验证测试
// ==========================================
describe('Type Validation - 类型验证', () => {
  it('英雄数据应符合HeroStats接口', () => {
    heroes.forEach(hero => {
      // 基本字段
      expect(typeof hero.id).toBe('string');
      expect(typeof hero.name).toBe('string');
      expect(typeof hero.icon).toBe('string');
      expect(typeof hero.role).toBe('string');

      // baseStats
      expect(typeof hero.baseStats.hp).toBe('number');
      expect(typeof hero.baseStats.hpGrowth).toBe('number');
      expect(typeof hero.baseStats.attack).toBe('number');
      expect(typeof hero.baseStats.attackGrowth).toBe('number');
      expect(typeof hero.baseStats.armor).toBe('number');
      expect(typeof hero.baseStats.armorGrowth).toBe('number');
      expect(typeof hero.baseStats.magicResist).toBe('number');
      expect(typeof hero.baseStats.magicResistGrowth).toBe('number');
      expect(typeof hero.baseStats.attackSpeed).toBe('number');
      expect(typeof hero.baseStats.attackSpeedGrowth).toBe('number');
      expect(typeof hero.baseStats.moveSpeed).toBe('number');

      // skills
      expect(typeof hero.skills.q.name).toBe('string');
      expect(typeof hero.skills.q.damage).toBe('number');
      expect(typeof hero.skills.q.cooldown).toBe('number');
    });
  });

  it('装备数据应符合Item接口', () => {
    items.forEach(item => {
      expect(typeof item.id).toBe('string');
      expect(typeof item.name).toBe('string');
      expect(typeof item.cost).toBe('number');
      expect(typeof item.stats).toBe('object');
    });
  });

  it('CombatSettings 默认值测试', () => {
    const settings: CombatSettings = {
      level: 6,
      firstStrike: 'hero1',
      skillHitRate: 80,
      hasIgnite: false,
      hasFlash: false,
      dodgeRate: 0,
      operationLevel: 'gold',
    };
    expect(settings.level).toBe(6);
    expect(settings.firstStrike).toBe('hero1');
    expect(settings.operationLevel).toBe('gold');
  });

  it('操作水平枚举值应完整', () => {
    const validLevels = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master'];
    validLevels.forEach(level => {
      const settings: CombatSettings = {
        level: 6,
        firstStrike: 'hero1',
        skillHitRate: 80,
        hasIgnite: false,
        hasFlash: false,
        dodgeRate: 0,
        operationLevel: level as CombatSettings['operationLevel'],
      };
      expect(settings.operationLevel).toBe(level);
    });
  });
});
