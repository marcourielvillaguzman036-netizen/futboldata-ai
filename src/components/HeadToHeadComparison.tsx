import React, { useState } from 'react';
import {
  Swords,
  ArrowRightLeft,
  Sparkles,
  Trophy,
  Shield,
  Activity,
  Zap,
  Target,
  Flame,
  Copy,
  Check,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Calendar,
  Users,
  Compass,
} from 'lucide-react';
import { HeadToHeadData } from '../types';

interface HeadToHeadComparisonProps {
  onAnalyzeAsMatch?: (matchString: string) => void;
  onOpenStakeCalculator?: (odds?: string) => void;
}

const PRESET_MATCHUPS = [
  { teamA: 'Real Madrid', teamB: 'Manchester City', competition: 'UEFA Champions League', badge: 'Champions' },
  { teamA: 'Barcelona', teamB: 'Real Madrid', competition: 'LaLiga EA Sports', badge: 'El Clásico' },
  { teamA: 'Arsenal', teamB: 'Liverpool', competition: 'Premier League', badge: 'Premier' },
  { teamA: 'Bayern Múnich', teamB: 'Borussia Dortmund', competition: 'Bundesliga', badge: 'Der Klassiker' },
  { teamA: 'Inter de Milán', teamB: 'Juventus', competition: 'Serie A', badge: 'Derby d\'Italia' },
  { teamA: 'Boca Juniors', teamB: 'River Plate', competition: 'Copa Libertadores', badge: 'Superclásico' },
];

export const HeadToHeadComparison: React.FC<HeadToHeadComparisonProps> = ({
  onAnalyzeAsMatch,
  onOpenStakeCalculator,
}) => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [competition, setCompetition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [h2hResult, setH2hResult] = useState<HeadToHeadData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSwap = () => {
    const temp = teamA;
    setTeamA(teamB);
    setTeamB(temp);
  };

  const handleSelectPreset = (preset: typeof PRESET_MATCHUPS[0]) => {
    setTeamA(preset.teamA);
    setTeamB(preset.teamB);
    setCompetition(preset.competition);
    runComparison(preset.teamA, preset.teamB, preset.competition);
  };

  const runComparison = async (overrideA?: string, overrideB?: string, overrideComp?: string) => {
    const targetA = (overrideA || teamA).trim();
    const targetB = (overrideB || teamB).trim();
    const targetComp = (overrideComp !== undefined ? overrideComp : competition).trim();

    if (!targetA || !targetB) {
      setError('Por favor, ingresa los nombres de ambos equipos para generar la comparativa.');
      return;
    }

    if (targetA.toLowerCase() === targetB.toLowerCase()) {
      setError('Debes ingresar dos equipos diferentes para la comparativa.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-head-to-head', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamA: targetA,
          teamB: targetB,
          competition: targetComp || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error en el servidor (${response.status})`);
      }

      const data: HeadToHeadData = await response.json();
      data.analyzedAt = new Date().toISOString();
      setH2hResult(data);
    } catch (err: any) {
      console.error('Error al realizar comparativa Head-to-Head:', err);
      let friendlyError = 'Hubo un error al generar la comparativa con la IA.';
      const msg = err?.message || String(err);
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        friendlyError = 'Límite de consultas a la IA alcanzado temporalmente. Por favor espera unos momentos y vuelve a intentarlo.';
      } else if (msg) {
        friendlyError = msg;
      }
      setError(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!h2hResult) return;
    const text = `⚔️ *HEAD-TO-HEAD (CARA A CARA) - BIG DATA 2026*
🏟️ *${h2hResult.teamA}* vs *${h2hResult.teamB}*
🏆 *Competición:* ${h2hResult.competition || 'Fútbol de Élite'} (${h2hResult.rivalryName})

📊 *Historial Directo:*
• Victorias ${h2hResult.teamA}: ${h2hResult.historicalH2H.victoriasTeamA}
• Empates: ${h2hResult.historicalH2H.empates}
• Victorias ${h2hResult.teamB}: ${h2hResult.historicalH2H.victoriasTeamB}
• Promedio de Goles en H2H: ${h2hResult.historicalH2H.promedioGolesH2H}
• Ambos Anotan en H2H: ${h2hResult.historicalH2H.ambosAnotanPorcentajeH2H}%

🎯 *Probabilidades Estimadas:*
• ${h2hResult.teamA}: ${h2hResult.veredictoH2H.probabilidadA}%
• Empate: ${h2hResult.veredictoH2H.probabilidadEmpate}%
• ${h2hResult.teamB}: ${h2hResult.veredictoH2H.probabilidadB}%
• Marcador Estimado: ${h2hResult.veredictoH2H.marcadorEstimado}

🧠 *Veredicto:* ${h2hResult.veredictoH2H.analisisFinal}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const renderFormBadge = (formChar: string, index: number) => {
    const char = formChar.trim().toUpperCase();
    let bg = 'bg-slate-700 text-slate-300';
    let label = 'E';
    if (char === 'W' || char === 'V') {
      bg = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      label = 'V';
    } else if (char === 'D' || char === 'E') {
      bg = 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
      label = 'E';
    } else if (char === 'L' || char === 'D') {
      bg = 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
      label = 'D';
    }
    return (
      <span
        key={index}
        className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${bg}`}
      >
        {label}
      </span>
    );
  };

  const renderComparisonBar = (
    label: string,
    valA: number,
    valB: number,
    format: 'num' | 'percent' = 'num',
    lowerIsBetter = false
  ) => {
    const total = valA + valB || 1;
    const pctA = Math.max(10, Math.min(90, Math.round((valA / total) * 100)));
    const pctB = 100 - pctA;

    const isALeading = lowerIsBetter ? valA < valB : valA > valB;
    const isBLeading = lowerIsBetter ? valB < valA : valB > valA;

    return (
      <div className="space-y-1.5 py-2 border-b border-slate-800/60 last:border-none">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-cyan-400">
            {isALeading && <span className="text-[10px] text-emerald-400">★</span>}
            <span className="font-mono text-sm">
              {format === 'percent' ? `${valA}%` : valA}
            </span>
          </div>

          <span className="text-slate-400 font-medium text-[11px] sm:text-xs text-center px-2">
            {label}
          </span>

          <div className="flex items-center gap-1.5 text-purple-400">
            <span className="font-mono text-sm">
              {format === 'percent' ? `${valB}%` : valB}
            </span>
            {isBLeading && <span className="text-[10px] text-purple-400">★</span>}
          </div>
        </div>

        {/* Dual Bar */}
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${pctA}%` }}
            className={`h-full transition-all duration-500 ${
              isALeading ? 'bg-gradient-to-r from-cyan-500 to-teal-400' : 'bg-cyan-700/60'
            }`}
          />
          <div
            style={{ width: `${pctB}%` }}
            className={`h-full transition-all duration-500 ${
              isBLeading ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500' : 'bg-purple-800/60'
            }`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Console for Head-to-Head */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-950/50 backdrop-blur-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md">
              <Swords className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                Comparador Directo Head-to-Head
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  H2H IA
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Enfrenta a dos equipos para obtener balance histórico, métricas avanzadas y veredicto táctico
              </p>
            </div>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Team A */}
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              Equipo 1 (Local / Equipo A)
            </label>
            <input
              type="text"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && runComparison()}
              placeholder="Ej: Real Madrid, Arsenal, River..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center pt-2 md:pt-4">
            <button
              type="button"
              onClick={handleSwap}
              title="Invertir equipos"
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Team B */}
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-1">
              Equipo 2 (Visitante / Equipo B)
            </label>
            <input
              type="text"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && runComparison()}
              placeholder="Ej: Manchester City, Liverpool, Boca..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
            />
          </div>
        </div>

        {/* Optional Competition & Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex-1">
            <input
              type="text"
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
              placeholder="Competición o torneo opcional (ej: Champions League, Premier League...)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-all"
            />
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => runComparison()}
            className={`px-7 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isLoading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>GENERANDO H2H CON IA...</span>
              </>
            ) : (
              <>
                <Swords className="w-4 h-4 text-slate-950" />
                <span>COMPARAR HEAD-TO-HEAD</span>
              </>
            )}
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Quick Rivalry Presets */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Duelos Clásicos y Rivalidades Populares:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_MATCHUPS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => handleSelectPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 group disabled:opacity-50"
              >
                <span className="font-medium">
                  {preset.teamA} <span className="text-slate-500">vs</span> {preset.teamB}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 group-hover:bg-cyan-950 text-slate-400 group-hover:text-cyan-400 border border-slate-700/50">
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Head-to-Head Detailed Results */}
      {h2hResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fade-in relative overflow-hidden">
          {/* Ambient glow backgrounds */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mt-20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Header Banner */}
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {h2hResult.competition || 'FÚTBOL DE ÉLITE'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {h2hResult.rivalryName}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Favorito: {h2hResult.veredictoH2H.favorito}
                </span>
              </div>

              {/* Matchup Title */}
              <div className="flex items-center gap-3 pt-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
                  {h2hResult.teamA}
                </h2>
                <span className="text-lg font-black text-slate-500">VS</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-300">
                  {h2hResult.teamB}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
                {h2hResult.summary}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Compartir</span>
                  </>
                )}
              </button>

              {onAnalyzeAsMatch && (
                <button
                  type="button"
                  onClick={() =>
                    onAnalyzeAsMatch(`${h2hResult.teamA} vs ${h2hResult.teamB}`)
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pronóstico Completo</span>
                </button>
              )}
            </div>
          </div>

          {/* Win Probability & Estimated Score */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Probabilidades Estimadas del Encuentro Directo
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400">Marcador estimado:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {h2hResult.veredictoH2H.marcadorEstimado}
                </span>
              </div>
            </div>

            {/* Split Prob Bar */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${h2hResult.veredictoH2H.probabilidadA}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-700"
                />
                <div
                  style={{ width: `${h2hResult.veredictoH2H.probabilidadEmpate}%` }}
                  className="h-full bg-slate-600 transition-all duration-700"
                />
                <div
                  style={{ width: `${h2hResult.veredictoH2H.probabilidadB}%` }}
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all duration-700"
                />
              </div>

              <div className="grid grid-cols-3 text-center text-xs">
                <div className="text-cyan-400 font-semibold">
                  <div>{h2hResult.teamA}</div>
                  <div className="font-mono text-base font-extrabold">
                    {h2hResult.veredictoH2H.probabilidadA}%
                  </div>
                </div>
                <div className="text-slate-400 font-semibold">
                  <div>Empate</div>
                  <div className="font-mono text-base font-extrabold">
                    {h2hResult.veredictoH2H.probabilidadEmpate}%
                  </div>
                </div>
                <div className="text-purple-400 font-semibold">
                  <div>{h2hResult.teamB}</div>
                  <div className="font-mono text-base font-extrabold">
                    {h2hResult.veredictoH2H.probabilidadB}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form & Direct History Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Form Comparison */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Forma Reciente (Últimos 5 Partidos)
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-300">
                    {h2hResult.teamA}
                  </span>
                  <div className="flex gap-1.5">
                    {h2hResult.recentForm.teamAForm.map((f, i) =>
                      renderFormBadge(f, i)
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-300">
                    {h2hResult.teamB}
                  </span>
                  <div className="flex gap-1.5">
                    {h2hResult.recentForm.teamBForm.map((f, i) =>
                      renderFormBadge(f, i)
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Balance */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Balance Histórico Head-to-Head
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <span className="text-[10px] text-cyan-400 block font-semibold">
                    Victorias {h2hResult.teamA.split(' ')[0]}
                  </span>
                  <span className="text-lg font-mono font-black text-cyan-300">
                    {h2hResult.historicalH2H.victoriasTeamA}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Empates
                  </span>
                  <span className="text-lg font-mono font-black text-slate-200">
                    {h2hResult.historicalH2H.empates}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[10px] text-purple-400 block font-semibold">
                    Victorias {h2hResult.teamB.split(' ')[0]}
                  </span>
                  <span className="text-lg font-mono font-black text-purple-300">
                    {h2hResult.historicalH2H.victoriasTeamB}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                <span>
                  Goles prom. en H2H:{' '}
                  <strong className="text-slate-200">
                    {h2hResult.historicalH2H.promedioGolesH2H}
                  </strong>
                </span>
                <span>
                  Ambos Anotan:{' '}
                  <strong className="text-emerald-400">
                    {h2hResult.historicalH2H.ambosAnotanPorcentajeH2H}%
                  </strong>
                </span>
                <span>
                  Over 2.5:{' '}
                  <strong className="text-cyan-400">
                    {h2hResult.historicalH2H.over25PorcentajeH2H}%
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-side Statistical Metrics Comparison */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                Comparativa Cuantitativa por Partido (Temporada 2026)
              </span>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-cyan-400">{h2hResult.teamA}</span>
                <span className="text-slate-600">vs</span>
                <span className="text-purple-400">{h2hResult.teamB}</span>
              </div>
            </div>

            <div className="space-y-1">
              {renderComparisonBar(
                'Goles Anotados / Partido',
                h2hResult.statsComparison.golesPorPartido.teamA,
                h2hResult.statsComparison.golesPorPartido.teamB
              )}

              {renderComparisonBar(
                'Goles Concedidos / Partido',
                h2hResult.statsComparison.golesConcedidos.teamA,
                h2hResult.statsComparison.golesConcedidos.teamB,
                'num',
                true // lower is better
              )}

              {renderComparisonBar(
                'Expected Goals (xG) Promedio',
                h2hResult.statsComparison.xG_promedio.teamA,
                h2hResult.statsComparison.xG_promedio.teamB
              )}

              {renderComparisonBar(
                'Posesión Promedio (%)',
                h2hResult.statsComparison.posesionPromedio.teamA,
                h2hResult.statsComparison.posesionPromedio.teamB,
                'percent'
              )}

              {renderComparisonBar(
                'Tiros a Puerta / Partido',
                h2hResult.statsComparison.tirosPuertaPorPartido.teamA,
                h2hResult.statsComparison.tirosPuertaPorPartido.teamB
              )}

              {renderComparisonBar(
                'Córners a Favor / Partido',
                h2hResult.statsComparison.cornersPorPartido.teamA,
                h2hResult.statsComparison.cornersPorPartido.teamB
              )}

              {renderComparisonBar(
                'Tarjetas Recibidas / Partido',
                h2hResult.statsComparison.tarjetasPorPartido.teamA,
                h2hResult.statsComparison.tarjetasPorPartido.teamB,
                'num',
                true
              )}

              {renderComparisonBar(
                'Portería a Cero (Clean Sheets %)',
                h2hResult.statsComparison.cleanSheetPercentage.teamA,
                h2hResult.statsComparison.cleanSheetPercentage.teamB,
                'percent'
              )}
            </div>
          </div>

          {/* Recent Direct Encounters */}
          {h2hResult.historicalH2H.ultimosPartidos &&
            h2hResult.historicalH2H.ultimosPartidos.length > 0 && (
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  Últimos Duelos Directos Registrados
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {h2hResult.historicalH2H.ultimosPartidos.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 block">
                          {p.competicion} • {p.fechaOAnno}
                        </span>
                        <span className="font-semibold text-slate-200">
                          Ganador: {p.ganador}
                        </span>
                      </div>
                      <span className="font-mono font-bold px-2 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                        {p.resultado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Tactical Battle & Key Player Duel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tactical Advantage Breakdown */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                Factores Tácticos Decisivos
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/20">
                  <span className="text-cyan-400 font-semibold block mb-0.5">
                    Fortaleza de {h2hResult.teamA}:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {h2hResult.tacticalAdvantage.teamAAdvantage}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/20">
                  <span className="text-purple-400 font-semibold block mb-0.5">
                    Fortaleza de {h2hResult.teamB}:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {h2hResult.tacticalAdvantage.teamBAdvantage}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-amber-400 font-semibold block mb-0.5">
                    Zona Clave de la Disputa:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {h2hResult.tacticalAdvantage.keyTacticalBattle}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Player Duel */}
            {h2hResult.keyPlayerDuel && (
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-400" />
                  Duelo Individual de Figuras
                </h4>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-1">
                    <span className="text-[10px] text-cyan-400 uppercase font-semibold block">
                      {h2hResult.teamA}
                    </span>
                    <h5 className="font-extrabold text-slate-100 text-sm">
                      {h2hResult.keyPlayerDuel.playerA.name}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      {h2hResult.keyPlayerDuel.playerA.position}
                    </p>
                    <span className="inline-block text-[11px] font-mono text-cyan-300 font-semibold pt-1">
                      {h2hResult.keyPlayerDuel.playerA.stat}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs space-y-1">
                    <span className="text-[10px] text-purple-400 uppercase font-semibold block">
                      {h2hResult.teamB}
                    </span>
                    <h5 className="font-extrabold text-slate-100 text-sm">
                      {h2hResult.keyPlayerDuel.playerB.name}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      {h2hResult.keyPlayerDuel.playerB.position}
                    </p>
                    <span className="inline-block text-[11px] font-mono text-purple-300 font-semibold pt-1">
                      {h2hResult.keyPlayerDuel.playerB.stat}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-semibold block mb-0.5">
                    Impacto en el Resultado:
                  </span>
                  {h2hResult.keyPlayerDuel.duelDescription}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Betting Angles based on Head-to-Head */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400" />
                Mercados con Valor Estadístico Basados en Head-to-Head
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {h2hResult.veredictoH2H.mercadosRecomendadosH2H.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">{m.mercado}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        H2H Edge
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-slate-100">
                      {m.seleccion}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {m.motivo}
                    </p>
                  </div>

                  {onOpenStakeCalculator && (
                    <button
                      type="button"
                      onClick={() => onOpenStakeCalculator('1.85')}
                      className="mt-2 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 self-start inline-flex items-center gap-1"
                    >
                      Calcular Stake →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final Qualitative AI Verdict */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Veredicto Final del Analista Cuantitativo:
            </span>
            <p>{h2hResult.veredictoH2H.analisisFinal}</p>
          </div>
        </div>
      )}
    </div>
  );
};
