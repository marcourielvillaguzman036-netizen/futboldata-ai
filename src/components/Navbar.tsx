import React from 'react';
import { Activity, History, Image as ImageIcon, Calculator, Zap, Download } from 'lucide-react';

interface NavbarProps {
  onOpenCapture: () => void;
  onOpenHistory: () => void;
  onOpenStakeCalc: () => void;
  onOpenInstall: () => void;
  onSelectTab: (tab: 'match' | 'h2h') => void;
  activeTab: 'match' | 'h2h';
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCapture,
  onOpenHistory,
  onOpenStakeCalc,
  onOpenInstall,
  onSelectTab,
  activeTab,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onSelectTab('match')}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-black cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="text-xl">⚽</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => onSelectTab('match')}
                className="font-extrabold text-slate-100 tracking-tight text-lg cursor-pointer"
              >
                Futbol<span className="text-emerald-400">Data</span> AI
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                2026 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Experto en Apuestas Deportivas & Big Data Cuantitativo
            </p>
          </div>
        </div>

        {/* Unconstrained Mode Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
          <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Investigación Ilimitada • Sin Límites de Consultas</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Head to Head Quick Button */}
          <button
            onClick={() => onSelectTab(activeTab === 'h2h' ? 'match' : 'h2h')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'h2h'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600'
            }`}
          >
            <span className="text-sm">⚔️</span>
            <span className="hidden sm:inline">Head-to-Head</span>
            <span className="sm:hidden">H2H</span>
          </button>

          {/* Analizar Captura Button */}
          <button
            onClick={onOpenCapture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Analizar Captura</span>
            <span className="sm:hidden">Captura</span>
          </button>

          {/* Stake Calculator */}
          <button
            onClick={onOpenStakeCalc}
            title="Calculadora de Stake y Bankroll"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Calculadora</span>
          </button>

          {/* Historial */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Historial</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Instalar App */}
          <button
            onClick={onOpenInstall}
            title="Instalar aplicación en tu móvil o PC"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Instalar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
