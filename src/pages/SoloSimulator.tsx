import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { HeroCard } from '../components/HeroCard';
import { ItemCard } from '../components/ItemCard';
import { heroes } from '../data/heroes';
import { items } from '../data/items';
import { simulateCombat, calculateStats } from '../utils/combat';
import type { HeroStats, Item, CombatSettings } from '../types';
import { Zap, Settings, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

export function SoloSimulator() {
  const [hero1, setHero1] = useState<HeroStats | null>(null);
  const [hero2, setHero2] = useState<HeroStats | null>(null);
  const [hero1Items, setHero1Items] = useState<Item[]>([]);
  const [hero2Items, setHero2Items] = useState<Item[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CombatSettings>({
    level: 6,
    firstStrike: 'hero1',
    skillHitRate: 80,
    hasIgnite: true,
    hasFlash: false,
    dodgeRate: 30,
    operationLevel: 'gold',
  });
  const [result, setResult] = useState<any>(null);

  const toggleHero1Item = (item: Item) => {
    if (hero1Items.find(i => i.id === item.id)) {
      setHero1Items(hero1Items.filter(i => i.id !== item.id));
    } else if (hero1Items.length < 6) {
      setHero1Items([...hero1Items, item]);
    }
  };

  const toggleHero2Item = (item: Item) => {
    if (hero2Items.find(i => i.id === item.id)) {
      setHero2Items(hero2Items.filter(i => i.id !== item.id));
    } else if (hero2Items.length < 6) {
      setHero2Items([...hero2Items, item]);
    }
  };

  const runSimulation = () => {
    if (!hero1 || !hero2) return;
    const combatResult = simulateCombat(hero1, hero1Items, hero2, hero2Items, settings);
    setResult(combatResult);
  };

  const hero1Stats = hero1 ? calculateStats(hero1, hero1Items, settings.level) : null;
  const hero2Stats = hero2 ? calculateStats(hero2, hero2Items, settings.level) : null;

  return (
    <div className="min-h-screen bg-slate-950 pb-20 md:pb-8">
      <Navigation />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">⚔️ 1v1 单挑模拟器</h1>
          <p className="text-sm md:text-base text-slate-400">选择英雄、装备组合，预测对战胜率</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
          {/* Hero 1 */}
          <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-red-400">英雄 A</h2>
              {hero1 && (
                <button
                  onClick={() => setHero1(null)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  重新选择
                </button>
              )}
            </div>
            
            {!hero1 ? (
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {heroes.map(h => (
                  <HeroCard key={h.id} hero={h} onClick={() => setHero1(h)} />
                ))}
              </div>
            ) : (
              <div>
                <HeroCard hero={hero1} selected />
                
                {hero1Stats && (
                  <div className="mt-3 md:mt-4 p-3 md:p-4 bg-slate-800 rounded-lg">
                    <h3 className="text-xs md:text-sm font-semibold text-white mb-2">当前属性</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-slate-300">生命: <span className="text-white font-semibold">{Math.round(hero1Stats.hp)}</span></div>
                      <div className="text-slate-300">攻击: <span className="text-white font-semibold">{Math.round(hero1Stats.attack)}</span></div>
                      <div className="text-slate-300">护甲: <span className="text-white font-semibold">{Math.round(hero1Stats.armor)}</span></div>
                      <div className="text-slate-300">魔抗: <span className="text-white font-semibold">{Math.round(hero1Stats.magicResist)}</span></div>
                    </div>
                  </div>
                )}
                
                <div className="mt-3 md:mt-4">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-xs md:text-sm font-semibold text-white">装备 ({hero1Items.length}/6)</h3>
                    {hero1Items.length > 0 && (
                      <button
                        onClick={() => setHero1Items([])}
                        className="text-xs text-slate-500 hover:text-slate-300"
                      >
                        清空
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-64 md:max-h-96 overflow-y-auto">
                    {items.map(item => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        selected={!!hero1Items.find(i => i.id === item.id)}
                        onClick={() => toggleHero1Item(item)}
                        showPrice={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hero 2 */}
          <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-blue-400">英雄 B</h2>
              {hero2 && (
                <button
                  onClick={() => setHero2(null)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  重新选择
                </button>
              )}
            </div>
            
            {!hero2 ? (
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {heroes.map(h => (
                  <HeroCard key={h.id} hero={h} onClick={() => setHero2(h)} />
                ))}
              </div>
            ) : (
              <div>
                <HeroCard hero={hero2} selected />
                
                {hero2Stats && (
                  <div className="mt-3 md:mt-4 p-3 md:p-4 bg-slate-800 rounded-lg">
                    <h3 className="text-xs md:text-sm font-semibold text-white mb-2">当前属性</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-slate-300">生命: <span className="text-white font-semibold">{Math.round(hero2Stats.hp)}</span></div>
                      <div className="text-slate-300">攻击: <span className="text-white font-semibold">{Math.round(hero2Stats.attack)}</span></div>
                      <div className="text-slate-300">护甲: <span className="text-white font-semibold">{Math.round(hero2Stats.armor)}</span></div>
                      <div className="text-slate-300">魔抗: <span className="text-white font-semibold">{Math.round(hero2Stats.magicResist)}</span></div>
                    </div>
                  </div>
                )}
                
                <div className="mt-3 md:mt-4">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-xs md:text-sm font-semibold text-white">装备 ({hero2Items.length}/6)</h3>
                    {hero2Items.length > 0 && (
                      <button
                        onClick={() => setHero2Items([])}
                        className="text-xs text-slate-500 hover:text-slate-300"
                      >
                        清空
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-64 md:max-h-96 overflow-y-auto">
                    {items.map(item => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        selected={!!hero2Items.find(i => i.id === item.id)}
                        onClick={() => toggleHero2Item(item)}
                        showPrice={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        {hero1 && hero2 && (
          <div className="bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800 mb-4 md:mb-8">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center justify-between w-full mb-4 md:hidden"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-white">对战设置</h2>
              </div>
              {showSettings ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            <div className="hidden md:flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-slate-400" />
              <h2 className="text-xl font-bold text-white">对战设置</h2>
            </div>
            
            <div className={`space-y-4 ${showSettings ? 'block' : 'hidden'} md:block`}>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm text-slate-400 mb-2">等级</label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={settings.level}
                    onChange={e => setSettings({ ...settings, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm md:text-base bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-xs md:text-sm text-slate-400 mb-2">先手方</label>
                  <select
                    value={settings.firstStrike}
                    onChange={e => setSettings({ ...settings, firstStrike: e.target.value as 'hero1' | 'hero2' })}
                    className="w-full px-3 py-2 text-sm md:text-base bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="hero1">{hero1.name}</option>
                    <option value="hero2">{hero2.name}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm text-slate-400 mb-2">技能命中率 {settings.skillHitRate}%</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={settings.skillHitRate}
                  onChange={e => setSettings({ ...settings, skillHitRate: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm text-slate-400 mb-2">操作水平</label>
                <select
                  value={settings.operationLevel}
                  onChange={e => setSettings({ ...settings, operationLevel: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm md:text-base bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="bronze">青铜</option>
                  <option value="silver">白银</option>
                  <option value="gold">黄金</option>
                  <option value="platinum">铂金</option>
                  <option value="diamond">钻石</option>
                  <option value="master">大师</option>
                </select>
              </div>
              
              <div className="flex flex-wrap gap-3 md:gap-4">
                <label className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={settings.hasIgnite}
                    onChange={e => setSettings({ ...settings, hasIgnite: e.target.checked })}
                    className="rounded"
                  />
                  携带点燃
                </label>
                <label className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={settings.hasFlash}
                    onChange={e => setSettings({ ...settings, hasFlash: e.target.checked })}
                    className="rounded"
                  />
                  携带闪现
                </label>
              </div>
            </div>
            
            <button
              onClick={runSimulation}
              className="w-full mt-4 md:mt-6 px-4 md:px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Zap className="w-5 h-5" />
              开始模拟对战
            </button>
          </div>
        )}

        {/* Results */}
        {result && hero1 && hero2 && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 md:p-8 border border-slate-700">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <TrendingUp className="w-5 md:w-6 h-5 md:h-6 text-green-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white">模拟结果</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 text-center border border-slate-700">
                <div className="text-xs md:text-sm text-slate-400 mb-2">获胜方</div>
                <div className="text-2xl md:text-3xl font-bold text-green-400">
                  {result.winner === 'hero1' ? hero1.name : hero2.name}
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 text-center border border-slate-700">
                <div className="text-xs md:text-sm text-slate-400 mb-2">胜率</div>
                <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                  {result.winRate.toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 text-center border border-slate-700">
                <div className="text-xs md:text-sm text-slate-400 mb-2">击杀时间</div>
                <div className="text-2xl md:text-3xl font-bold text-blue-400">
                  {result.killTime.toFixed(1)}秒
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-slate-700">
              <div className="text-xs md:text-sm text-slate-400 mb-3">剩余血量</div>
              <div className="flex items-center gap-3 md:gap-4">
                <span className="text-white font-semibold text-sm md:text-base">{result.remainingHpPercent.toFixed(1)}%</span>
                <div className="flex-1 h-3 md:h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-green-500"
                    style={{ width: `${result.remainingHpPercent}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 border border-slate-700 mb-4 md:mb-6">
              <div className="text-xs md:text-sm text-slate-400 mb-3">关键因素</div>
              <div className="space-y-2">
                {result.keyFactors.map((factor: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-white text-xs md:text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
                <div className="text-xs md:text-sm text-slate-400 mb-2">{hero1.name} 总伤害</div>
                <div className="text-xl md:text-2xl font-bold text-red-400">
                  {Math.round(result.damageBreakdown.hero1)}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
                <div className="text-xs md:text-sm text-slate-400 mb-2">{hero2.name} 总伤害</div>
                <div className="text-xl md:text-2xl font-bold text-blue-400">
                  {Math.round(result.damageBreakdown.hero2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}