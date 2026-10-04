import React, { useState } from 'react';
import { Flame, Globe, Sparkles } from 'lucide-react';
import { QuickMatch } from '../types';

interface QuickMatchesBarProps {
  matches: QuickMatch[];
  onSelectMatch: (matchString: string) => void;
  isLoading: boolean;
}

export const QuickMatchesBar: React.FC<QuickMatchesBarProps> = ({
  matches,
  onSelectMatch,
  isLoading,
}) => {
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState<string>('all');

  if (!matches || matches.length === 0) return null;

  const leagueCategories = [
    { id: 'all', label: '🌍 Todas las Ligas' },
    { id: 'femenil', label: '⚽ Femenil Top' },
    { id: 'champions', label: '🏆 Champions' },
    { id: 'premier', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier' },
    { id: 'laliga', label: '🇪🇸 LaLiga' },
    { id: 'seriea', label: '🇮🇹 Serie A' },
    { id: 'bundesliga', label: '🇩🇪 Bundesliga' },
    { id: 'americas', label: '🌎 América / MX' },
  ];

  const filteredMatches = matches.filter((m) => {
    if (selectedLeagueFilter === 'all') return true;
    const text = (m.liga + ' ' + m.badge + ' ' + m.partido).toLowerCase();
    if (selectedLeagueFilter === 'femenil') return text.includes('femenil') || text.includes('women') || text.includes('femenino');
    if (selectedLeagueFilter === 'champions') return text.includes('champions') || text.includes('europa');
    if (selectedLeagueFilter === 'premier') return text.includes('premier') || text.includes('liverpool') || text.includes('arsenal') || text.includes('city') || text.includes('chelsea');
    if (selectedLeagueFilter === 'laliga') return text.includes('laliga') || text.includes('madrid') || text.includes('barcelona');
    if (selectedLeagueFilter === 'seriea') return text.includes('serie a') || text.includes('inter') || text.includes('juventus') || text.includes('milan');
    if (selectedLeagueFilter === 'bundesliga') return text.includes('bundesliga') || text.includes('bayern') || text.includes('leipzig');
    if (selectedLeagueFilter === 'americas') return text.includes('boca') || text.includes('river') || text.includes('flamengo') || text.includes('américa') || text.includes('chivas') || text.includes('mls') || text.includes('libertadores');
    return true;
  });

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-400">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Explorador Global Sin Límites (Cualquier Liga o País):</span>
        </div>

        {/* League quick filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {leagueCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedLeagueFilter(cat.id)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                selectedLeagueFilter === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredMatches.map((item, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => onSelectMatch(item.partido)}
            className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-slate-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10">
              {item.badge}
            </span>
            <span className="font-medium">{item.partido}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

