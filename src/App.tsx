import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Shield,
  Zap,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { QuickMatchesBar } from './components/QuickMatchesBar';
import { AnalysisCard } from './components/AnalysisCard';
import { CaptureModal } from './components/CaptureModal';
import { StakeCalculatorModal } from './components/StakeCalculatorModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HeadToHeadComparison } from './components/HeadToHeadComparison';
import { InstallModal } from './components/InstallModal';
import { MatchAnalysis, QuickMatch } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'match' | 'h2h'>('match');
  const [partidoInput, setPartidoInput] = useState('');
  const [contextoAdicional, setContextoAdicional] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<MatchAnalysis | null>(null);

  // Modals & Drawers
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [selectedStakeOdds, setSelectedStakeOdds] = useState('1.85');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // History & Quick Matches
  const [history, setHistory] = useState<MatchAnalysis[]>(() => {
    try {
      const saved = localStorage.getItem('futboldata_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quickMatches, setQuickMatches] = useState<QuickMatch[]>([]);

  // Fetch quick match suggestions on load
  useEffect(() => {
    fetch('/api/quick-matches')
      .then((res) => res.json())
      .then((data) => setQuickMatches(data))
      .catch((err) => console.log('Error fetching quick matches:', err));
  }, []);

  // Save to history helper (Modo Ilimitado)
  const saveToHistory = (item: MatchAnalysis) => {
    const updated = [item, ...history.filter((h) => h.partido_formateado !== item.partido_formateado)].slice(0, 150);
    setHistory(updated);
    try {
      localStorage.setItem('futboldata_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save history in localStorage', e);
    }
  };

  // Main Text-based Match Analysis
  const analizar = async (customMatch?: string) => {
    const targetMatch = (customMatch || partidoInput).trim();

    if (!targetMatch) {
      setErrorMessage('Por favor, escribe el nombre del partido a analizar (ej: Real Madrid vs Manchester City).');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partido: targetMatch,
          contextoAdicional: contextoAdicional.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error en el servidor (${response.status})`);
      }

      const data: MatchAnalysis = await response.json();
      data.analyzedAt = new Date().toISOString();
      data.sourceType = 'text';

      setAnalysisResult(data);
      saveToHistory(data);
    } catch (err: any) {
      console.error('Error al analizar:', err);
      let friendlyError = 'Hubo un error al procesar el análisis con la IA. Por favor intenta de nuevo.';
      const msg = err?.message || String(err);
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        friendlyError = 'Límite de peticiones a la IA alcanzado temporalmente. Por favor espera unos momentos y vuelve a intentarlo.';
      } else if (msg) {
        friendlyError = msg;
      }
      setErrorMessage(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  // Capture Image Analysis
  const handleAnalyzeCapture = async (base64: string, notes?: string) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: 'image/png',
          notasUsuario: notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error en el servidor al analizar la imagen (${response.status})`);
      }

      const data: MatchAnalysis = await response.json();
      data.analyzedAt = new Date().toISOString();
      data.sourceType = 'capture';

      setAnalysisResult(data);
      saveToHistory(data);
      setIsCaptureModalOpen(false);
    } catch (err: any) {
      console.error('Error al procesar captura:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStakeCalcWithOdds = (odds?: string) => {
    if (odds) setSelectedStakeOdds(odds);
    setIsStakeModalOpen(true);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('futboldata_history');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        onOpenCapture={() => setIsCaptureModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenStakeCalc={() => handleOpenStakeCalcWithOdds()}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero & Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Modo Investigación Sin Límites • Cualquier Partido, Liga o País del Mundo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Análisis de Fútbol & Big Data para Apuestas
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Investiga <span className="text-emerald-400 font-semibold">sin restricciones de cuotas ni consultas</span>: <span className="text-slate-200 font-semibold">goles, córners, tarjetas, tiros a puerta, Monte Carlo</span> y comparativas estadísticas directas con Inteligencia Artificial.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl gap-1">
            <button
              onClick={() => setActiveTab('match')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'match'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚽</span>
              <span>Pronóstico de Partido</span>
            </button>

            <button
              onClick={() => setActiveTab('h2h')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'h2h'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>⚔️</span>
              <span>Head-to-Head (Cara a Cara)</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold border ${
                activeTab === 'h2h'
                  ? 'bg-white/20 text-white border-white/30'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              }`}>
                NUEVO
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic View based on Active Tab */}
        {activeTab === 'h2h' ? (
          <div className="max-w-5xl mx-auto">
            <HeadToHeadComparison
              onAnalyzeAsMatch={(matchStr) => {
                setActiveTab('match');
                setPartidoInput(matchStr);
                analizar(matchStr);
              }}
              onOpenStakeCalculator={handleOpenStakeCalcWithOdds}
            />
          </div>
        ) : (
          <>
            {/* Search & Input Console */}
            <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-950/50 backdrop-blur-sm space-y-4">
              {/* Main Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-5 h-5" />
                </div>

                <input
                  id="partido"
                  type="text"
                  value={partidoInput}
                  onChange={(e) => setPartidoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      analizar();
                    }
                  }}
                  placeholder="Escribe el partido (Ej: Real Madrid vs Man City, Tigres Femenil vs América Femenil, Barça Femenil vs Chelsea...)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700/80 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                />
              </div>

              {/* Context input (optional) */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={contextoAdicional}
                  onChange={(e) => setContextoAdicional(e.target.value)}
                  placeholder="Detalle extra opcional (ej: Final de Champions, bajas clave, clima lluvioso...)"
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCaptureModalOpen(true)}
                  className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/70 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:border-cyan-500/40"
                >
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Analizar Captura / Boleto</span>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => analizar()}
                  className={`px-7 py-3 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isLoading
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>PROCESANDO CON IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>ANALIZAR PARTIDO</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error display */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              {/* Quick Matches Bar */}
              <div className="pt-2 border-t border-slate-800/80">
                <QuickMatchesBar
                  matches={quickMatches}
                  isLoading={isLoading}
                  onSelectMatch={(matchStr) => {
                    setPartidoInput(matchStr);
                    analizar(matchStr);
                  }}
                />
              </div>
            </div>

            {/* Results Section */}
            {analysisResult && (
              <div className="max-w-5xl mx-auto">
                <AnalysisCard
                  analysis={analysisResult}
                  onOpenStakeCalculator={handleOpenStakeCalcWithOdds}
                />
              </div>
            )}

            {/* If no result yet, show Big Data Football Guide Features */}
            {!analysisResult && !isLoading && (
              <div className="max-w-4xl mx-auto pt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    ⚽
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">Goles y Expected Goals (xG)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Calculamos la producción ofensiva y defensiva de ambos equipos, proyectando líneas de Over/Under 2.5 con algoritmos de Poisson.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                    🚩
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">Córners & Volumen Lateral</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluación de amplitud de campo, centros al área y bloqueos defensivos para estimar con exactitud el rango total de saques de esquina.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                    📷
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">Escáner de Capturas & Boletos</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sube o pega directamente (<kbd className="font-mono text-emerald-300">Ctrl+V</kbd>) capturas de Sofascore, Bet365 o Flashscore para una lectura instantánea.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>FutbolData AI © 2026 • Análisis estadístico con Inteligencia Artificial y Big Data para fines informativos y deportivos.</p>
      </footer>

      {/* Modals & Drawers */}
      <CaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        onAnalyzeCapture={handleAnalyzeCapture}
        isLoading={isLoading}
      />

      <StakeCalculatorModal
        isOpen={isStakeModalOpen}
        onClose={() => setIsStakeModalOpen(false)}
        defaultOdds={selectedStakeOdds}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectMatch={(m) => setAnalysisResult(m)}
        onClearHistory={clearHistory}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />
    </div>
  );
}
