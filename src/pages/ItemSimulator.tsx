import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { HeroCard } from '../components/HeroCard';
import { ItemCard } from '../components/ItemCard';
import { heroes } from '../data/heroes';
import { items } from '../data/items';
import { calculateStats, calculateDPS, calculateBurstDamage, calculateEffectiveHP } from '../utils/combat';
import type { HeroStats, Item } from '../types';
import { Package, TrendingUp } from 'lucide-react';

export function ItemSimulator() {
  const [selectedHero, setSelectedHero] = useState<HeroStats | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [level, setLevel] = useState(11);
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState<Item[]>([]);

  const toggleItem = (item: Item, isCompare = false) => {
    const itemList = isCompare ? compareItems : selectedItems;
    const setItemList = isCompare ? setCompareItems : setSelectedItems;
    
    if (itemList.find(i => i.id === item.id)) {
      setItemList(itemList.filter(i => i.id !== item.id));
    } else if (itemList.length < 6) {
      setItemList([...itemList, item]);
    }
  };

  const stats1 = selectedHero ? calculateStats(selectedHero, selectedItems, level) : null;
  const stats2 = selectedHero && compareMode ? calculateStats(selectedHero, compareItems, level) : null;

  const dps1 = stats1 ? calculateDPS(stats1, 80) : 0; // 假设目标80护甲
  const dps2 = stats2 ? calculateDPS(stats2, 80) : 0;

  const burst1 = selectedHero && stats1 ? calculateBurstDamage(selectedHero, stats1, level, 80, 50) : 0;
  const burst2 = selectedHero && stats2 ? calculateBurstDamage(selectedHero, stats2, level, 80, 50) : 0;

  const ehp1 = stats1 ? calculateEffectiveHP(stats1.hp, stats1.armor, stats1.magicResist) : 0;
  const ehp2 = stats2 ? calculateEffectiveHP(stats2.hp, stats2.armor, stats2.magicResist) : 0;

  const totalCost1 = selectedItems.reduce((sum, item) => sum + item.cost, 0);
  const totalCost2 = compareItems.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="min-h-screen bg-slate-950 pb-20 md:pb-8">
      <Navigation />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">📦 装备组合模拟</h1>
          <p className="text-sm md:text-base text-slate-400">测试不同装备组合的实际效果</p>
        </div>

        {/* Hero Selection */}
        {!selectedHero ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">选择英雄</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {heroes.map(hero => (
                  <HeroCard key={hero.id} hero={hero} onClick={() => setSelectedHero(hero)} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Hero Info & Settings */}
            <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-3xl md:text-5xl">{selectedHero.icon}</span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{selectedHero.name}</h2>
                    <p className="text-xs md:text-sm text-slate-400">{selectedHero.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedHero(null);
                    setSelectedItems([]);
                    setCompareItems([]);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  重选
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
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
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-xs md:text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compareMode}
                      onChange={e => setCompareMode(e.target.checked)}
                      className="rounded"
                    />
                    对比两套装备
                  </label>
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-1 ${compareMode ? 'lg:grid-cols-2' : ''} gap-4 md:gap-6`}>
              {/* Build 1 */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      {compareMode ? '方案 A' : '装备配置'}
                    </h3>
                    {selectedItems.length > 0 && (
                      <button
                        onClick={() => setSelectedItems([])}
                        className="text-xs text-slate-500 hover:text-slate-300"
                      >
                        清空
                      </button>
                    )}
                  </div>

                  <div className="mb-3 md:mb-4 p-3 bg-slate-800 rounded-lg">
                    <div className="text-xs md:text-sm text-slate-400">总价值</div>
                    <div className="text-xl md:text-2xl font-bold text-yellow-400">{totalCost1} 金币</div>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <div className="text-xs md:text-sm text-slate-400 mb-2">已选 ({selectedItems.length}/6)</div>
                    {selectedItems.length > 0 ? (
                      <div className="space-y-2">
                        {selectedItems.map(item => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            selected
                            onClick={() => toggleItem(item)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 md:py-8 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg text-xs md:text-sm">
                        选择装备
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-64 md:max-h-96 overflow-y-auto">
                    {items.map(item => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        selected={!!selectedItems.find(i => i.id === item.id)}
                        onClick={() => toggleItem(item)}
                      />
                    ))}
                  </div>
                </div>

                {/* Stats 1 */}
                {stats1 && (
                  <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
                    <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-green-400" />
                      属性与伤害
                    </h3>
                    
                    <div className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <div className="bg-slate-800 rounded-lg p-2 md:p-3">
                          <div className="text-xs text-slate-400">生命</div>
                          <div className="text-base md:text-lg font-bold text-red-400">{Math.round(stats1.hp)}</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-2 md:p-3">
                          <div className="text-xs text-slate-400">攻击</div>
                          <div className="text-base md:text-lg font-bold text-orange-400">{Math.round(stats1.attack)}</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-2 md:p-3">
                          <div className="text-xs text-slate-400">护甲</div>
                          <div className="text-base md:text-lg font-bold text-yellow-400">{Math.round(stats1.armor)}</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-2 md:p-3">
                          <div className="text-xs text-slate-400">攻速</div>
                          <div className="text-base md:text-lg font-bold text-green-400">{stats1.attackSpeed.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="border-t border-slate-700 pt-3 md:pt-4">
                        <div className="space-y-2 md:space-y-3">
                          <div className="bg-purple-500/10 rounded-lg p-2 md:p-3 border border-purple-500/30">
                            <div className="text-xs md:text-sm text-purple-300 mb-1">持续DPS</div>
                            <div className="text-xl md:text-2xl font-bold text-purple-400">{Math.round(dps1)}</div>
                            <div className="text-xs text-slate-500">每秒伤害</div>
                          </div>

                          <div className="bg-red-500/10 rounded-lg p-2 md:p-3 border border-red-500/30">
                            <div className="text-xs md:text-sm text-red-300 mb-1">爆发伤害</div>
                            <div className="text-xl md:text-2xl font-bold text-red-400">{Math.round(burst1)}</div>
                            <div className="text-xs text-slate-500">技能+普攻</div>
                          </div>

                          <div className="bg-blue-500/10 rounded-lg p-2 md:p-3 border border-blue-500/30">
                            <div className="text-xs md:text-sm text-blue-300 mb-1">有效生命</div>
                            <div className="text-xl md:text-2xl font-bold text-blue-400">{Math.round(ehp1)}</div>
                            <div className="text-xs text-slate-500">考虑双抗</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Build 2 (Compare Mode) */}
              {compareMode && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <h3 className="text-lg md:text-xl font-bold text-white">方案 B</h3>
                      {compareItems.length > 0 && (
                        <button
                          onClick={() => setCompareItems([])}
                          className="text-xs text-slate-500 hover:text-slate-300"
                        >
                          清空
                        </button>
                      )}
                    </div>

                    <div className="mb-3 md:mb-4 p-3 bg-slate-800 rounded-lg">
                      <div className="text-xs md:text-sm text-slate-400">总价值</div>
                      <div className="text-xl md:text-2xl font-bold text-yellow-400">{totalCost2} 金币</div>
                    </div>

                    <div className="mb-3 md:mb-4">
                      <div className="text-xs md:text-sm text-slate-400 mb-2">已选 ({compareItems.length}/6)</div>
                      {compareItems.length > 0 ? (
                        <div className="space-y-2">
                          {compareItems.map(item => (
                            <ItemCard
                              key={item.id}
                              item={item}
                              selected
                              onClick={() => toggleItem(item, true)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 md:py-8 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg text-xs md:text-sm">
                          选择装备
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-64 md:max-h-96 overflow-y-auto">
                      {items.map(item => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          selected={!!compareItems.find(i => i.id === item.id)}
                          onClick={() => toggleItem(item, true)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stats 2 */}
                  {stats2 && (
                    <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
                      <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-green-400" />
                        属性与伤害
                      </h3>
                      
                      <div className="space-y-3 md:space-y-4">
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                          <div className="bg-slate-800 rounded-lg p-2 md:p-3">
                            <div className="text-xs text-slate-400">生命</div>
                            <div className="text-base md:text-lg font-bold text-red-400">{Math.round(stats2.hp)}</div>
                          </div>
                          <div className="bg-slate-800 rounded-lg p-2 md:p-3">
                            <div className="text-xs text-slate-400">攻击</div>
                            <div className="text-base md:text-lg font-bold text-orange-400">{Math.round(stats2.attack)}</div>
                          </div>
                          <div className="bg-slate-800 rounded-lg p-2 md:p-3">
                            <div className="text-xs text-slate-400">护甲</div>
                            <div className="text-base md:text-lg font-bold text-yellow-400">{Math.round(stats2.armor)}</div>
                          </div>
                          <div className="bg-slate-800 rounded-lg p-2 md:p-3">
                            <div className="text-xs text-slate-400">攻速</div>
                            <div className="text-base md:text-lg font-bold text-green-400">{stats2.attackSpeed.toFixed(2)}</div>
                          </div>
                        </div>

                        <div className="border-t border-slate-700 pt-3 md:pt-4">
                          <div className="space-y-2 md:space-y-3">
                            <div className="bg-purple-500/10 rounded-lg p-2 md:p-3 border border-purple-500/30">
                              <div className="text-xs md:text-sm text-purple-300 mb-1">持续DPS</div>
                              <div className="text-xl md:text-2xl font-bold text-purple-400">{Math.round(dps2)}</div>
                              <div className="text-xs text-slate-500">每秒伤害</div>
                            </div>

                            <div className="bg-red-500/10 rounded-lg p-2 md:p-3 border border-red-500/30">
                              <div className="text-xs md:text-sm text-red-300 mb-1">爆发伤害</div>
                              <div className="text-xl md:text-2xl font-bold text-red-400">{Math.round(burst2)}</div>
                              <div className="text-xs text-slate-500">技能+普攻</div>
                            </div>

                            <div className="bg-blue-500/10 rounded-lg p-2 md:p-3 border border-blue-500/30">
                              <div className="text-xs md:text-sm text-blue-300 mb-1">有效生命</div>
                              <div className="text-xl md:text-2xl font-bold text-blue-400">{Math.round(ehp2)}</div>
                              <div className="text-xs text-slate-500">考虑双抗</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comparison Results */}
            {compareMode && stats1 && stats2 && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 text-center">📊 方案对比</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
                    <div className="text-xs md:text-sm text-slate-400 text-center mb-2">DPS差异</div>
                    <div className={`text-xl md:text-2xl font-bold text-center ${dps1 > dps2 ? 'text-green-400' : dps1 < dps2 ? 'text-red-400' : 'text-slate-400'}`}>
                      {dps1 > dps2 ? '+' : ''}{Math.round(dps1 - dps2)}
                    </div>
                    <div className="text-xs text-slate-500 text-center mt-1">
                      A {dps1 > dps2 ? '更高' : dps1 < dps2 ? '更低' : '相同'}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
                    <div className="text-xs md:text-sm text-slate-400 text-center mb-2">爆发差异</div>
                    <div className={`text-xl md:text-2xl font-bold text-center ${burst1 > burst2 ? 'text-green-400' : burst1 < burst2 ? 'text-red-400' : 'text-slate-400'}`}>
                      {burst1 > burst2 ? '+' : ''}{Math.round(burst1 - burst2)}
                    </div>
                    <div className="text-xs text-slate-500 text-center mt-1">
                      A {burst1 > burst2 ? '更高' : burst1 < burst2 ? '更低' : '相同'}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
                    <div className="text-xs md:text-sm text-slate-400 text-center mb-2">生存能力</div>
                    <div className={`text-xl md:text-2xl font-bold text-center ${ehp1 > ehp2 ? 'text-green-400' : ehp1 < ehp2 ? 'text-red-400' : 'text-slate-400'}`}>
                      {ehp1 > ehp2 ? '+' : ''}{Math.round(ehp1 - ehp2)}
                    </div>
                    <div className="text-xs text-slate-500 text-center mt-1">
                      A {ehp1 > ehp2 ? '更强' : ehp1 < ehp2 ? '更弱' : '相同'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                  <div className="text-xs md:text-sm font-semibold text-white mb-2">💡 推荐建议</div>
                  <p className="text-xs md:text-sm text-slate-300">
                    {dps1 > dps2 && burst1 > burst2 ? '方案A 在持续输出和爆发伤害上都更优秀' :
                     dps2 > dps1 && burst2 > burst1 ? '方案B 在持续输出和爆发伤害上都更优秀' :
                     dps1 > dps2 ? '方案A 持续输出更高，适合拉扯战' :
                     burst1 > burst2 ? '方案A 爆发更高，适合瞬间秒杀' :
                     ehp1 > ehp2 ? '方案A 生存能力更强，适合团战' :
                     '两套方案各有千秋，根据对局情况选择'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}