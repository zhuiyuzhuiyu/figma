import { describe, it, expect } from 'vitest';
import { heroes } from '../data/heroes';
import { items } from '../data/items';

// ==========================================
// 英雄数据完整性测试
// ==========================================
describe('Heroes Data - 英雄数据完整性', () => {
  it('应有6个英雄', () => {
    expect(heroes).toHaveLength(6);
  });

  it('所有英雄ID应唯一', () => {
    const ids = heroes.map(h => h.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('应包含所有预期英雄', () => {
    const ids = heroes.map(h => h.id);
    expect(ids).toContain('yasuo');
    expect(ids).toContain('fiora');
    expect(ids).toContain('jax');
    expect(ids).toContain('darius');
    expect(ids).toContain('riven');
    expect(ids).toContain('zed');
  });

  heroes.forEach(hero => {
    describe(`${hero.name} (${hero.id})`, () => {
      it('基础属性应为正数', () => {
        expect(hero.baseStats.hp).toBeGreaterThan(0);
        expect(hero.baseStats.attack).toBeGreaterThan(0);
        expect(hero.baseStats.armor).toBeGreaterThan(0);
        expect(hero.baseStats.magicResist).toBeGreaterThan(0);
        expect(hero.baseStats.attackSpeed).toBeGreaterThan(0);
        expect(hero.baseStats.moveSpeed).toBeGreaterThan(0);
      });

      it('成长属性应为非负数', () => {
        expect(hero.baseStats.hpGrowth).toBeGreaterThanOrEqual(0);
        expect(hero.baseStats.attackGrowth).toBeGreaterThanOrEqual(0);
        expect(hero.baseStats.armorGrowth).toBeGreaterThanOrEqual(0);
        expect(hero.baseStats.magicResistGrowth).toBeGreaterThanOrEqual(0);
        expect(hero.baseStats.attackSpeedGrowth).toBeGreaterThanOrEqual(0);
      });

      it('应有完整的四个技能 (Q/W/E/R)', () => {
        expect(hero.skills.q).toBeDefined();
        expect(hero.skills.w).toBeDefined();
        expect(hero.skills.e).toBeDefined();
        expect(hero.skills.r).toBeDefined();
      });

      it('技能应有名称和描述', () => {
        ['q', 'w', 'e', 'r'].forEach(key => {
          const skill = hero.skills[key as keyof typeof hero.skills];
          expect(skill.name).toBeTruthy();
          expect(skill.description).toBeTruthy();
        });
      });

      it('技能伤害类型应有效', () => {
        ['q', 'w', 'e', 'r'].forEach(key => {
          const skill = hero.skills[key as keyof typeof hero.skills];
          expect(['physical', 'magic', 'true']).toContain(skill.damageType);
        });
      });

      it('技能CD应为非负数', () => {
        ['q', 'w', 'e', 'r'].forEach(key => {
          const skill = hero.skills[key as keyof typeof hero.skills];
          expect(skill.cooldown).toBeGreaterThanOrEqual(0);
        });
      });

      it('应有强势阶段标识', () => {
        expect(['early', 'mid', 'late']).toContain(hero.strongPhase);
      });

      it('应有强势节点数组', () => {
        expect(Array.isArray(hero.powerSpikes)).toBe(true);
        expect(hero.powerSpikes.length).toBeGreaterThan(0);
      });

      it('应有角色定位', () => {
        expect(hero.role).toBeTruthy();
      });

      it('应有图标', () => {
        expect(hero.icon).toBeTruthy();
      });
    });
  });
});

// ==========================================
// 装备数据完整性测试
// ==========================================
describe('Items Data - 装备数据完整性', () => {
  it('应有至少10件装备', () => {
    expect(items.length).toBeGreaterThanOrEqual(10);
  });

  it('所有装备ID应唯一', () => {
    const ids = items.map(i => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  items.forEach(item => {
    describe(`${item.name} (${item.id})`, () => {
      it('价格应为正数', () => {
        expect(item.cost).toBeGreaterThan(0);
      });

      it('应有名称', () => {
        expect(item.name).toBeTruthy();
      });

      it('应有至少一个属性加成', () => {
        const hasStats = Object.values(item.stats).some(v => v !== undefined && v > 0);
        expect(hasStats).toBe(true);
      });

      it('所有属性值应为非负数', () => {
        Object.entries(item.stats).forEach(([key, value]) => {
          if (value !== undefined) {
            expect(value).toBeGreaterThanOrEqual(0);
          }
        });
      });
    });
  });

  it('应包含核心装备', () => {
    const itemIds = items.map(i => i.id);
    expect(itemIds).toContain('infinity-edge');
    expect(itemIds).toContain('trinity-force');
    expect(itemIds).toContain('black-cleaver');
    expect(itemIds).toContain('bloodthirster');
  });
});

// ==========================================
// 数据平衡性测试
// ==========================================
describe('Data Balance - 数据平衡性', () => {
  it('英雄1级HP应在合理范围 (400-700)', () => {
    heroes.forEach(hero => {
      expect(hero.baseStats.hp).toBeGreaterThanOrEqual(400);
      expect(hero.baseStats.hp).toBeLessThanOrEqual(700);
    });
  });

  it('英雄基础攻击力应在合理范围 (50-80)', () => {
    heroes.forEach(hero => {
      expect(hero.baseStats.attack).toBeGreaterThanOrEqual(50);
      expect(hero.baseStats.attack).toBeLessThanOrEqual(80);
    });
  });

  it('英雄移速应在合理范围 (325-355)', () => {
    heroes.forEach(hero => {
      expect(hero.baseStats.moveSpeed).toBeGreaterThanOrEqual(325);
      expect(hero.baseStats.moveSpeed).toBeLessThanOrEqual(355);
    });
  });

  it('装备价格应在合理范围 (2000-4000)', () => {
    items.forEach(item => {
      expect(item.cost).toBeGreaterThanOrEqual(2000);
      expect(item.cost).toBeLessThanOrEqual(4000);
    });
  });
});
