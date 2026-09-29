import React, { useState } from 'react';
import { Calculator, X, DollarSign, Percent, TrendingUp, ShieldCheck } from 'lucide-react';

interface StakeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOdds?: string;
}

export const StakeCalculatorModal: React.FC<StakeCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultOdds = '1.85',
}) => {
  const [bankroll, setBankroll] = useState<number>(100);
  const [odds, setOdds] = useState<string>(defaultOdds);
  const [stakePercentage, setStakePercentage] = useState<number>(3); // 3% typical stake
  const [winProbability, setWinProbability] = useState<number>(60);

  if (!isOpen) return null;

  const parsedOdds = parseFloat(odds) || 1.0;
  const stakeAmount = (bankroll * stakePercentage) / 100;
  const totalReturn = stakeAmount * parsedOdds;
  const netProfit = totalReturn - stakeAmount;

  // Kelly Criterion: f* = (bp - q) / b
  // b = odds - 1
  // p = winProbability / 100
  // q = 1 - p
  const b = parsedOdds - 1;
  const p = winProbability / 100;
  const q = 1 - p;
  const kellyRaw = b > 0 ? (b * p - q) / b : 0;
  // Fractional Kelly (Half Kelly) for bankroll safety
  const recommendedKelly = Math.max(0, Math.min(10, Math.round(kellyRaw * 50 * 10) / 10));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Calculadora de Stake & Bankroll</h3>
              <p className="text-xs text-slate-400">Gestión de riesgo y cálculo de ganancias potenciales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Bankroll */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Tu Bankroll ($ o €)
              </label>
              <input
                type="number"
                min="1"
                step="5"
                value={bankroll}
                onChange={(e) => setBankroll(Math.max(1, Number(e.target.value) || 0))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Cuota Decimal
              </label>
              <input
                type="number"
                step="0.05"
                min="1.01"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Stake Percentage Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                Porcentaje de Stake a Apostar
              </label>
              <span className="text-xs font-bold font-mono text-emerald-400">{stakePercentage}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={stakePercentage}
              onChange={(e) => setStakePercentage(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>0.5% (Conservador)</span>
              <span>3% (Recomendado)</span>
              <span>10% (Agresivo)</span>
            </div>
          </div>

          {/* Probability estimated */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Probabilidad estimada de acierto
              </label>
              <span className="text-xs font-bold font-mono text-cyan-400">{winProbability}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="1"
              value={winProbability}
              onChange={(e) => setWinProbability(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Result Cards */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Importe a apostar:</span>
              <span className="font-mono font-bold text-slate-100">
                ${stakeAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Retorno Bruto:</span>
              <span className="font-mono font-bold text-slate-100">
                ${totalReturn.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-800">
              <span className="text-emerald-400 font-semibold">Beneficio Neto:</span>
              <span className="font-mono font-extrabold text-base text-emerald-400">
                +${netProfit.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Kelly advice */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <span className="font-semibold block text-emerald-200">
                Cálculo de Criterio de Kelly (Gestión Prudente):
              </span>
              Con una probabilidad de {winProbability}% y cuota {parsedOdds}, la asignación matemática recomendada es del <strong className="font-bold underline">{recommendedKelly}%</strong> de tu bank (${((bankroll * recommendedKelly) / 100).toFixed(2)}).
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
