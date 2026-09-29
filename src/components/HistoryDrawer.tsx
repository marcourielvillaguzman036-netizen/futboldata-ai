import React from 'react';
import { History, X, Trash2, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { MatchAnalysis } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: MatchAnalysis[];
  onSelectMatch: (match: MatchAnalysis) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectMatch,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Historial de Partidos</h3>
              <p className="text-xs text-slate-400">{history.length} análisis guardados</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title="Borrar historial"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500 mb-3">
                <Trophy className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">Aún no hay análisis guardados</p>
              <p className="text-xs text-slate-500 mt-1">
                Escribe un partido o sube una captura para generar tu primer pronóstico con Big Data.
              </p>
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  onSelectMatch(item);
                  onClose();
                }}
                className="group p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 transition-all cursor-pointer space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {item.competicion_o_liga || 'Fútbol'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.analyzedAt ? new Date(item.analyzedAt).toLocaleDateString() : 'Reciente'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {item.partido_formateado || `${item.equipo_local} vs ${item.equipo_visitante}`}
                  </h4>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>Marcador: <strong className="text-slate-200">{item.marcador_probable}</strong></span>
                  <span>•</span>
                  <span>Ambos: <strong className={item.ambos_anotan_veredicto === 'SÍ' ? 'text-emerald-400' : 'text-amber-400'}>{item.ambos_anotan_veredicto}</strong></span>
                  {item.sourceType === 'capture' && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 flex items-center gap-1 font-sans">
                      <Sparkles className="w-2.5 h-2.5" /> Captura
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
