import React, { useState } from 'react';
import { PieChart, BarChart2, Layers, TrendingUp, Target, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProbabilityDistributionChartProps {
  localTeam: string;
  visitorTeam: string;
  probLocal: number;
  probEmpate: number;
  probVisitante: number;
  marcadorProbable: string;
  over05?: number;
  over15?: number;
  over25?: number;
  over35?: number;
  over45?: number;
  btts?: number;
  totalGolesEsperados?: string;
}

export const ProbabilityDistributionChart: React.FC<ProbabilityDistributionChartProps> = ({
  localTeam,
  visitorTeam,
  probLocal,
  probEmpate,
  probVisitante,
  marcadorProbable,
  over05,
  over15,
  over25,
  over35,
  over45,
  btts = 50,
  totalGolesEsperados,
}) => {
  const [chartMode, setChartMode] = useState<'donut' | 'bars' | 'both'>('both');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Dynamic Poisson computation if not explicitly provided
  const parsedXG = parseFloat((totalGolesEsperados || '').replace(/[^\d.]/g, '')) || 2.50;
  const calcPoisson = (lambda: number, k: number) => {
    let pAccum = 0;
    let term = Math.exp(-lambda);
    pAccum += term;
    for (let i = 1; i <= k; i++) {
      term = (term * lambda) / i;
      pAccum += term;
    }
    return Math.round(Math.min(99, Math.max(5, (1 - pAccum) * 100)));
  };

  const effOver05 = over05 ?? calcPoisson(parsedXG, 0);
  const effOver15 = over15 ?? calcPoisson(parsedXG, 1);
  const effOver25 = over25 ?? calcPoisson(parsedXG, 2);
  const effOver35 = over35 ?? calcPoisson(parsedXG, 3);
  const effOver45 = over45 ?? calcPoisson(parsedXG, 4);

  // Normalize 1X2 to sum 100 for SVG geometry
  const totalProb = Math.max(1, probLocal + probEmpate + probVisitante);
  const pL = (probLocal / totalProb) * 100;
  const pE = (probEmpate / totalProb) * 100;
  const pV = (probVisitante / totalProb) * 100;

  // Implied odds calculation
  const oddsL = pL > 0 ? (100 / pL).toFixed(2) : '-';
  const oddsE = pE > 0 ? (100 / pE).toFixed(2) : '-';
  const oddsV = pV > 0 ? (100 / pV).toFixed(2) : '-';

  // SVG Donut calculation constants
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Stroke offsets for 3 segments
  const offsetL = 0;
  const lengthL = (pL / 100) * circumference;

  const offsetE = -lengthL;
  const lengthE = (pE / 100) * circumference;

  const offsetV = -(lengthL + lengthE);
  const lengthV = (pV / 100) * circumference;

  // Over / Under goals data
  const effUnder25 = Math.max(0, 100 - effOver25);
  const goalBars = [
    { label: 'Over 0.5 Goles', pct: effOver05, color: 'from-emerald-500 to-emerald-400', badge: 'Alta Certeza' },
    { label: 'Over 1.5 Goles', pct: effOver15, color: 'from-emerald-500 to-teal-400', badge: 'Muy Probable' },
    { label: 'Over 2.5 Goles', pct: effOver25, color: 'from-cyan-500 to-blue-400', badge: effOver25 >= 50 ? 'Línea de Valor' : 'Moderado' },
    { label: 'Under 2.5 Goles', pct: effUnder25, color: 'from-slate-500 to-slate-400', badge: effUnder25 >= 50 ? 'Línea de Valor' : 'Menor Prob.' },
    { label: 'Over 3.5 Goles', pct: effOver35, color: 'from-amber-500 to-amber-400', badge: 'Cuota Alta' },
    { label: 'Ambos Marcan (BTTS)', pct: btts, color: 'from-purple-500 to-indigo-400', badge: btts >= 50 ? 'Recomendado' : 'Dividido' },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/90 hover:border-slate-700/80 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl relative overflow-hidden backdrop-blur-sm transition-all">
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Header with Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-100 flex items-center gap-2 tracking-tight">
              Data Visualization: Distribución de Probabilidades
            </h3>
            <p className="text-[11px] text-slate-400">
              Modelos predictivos en tiempo real • Resultado 1X2 y Líneas Over/Under
            </p>
          </div>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs self-start sm:self-auto gap-1">
          <button
            type="button"
            onClick={() => setChartMode('both')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              chartMode === 'both'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dashboard</span> Completo
          </button>
          <button
            type="button"
            onClick={() => setChartMode('donut')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              chartMode === 'donut'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            1X2 Pastel
          </button>
          <button
            type="button"
            onClick={() => setChartMode('bars')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              chartMode === 'bars'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Over / Under
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`grid gap-5 items-center ${
          chartMode === 'both'
            ? 'grid-cols-1 lg:grid-cols-12'
            : chartMode === 'donut'
            ? 'grid-cols-1 md:grid-cols-12'
            : 'grid-cols-1'
        }`}
      >
        {/* PIE / DONUT CHART SECTION (1X2) */}
        {(chartMode === 'donut' || chartMode === 'both') && (
          <div
            className={`flex flex-col sm:flex-row items-center justify-around gap-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 ${
              chartMode === 'both' ? 'lg:col-span-5' : 'md:col-span-12'
            }`}
          >
            {/* SVG Interactive Donut */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth={strokeWidth}
                />

                {/* Local Segment (Emerald) */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth={hoveredSlice === 'local' ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${lengthL} ${circumference}`}
                  strokeDashoffset={offsetL}
                  className="transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('local')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />

                {/* Draw Segment (Slate) */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#64748b"
                  strokeWidth={hoveredSlice === 'empate' ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${lengthE} ${circumference}`}
                  strokeDashoffset={offsetE}
                  className="transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('empate')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />

                {/* Visitor Segment (Cyan) */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth={hoveredSlice === 'visitante' ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${lengthV} ${circumference}`}
                  strokeDashoffset={offsetV}
                  className="transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('visitante')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              </svg>

              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {hoveredSlice === 'local'
                    ? localTeam
                    : hoveredSlice === 'empate'
                    ? 'Empate'
                    : hoveredSlice === 'visitante'
                    ? visitorTeam
                    : 'Marcador'}
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-100 tracking-tight">
                  {hoveredSlice === 'local'
                    ? `${probLocal}%`
                    : hoveredSlice === 'empate'
                    ? `${probEmpate}%`
                    : hoveredSlice === 'visitante'
                    ? `${probVisitante}%`
                    : marcadorProbable}
                </span>
                <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-widest mt-0.5">
                  {hoveredSlice ? 'Prob. 1X2' : 'Top Probable'}
                </span>
              </div>
            </div>

            {/* Legend with Team Stats and Implied Odds */}
            <div className="space-y-2.5 w-full sm:w-auto text-xs">
              {/* Local */}
              <div
                onMouseEnter={() => setHoveredSlice('local')}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  hoveredSlice === 'local'
                    ? 'bg-emerald-500/20 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 font-bold text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="max-w-[120px] truncate">{localTeam}</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-black text-emerald-400">{probLocal}%</span>
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      @{oddsL}
                    </span>
                  </div>
                </div>
              </div>

              {/* Empate */}
              <div
                onMouseEnter={() => setHoveredSlice('empate')}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  hoveredSlice === 'empate'
                    ? 'bg-slate-700/30 border-slate-500 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 font-bold text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span>Empate (X)</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-black text-slate-300">{probEmpate}%</span>
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      @{oddsE}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visitante */}
              <div
                onMouseEnter={() => setHoveredSlice('visitante')}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  hoveredSlice === 'visitante'
                    ? 'bg-cyan-500/20 border-cyan-500/60 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 font-bold text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    <span className="max-w-[120px] truncate">{visitorTeam}</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-black text-cyan-400">{probVisitante}%</span>
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      @{oddsV}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BAR CHART SECTION (OVER / UNDER & BTTS) */}
        {(chartMode === 'bars' || chartMode === 'both') && (
          <div
            className={`space-y-2.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 ${
              chartMode === 'both' ? 'lg:col-span-7' : 'w-full'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-1 border-b border-slate-800/70">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                Curva de Probabilidad de Goles & BTTS
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {totalGolesEsperados ? `xG Est: ${totalGolesEsperados}` : 'Media Proyectada'}
              </span>
            </div>

            {/* Bars List */}
            <div className="space-y-2 pt-1">
              {goalBars.map((bar, idx) => (
                <div key={idx} className="group space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-slate-300 group-hover:text-slate-100 transition-colors flex items-center gap-1.5">
                      {bar.label}
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 font-normal">
                        {bar.badge}
                      </span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {bar.pct}%
                    </span>
                  </div>

                  {/* Horizontal Bar with 50% Threshold Guide */}
                  <div className="relative w-full h-3 rounded-full bg-slate-900 border border-slate-800/80 overflow-hidden">
                    {/* 50% reference tick */}
                    <div
                      className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-700/60 z-10 pointer-events-none"
                      title="Umbral del 50%"
                    />
                    <div
                      style={{ width: `${bar.pct}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${bar.color} transition-all duration-700`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Footer Indicator */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                Línea central = 50% de probabilidad
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {effOver25 >= 50 ? 'Tendencia a partido abierto' : 'Tendencia a partido cerrado'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
