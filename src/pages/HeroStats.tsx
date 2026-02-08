import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { HeroCard } from '../components/HeroCard';
import { heroes } from '../data/heroes';
import type { HeroStats } from '../types';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

export function HeroStats() {
  const [selectedHero, setSelectedHero] = useState<HeroStats | null>(null);
  const [level, setLevel] = useState(6);

  const calculateLevelStats = (hero: HeroStats, lvl: number) => {
    const { baseStats } = hero;
    return {
      hp: Math.round(baseStats.hp + baseStats.hpGrowth * (lvl - 1)),
      attack: Math.round(baseStats.attack + baseStats.attackGrowth * (lvl - 1)),
      armor: Math.round(baseStats.armor + baseStats.armorGrowth * (lvl - 1)),
      magicResist: Math.round(baseStats.magicResist + baseStats.magicResistGrowth * (lvl - 1)),
      attackSpeed: (baseStats.attackSpeed * (1 + baseStats.attackSpeedGrowth * (lvl - 1))).toFixed(2),
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 md:pb-8">
      <Navigation />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">📊 英雄属性对比</h1>
          <p className="text-sm md:text-base text-slate-400">查看英雄详细数据和成长曲线</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Hero Selection */}
          <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
            <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">选择英雄</h2>
            <div className="space-y-2 md:space-y-3">
              {heroes.map(hero => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  selected={selectedHero?.id === hero.id}
                  onClick={() => setSelectedHero(hero)}
                />
              ))}
            </div>
          </div>

          {/* Hero Details */}
          {selectedHero && (
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="text-4xl md:text-6xl">{selectedHero.icon}</div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedHero.name}</h2>
                    <p className="text-sm md:text-base text-slate-400">{selectedHero.role}</p>
                  </div>
                </div>

                <div className="mb-4 md:mb-6">
                  <label className="block text-xs md:text-sm text-slate-400 mb-2">等级: {level}</label>
                  <input
                    type="range"
                    min="1"
                    max="18"
                    value={level}
                    onChange={e => setLevel(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Base Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {(() => {
                    const stats = calculateLevelStats(selectedHero, level);
                    return (
                      <>
                        <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                          <div className="text-xs md:text-sm text-slate-400">生命值</div>
                          <div className="text-xl md:text-2xl font-bold text-red-400">{stats.hp}</div>
                          <div className="text-xs text-slate-500">+{selectedHero.baseStats.hpGrowth}/级</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                          <div className="text-xs md:text-sm text-slate-400">攻击力</div>
                          <div className="text-xl md:text-2xl font-bold text-orange-400">{stats.attack}</div>
                          <div className="text-xs text-slate-500">+{selectedHero.baseStats.attackGrowth}/级</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                          <div className="text-xs md:text-sm text-slate-400">护甲</div>
                          <div className="text-xl md:text-2xl font-bold text-yellow-400">{stats.armor}</div>
                          <div className="text-xs text-slate-500">+{selectedHero.baseStats.armorGrowth}/级</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                          <div className="text-xs md:text-sm text-slate-400">魔抗</div>
                          <div className="text-xl md:text-2xl font-bold text-purple-400">{stats.magicResist}</div>
                          <div className="text-xs text-slate-500">+{selectedHero.baseStats.magicResistGrowth}/级</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                          <div className="text-xs md:text-sm text-slate-400">攻击速度</div>
                          <div className="text-xl md:text-2xl font-bold text-green-400">{stats.attackSpeed}</div>
                          <div className="text-xs text-slate-500">+{(selectedHero.baseStats.attackSpeedGrowth * 100).toFixed(1)}%/级</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3 md:p-4">
                          <div className="text-xs md:text-sm text-slate-400">移速</div>
                          <div className="text-xl md:text-2xl font-bold text-blue-400">{selectedHero.baseStats.moveSpeed}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">技能详情</h3>
                <div className="space-y-3 md:space-y-4">
                  {Object.entries(selectedHero.skills).map(([key, skill]) => (
                    <div key={key} className="bg-slate-800 rounded-lg p-3 md:p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="uppercase font-bold text-white mr-2 text-sm md:text-base">{key}</span>
                          <span className="text-white text-sm md:text-base">{skill.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                          skill.damageType === 'physical' ? 'bg-orange-500/20 text-orange-400' :
                          skill.damageType === 'magic' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-white/20 text-white'
                        }`}>
                          {skill.damageType === 'physical' ? '物理' : skill.damageType === 'magic' ? '魔法' : '真实'}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-300 mb-2">{skill.description}</p>
                      <div className="flex flex-wrap gap-2 md:gap-4 text-xs text-slate-400">
                        <span>伤害: <span className="text-white">{skill.damage}</span></span>
                        <span>CD: <span className="text-white">{skill.cooldown}秒</span></span>
                        {skill.scaling.ad && (
                          <span>AD: <span className="text-orange-400">{(skill.scaling.ad * 100).toFixed(0)}%</span></span>
                        )}
                        {skill.scaling.ap && (
                          <span>AP: <span className="text-purple-400">{(skill.scaling.ap * 100).toFixed(0)}%</span></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Power Spikes */}
              <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  强势期分析
                </h3>
                <div className="mb-3 md:mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
                    selectedHero.strongPhase === 'early' ? 'bg-green-500/20 text-green-400' :
                    selectedHero.strongPhase === 'mid' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    <BarChart3 className="w-4 h-4" />
                    {selectedHero.strongPhase === 'early' && '前期强势'}
                    {selectedHero.strongPhase === 'mid' && '中期强势'}
                    {selectedHero.strongPhase === 'late' && '后期强势'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs md:text-sm text-slate-400 mb-2">关键强势点：</div>
                  {selectedHero.powerSpikes.map((spike, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-white text-sm md:text-base">{spike}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!selectedHero && (
            <div className="lg:col-span-2 flex items-center justify-center bg-slate-900 rounded-xl border border-slate-800 min-h-64 md:min-h-96">
              <div className="text-center">
                <BarChart3 className="w-12 md:w-16 h-12 md:h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 text-sm md:text-base">选择一个英雄查看详细属性</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}