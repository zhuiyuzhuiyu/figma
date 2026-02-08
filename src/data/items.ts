import type { Item } from '../types';

export const items: Item[] = [
  {
    id: 'infinity-edge',
    name: '无尽之刃',
    cost: 3400,
    stats: {
      attack: 70,
      critChance: 20,
      critDamage: 40,
    },
    passive: '暴击伤害提升40%',
  },
  {
    id: 'statikk-shiv',
    name: '电刀',
    cost: 2900,
    stats: {
      attack: 50,
      attackSpeed: 40,
      critChance: 20,
    },
    passive: '闪电链伤害',
  },
  {
    id: 'blade-of-ruined-king',
    name: '破败王者之刃',
    cost: 3200,
    stats: {
      attack: 40,
      attackSpeed: 25,
      lifesteal: 10,
    },
    passive: '造成目标当前生命值8%的伤害',
  },
  {
    id: 'trinity-force',
    name: '三相之力',
    cost: 3333,
    stats: {
      attack: 40,
      hp: 200,
      attackSpeed: 30,
    },
    passive: '攻击后下次攻击造成200%基础AD伤害',
  },
  {
    id: 'ravenous-hydra',
    name: '贪欲九头蛇',
    cost: 3300,
    stats: {
      attack: 70,
      lifesteal: 12,
    },
    passive: '攻击造成范围伤害',
  },
  {
    id: 'black-cleaver',
    name: '黑色切割者',
    cost: 3100,
    stats: {
      attack: 50,
      hp: 400,
      armorPen: 24,
    },
    passive: '攻击削减护甲',
  },
  {
    id: 'deaths-dance',
    name: '死亡之舞',
    cost: 3200,
    stats: {
      attack: 55,
      armor: 45,
    },
    passive: '延迟30%伤害',
  },
  {
    id: 'guardian-angel',
    name: '守护天使',
    cost: 2800,
    stats: {
      attack: 40,
      armor: 40,
    },
    passive: '死亡后复活',
  },
  {
    id: 'bloodthirster',
    name: '饮血剑',
    cost: 3400,
    stats: {
      attack: 75,
      lifesteal: 18,
    },
    passive: '额外护盾',
  },
  {
    id: 'mortal-reminder',
    name: '凡性的提醒',
    cost: 2600,
    stats: {
      attack: 45,
      critChance: 20,
      armorPen: 30,
    },
    passive: '造成重伤',
  },
  {
    id: 'steraks-gage',
    name: '斯特拉克的挑战护手',
    cost: 3100,
    stats: {
      attack: 50,
      hp: 400,
    },
    passive: '低血量时获得护盾',
  },
  {
    id: 'phantom-dancer',
    name: '幻影之舞',
    cost: 2800,
    stats: {
      attack: 20,
      attackSpeed: 45,
      critChance: 20,
    },
    passive: '移动速度提升',
  },
  {
    id: 'eclipse',
    name: '星蚀',
    cost: 3100,
    stats: {
      attack: 55,
      armorPen: 18,
    },
    passive: '造成最大生命值百分比伤害',
  },
  {
    id: 'duskblade',
    name: '幕刃',
    cost: 3100,
    stats: {
      attack: 60,
      armorPen: 18,
    },
    passive: '击杀后隐身',
  },
];
