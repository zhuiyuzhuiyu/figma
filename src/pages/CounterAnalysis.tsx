import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { HeroCard } from '../components/HeroCard';
import { heroes } from '../data/heroes';
import type { HeroStats } from '../types';
import { Shield, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface CounterInfo {
  hero: HeroStats;
  counterLevel: 'hard' | 'moderate' | 'soft';
  reasons: string[];
}

export function CounterAnalysis() {
  const [selectedHero, setSelectedHero] = useState<HeroStats | null>(null);

  const getCounters = (hero: HeroStats): CounterInfo[] => {
    const counters: CounterInfo[] = [];
    
    // 简化的克制关系逻辑
    heroes.forEach(h => {
      if (h.id === hero.id) return;
      
      const reasons: string[] = [];
      let counterLevel: 'hard' | 'moderate' | 'soft' = 'soft';
      
      // 基于英雄特性的克制关系
      if (hero.id === 'yasuo') {
        if (h.id === 'fiora') {
          reasons.push('破绽伤害无视风墙', 'W格挡斩钢闪', '机动性相当');
          counterLevel = 'hard';
        } else if (h.id === 'jax') {
          reasons.push('E闪避亚索普攻', '后期硬度碾压', '跳斩追击');
          counterLevel = 'moderate';
        } else if (h.id === 'darius') {
          reasons.push('外圈Q难以风墙', '血量优势明显', '减速限制移动');
          counterLevel = 'moderate';
        }
      } else if (hero.id === 'fiora') {
        if (h.id === 'darius') {
          reasons.push('外圈伤害难W格挡', 'Q拉开距离', '血量差距较大');
          counterLevel = 'moderate';
        } else if (h.id === 'riven') {
          reasons.push('连招速度快', 'AOE眩晕', '爆发伤害高');
          counterLevel = 'soft';
        }
      } else if (hero.id === 'jax') {
        if (h.id === 'darius') {
          reasons.push('5层被动伤害爆炸', 'Q外圈伤害高', 'E穿甲破坏');
          counterLevel = 'moderate';
        } else if (h.id === 'fiora') {
          reasons.push('破绽真实伤害', 'W格挡反击', '后期1v1无敌');
          counterLevel = 'hard';
        }
      } else if (hero.id === 'riven') {
        if (h.id === 'fiora') {
          reasons.push('W格挡瑞文W眩晕', '破绽伤害', '持续作战能力强');
          counterLevel = 'hard';
        } else if (h.id === 'jax') {
          reasons.push('E闪避普攻', 'R双抗提升', '后期无敌');
          counterLevel = 'moderate';
        }
      } else if (hero.id === 'zed') {
        if (h.id === 'jax') {
          reasons.push('R双抗抵消爆发', 'E闪避大部分伤害', '反手秒杀');
          counterLevel = 'hard';
        } else if (h.id === 'fiora') {
          reasons.push('W格挡大招标记', '机动性相当', '真实伤害');
          counterLevel = 'moderate';
        }
      }
      
      if (reasons.length > 0) {
        counters.push({ hero: h, counterLevel, reasons });
      }
    });
    
    // 按克制强度排序
    return counters.sort((a, b) => {
      const order = { hard: 0, moderate: 1, soft: 2 };
      return order[a.counterLevel] - order[b.counterLevel];
    });
  };

  const getCounteredBy = (hero: HeroStats): CounterInfo[] => {
    const counteredBy: CounterInfo[] = [];
    
    heroes.forEach(h => {
      if (h.id === hero.id) return;
      
      const reasons: string[] = [];
      let counterLevel: 'hard' | 'moderate' | 'soft' = 'soft';
      
      // 反向克制关系
      if (hero.id === 'yasuo') {
        if (h.id === 'darius') {
          reasons.push('亚索E+Q消耗', '风墙挡技能', '机动性碾压');
          counterLevel = 'moderate';
        } else if (h.id === 'riven') {
          reasons.push('爆发秒杀', '先手优势', '连招流畅');
          counterLevel = 'soft';
        }
      } else if (hero.id === 'fiora') {
        if (h.id === 'yasuo') {
          reasons.push('风墙挡Q', 'E灵活走位', '持续消耗');
          counterLevel = 'soft';
        }
      } else if (hero.id === 'jax') {
        if (h.id === 'yasuo') {
          reasons.push('风墙挡Q', 'E快速消耗', '前期压制');
          counterLevel = 'soft';
        }
      } else if (hero.id === 'darius') {
        if (h.id === 'fiora') {
          reasons.push('W格挡拉回', 'Q机动躲Q', '破绽真伤');
          counterLevel = 'hard';
        } else if (h.id === 'yasuo') {
          reasons.push('风墙挡Q', 'E灵活走位', '消耗能力强');
          counterLevel = 'moderate';
        }
      }
      
      if (reasons.length > 0) {
        counteredBy.push({ hero: h, counterLevel, reasons });
      }
    });
    
    return counteredBy.sort((a, b) => {
      const order = { hard: 0, moderate: 1, soft: 2 };
      return order[a.counterLevel] - order[b.counterLevel];
    });
  };

  const counters = selectedHero ? getCounters(selectedHero) : [];
  const counteredBy = selectedHero ? getCounteredBy(selectedHero) : [];

  return (
    <div className="min-h-screen bg-slate-950 pb-20 md:pb-8">
      <Navigation />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">🛡️ 克制关系分析</h1>
          <p className="text-sm md:text-base text-slate-400">分析英雄克制与被克关系</p>
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

          {/* Analysis Results */}
          {selectedHero && (
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Counters (Who counters the selected hero) */}
              <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <AlertTriangle className="w-5 md:w-6 h-5 md:h-6 text-red-400" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">克制 {selectedHero.name} 的英雄</h2>
                </div>
                
                {counters.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {counters.map((counter, i) => (
                      <div
                        key={i}
                        className={`p-3 md:p-4 rounded-lg border-2 ${
                          counter.counterLevel === 'hard'
                            ? 'border-red-500 bg-red-500/10'
                            : counter.counterLevel === 'moderate'
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-yellow-500 bg-yellow-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-2xl md:text-3xl">{counter.hero.icon}</span>
                            <div>
                              <h3 className="font-bold text-white text-sm md:text-base">{counter.hero.name}</h3>
                              <p className="text-xs text-slate-400">{counter.hero.role}</p>
                            </div>
                          </div>
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                              counter.counterLevel === 'hard'
                                ? 'bg-red-500 text-white'
                                : counter.counterLevel === 'moderate'
                                ? 'bg-orange-500 text-white'
                                : 'bg-yellow-500 text-black'
                            }`}
                          >
                            {counter.counterLevel === 'hard' && '强克制'}
                            {counter.counterLevel === 'moderate' && '中等'}
                            {counter.counterLevel === 'soft' && '轻微'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {counter.reasons.map((reason, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <ThumbsDown className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                              <span className="text-xs md:text-sm text-slate-300">{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12 text-slate-500">
                    <Shield className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm md:text-base">暂无明显克制关系数据</p>
                  </div>
                )}
              </div>

              {/* Countered By (Who the selected hero counters) */}
              <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <Shield className="w-5 md:w-6 h-5 md:h-6 text-green-400" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">{selectedHero.name} 克制的英雄</h2>
                </div>
                
                {counteredBy.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {counteredBy.map((counter, i) => (
                      <div
                        key={i}
                        className={`p-3 md:p-4 rounded-lg border-2 ${
                          counter.counterLevel === 'hard'
                            ? 'border-green-500 bg-green-500/10'
                            : counter.counterLevel === 'moderate'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-cyan-500 bg-cyan-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-2xl md:text-3xl">{counter.hero.icon}</span>
                            <div>
                              <h3 className="font-bold text-white text-sm md:text-base">{counter.hero.name}</h3>
                              <p className="text-xs text-slate-400">{counter.hero.role}</p>
                            </div>
                          </div>
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                              counter.counterLevel === 'hard'
                                ? 'bg-green-500 text-white'
                                : counter.counterLevel === 'moderate'
                                ? 'bg-blue-500 text-white'
                                : 'bg-cyan-500 text-black'
                            }`}
                          >
                            {counter.counterLevel === 'hard' && '强优势'}
                            {counter.counterLevel === 'moderate' && '中等'}
                            {counter.counterLevel === 'soft' && '轻微'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {counter.reasons.map((reason, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <ThumbsUp className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-xs md:text-sm text-slate-300">{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12 text-slate-500">
                    <Shield className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm md:text-base">暂无明显克制关系数据</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedHero && (
            <div className="lg:col-span-2 flex items-center justify-center bg-slate-900 rounded-xl border border-slate-800 min-h-64 md:min-h-96">
              <div className="text-center">
                <Shield className="w-12 md:w-16 h-12 md:h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 text-sm md:text-base">选择一个英雄查看克制关系</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}