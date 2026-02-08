import type { HeroStats } from '../types';

interface HeroCardProps {
  hero: HeroStats;
  selected?: boolean;
  onClick?: () => void;
}

export function HeroCard({ hero, selected, onClick }: HeroCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all text-left w-full ${
        selected
          ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-4xl">{hero.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-white">{hero.name}</h3>
          <p className="text-sm text-slate-400">{hero.role}</p>
          <div className="flex gap-2 mt-1">
            {hero.strongPhase === 'early' && (
              <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">前期强</span>
            )}
            {hero.strongPhase === 'mid' && (
              <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">中期强</span>
            )}
            {hero.strongPhase === 'late' && (
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">后期强</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
