import type { Item } from '../types';

interface ItemCardProps {
  item: Item;
  selected?: boolean;
  onClick?: () => void;
  showPrice?: boolean;
}

export function ItemCard({ item, selected, onClick, showPrice = true }: ItemCardProps) {
  const stats = [];
  if (item.stats.attack) stats.push(`+${item.stats.attack} 攻击力`);
  if (item.stats.ap) stats.push(`+${item.stats.ap} 法术强度`);
  if (item.stats.hp) stats.push(`+${item.stats.hp} 生命值`);
  if (item.stats.armor) stats.push(`+${item.stats.armor} 护甲`);
  if (item.stats.attackSpeed) stats.push(`+${item.stats.attackSpeed}% 攻速`);
  if (item.stats.critChance) stats.push(`+${item.stats.critChance}% 暴击`);
  if (item.stats.lifesteal) stats.push(`+${item.stats.lifesteal}% 吸血`);
  
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all text-left w-full ${
        selected
          ? 'border-yellow-500 bg-yellow-500/10'
          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-white text-sm">{item.name}</h4>
        {showPrice && (
          <span className="text-xs text-yellow-500 font-mono">{item.cost}G</span>
        )}
      </div>
      <div className="space-y-1">
        {stats.map((stat, i) => (
          <p key={i} className="text-xs text-slate-300">{stat}</p>
        ))}
        {item.passive && (
          <p className="text-xs text-blue-400 mt-2 italic">{item.passive}</p>
        )}
      </div>
    </button>
  );
}
