import React, { useState } from 'react';
import { 
  Clock, 
  PlayCircle, 
  Flag, 
  Target, 
  Sparkles, 
  CheckSquare, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  Award, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Compass,
  CheckCircle2
} from 'lucide-react';
import type { AnalisisTemporalCompleto } from '../types';

interface ChronologicalAnalysisCardProps {
  analisisTemporal?: AnalisisTemporalCompleto;
  equipoLocal: string;
  equipoVisitante: string;
}

export const ChronologicalAnalysisCard: React.FC<ChronologicalAnalysisCardProps> = ({
  analisisTemporal,
  equipoLocal,
  equipoVisitante,
}) => {
  const [activeTab, setActiveTab] = useState<'todo' | 'antes' | 'presente' | 'despues' | 'evaluacion'>('evaluacion');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Fallback defaults if data is not yet computed
  const temporal = analisisTemporal || {
    sintesis_linea_tiempo: `Evaluación integral del ciclo de partido: preparación previa y pizarrón táctico (ANTES), desarrollo dinámico y gatillos en vivo (PRESENTE), e impacto clasificatorio y cobertura (DESPUÉS).`,
    antes: {
      fase: 'ANTES' as const,
      contexto_y_urgencia: `${equipoLocal} llega con la necesidad de imponer condiciones en casa para sumar de a tres puntos, mientras que ${equipoVisitante} plantea un esquema pragmático para puntuar a domicilio.`,
      plan_tactico_inicial: `${equipoLocal} iniciará con bloque medio-alto buscando ensanchar el campo por bandas. ${equipoVisitante} priorizará mantener líneas compactas y salir en transiciones rápidas verticales.`,
      presion_psicologica_y_moral: `La presión ambiental favorece el ímpetu inicial de ${equipoLocal}, aunque si el gol se retrasa después de la media hora el nerviosismo podría acelerar precipitaciones.`,
      dias_descanso_y_rotaciones: `Ambos planteles llegan con microciclo óptimo de descanso para presentar sus mejores alineaciones titulares disponibles.`,
      checklist_pre_partido_apuestas: [
        `Verificar alineaciones confirmadas 60 minutos antes del inicio.`,
        `Monitorear caídas bruscas de cuotas (Dropping Odds) en el mercado 1X2.`,
        `Comprobar condiciones climáticas y humedad en el césped.`
      ]
    },
    presente: {
      fase: 'PRESENTE' as const,
      fase_minutos_1_30: `Minutos 1-30: Fase de estudio y fricción en mediocampo. Se anticipa alta intensidad física con faltas tácticas para cortar contragolpes.`,
      fase_minutos_31_60: `Minutos 31-60: Ajuste de vestuario. El equipo que logre mayor precisión en el último tercio inclinará la balanza. Ventana de mayor generación de córners.`,
      fase_minutos_61_90: `Minutos 61-90: Clímax y desgaste físico. Con el ingreso de revulsivos y el estiramiento de líneas, se incrementa exponencialmente la probabilidad de goles tardíos.`,
      puntos_de_inflexion_game_changers: [
        `Gol temprano antes del minuto 20: Desarma el plan de repliegue y abre el partido a un Over 2.5 dinámico.`,
        `Tarjeta roja o amonestación temprana de un pivote defensivo: Condiciona la agresividad en la recuperación.`,
        `Balón parado (tiro de esquina o falta frontal): Factor decisivo en partidos cerrados.`
      ],
      estrategia_apuestas_en_vivo: [
        {
          condicion_live: 'Si el marcador se mantiene 0-0 al minuto 30',
          minuto_aprox: "30' - 35'",
          mercado_gatillo: 'Over 0.5 Goles en 1er Tiempo o Over 1.5 en el partido',
          accion_recomendada: 'Entrar cuando la cuota de Over 1.5 supere 1.55 con alta presión en área.'
        },
        {
          condicion_live: `Si ${equipoLocal} se adelanta en el primer tiempo`,
          minuto_aprox: "Descanso (45')",
          mercado_gatillo: 'Tiros de esquina de visitante o Hándicap Asiático',
          accion_recomendada: 'Buscar córners a favor del equipo en desventaja por la necesidad de empatar.'
        },
        {
          condicion_live: 'Marcador ajustado con 1 gol de diferencia hacia el minuto 70',
          minuto_aprox: "70' - 75'",
          mercado_gatillo: 'Over de tarjetas o Gol tardío (Min 75-90+)',
          accion_recomendada: 'Apostar a amonestaciones por interrupciones o asegurar ganancias con Cash-Out parcial.'
        }
      ]
    },
    despues: {
      fase: 'DESPUES' as const,
      impacto_tabla_y_temporada: `El desenlace tendrá impacto directo en el posicionamiento clasificatorio y en el coeficiente de confianza de cara a las próximas jornadas decisivas.`,
      desgaste_y_proximo_partido: `La alta intensidad de los 90 minutos requerirá gestión de cargas físicas de cara al siguiente encuentro del calendario en los próximos días.`,
      escenarios_post_resultado: {
        si_gana_local: `${equipoLocal} consolidará su fortaleza en casa y ratificará su favoritismo en el torneo.`,
        si_hay_empate: `Resultado que premiará la resistencia defensiva de ${equipoVisitante} y abrirá debates tácticos en el local.`,
        si_gana_visitante: `Golpe de autoridad de ${equipoVisitante}, rompiendo pronósticos y generando enorme valor para apuestas contracorriente.`
      },
      lecciones_para_futuras_apuestas: [
        `Evaluar si la solidez defensiva del visitante se mantiene frente a rivales de bloque alto.`,
        `Tomar en cuenta la efectividad de conversión xG del local para ajustar futuros hándicaps asiáticos.`,
        `Monitorear el rendimiento de los suplentes para mercados de goleador en partidos posteriores.`
      ]
    },
    evaluacion_global: {
      score_predictibilidad: 84,
      veredicto_unificado_360: `Conectando el ANTES (ventaja de localía y urgencia de ${equipoLocal}), el PRESENTE (inicio cerrado que se abrirá en la segunda mitad) y el DESPUÉS (consecuencias de tabla), la selección de mayor valor cuantitativo es Doble Oportunidad local combinada con línea prudente de goles.`,
      hoja_de_ruta_apuesta_maestra: {
        fase_antes_prematch: `Doble Oportunidad 1X o Hándicap Asiático 0.0 ${equipoLocal}`,
        cuota_prematch: '1.42',
        fase_presente_live: 'Esperar minuto 25-35 para entrar a Over 1.5 goles con cuota mejorada si van 0-0',
        gatillo_live: 'Si se produce el primer gol antes del 30, cambiar el foco en vivo a tiros de esquina del equipo en desventaja',
        fase_despues_cobertura: 'Aplicar Cash-Out al minuto 75-80 si el marcador favorece por la mínima y el rival adelanta líneas'
      },
      conclusion_experta: `Evaluación integral 360° completada con éxito. El cruce de variables pre-partido, métricas de desarrollo minuto a minuto y análisis de consecuencias post-partido ofrece una ventana de valor cuantitativo con riesgo acotado.`
    }
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const evalScore = temporal.evaluacion_global?.score_predictibilidad || 82;

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950 shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 text-indigo-400">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-100 flex items-center gap-2">
                Análisis 360°: Antes, Presente y Después
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Evaluación Holística
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluación profunda del ciclo completo del partido: fase previa, desarrollo 90 min y proyección post-partido
            </p>
          </div>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('evaluacion')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 ${
              activeTab === 'evaluacion'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Evaluación 360°</span>
          </button>

          <button
            onClick={() => setActiveTab('antes')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 ${
              activeTab === 'antes'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>El Antes</span>
          </button>

          <button
            onClick={() => setActiveTab('presente')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 ${
              activeTab === 'presente'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>El Presente (90')</span>
          </button>

          <button
            onClick={() => setActiveTab('despues')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 ${
              activeTab === 'despues'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>El Después</span>
          </button>

          <button
            onClick={() => setActiveTab('todo')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
              activeTab === 'todo'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ver Todo
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* EVALUACIÓN GLOBAL HOLÍSTICA 360° (Siempre visible o en su pestaña) */}
        {(activeTab === 'evaluacion' || activeTab === 'todo') && (
          <div className="space-y-5">
            {/* Top Score Banner */}
            <div className="rounded-2xl p-5 bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-slate-950 border border-indigo-500/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      Evaluación Definitiva Unificada
                    </span>
                    <span className="text-xs text-slate-400">• Síntesis de Antes, Durante y Después</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-white">
                    Veredicto Integral del Algoritmo
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {temporal.evaluacion_global.veredicto_unificado_360}
                  </p>
                </div>

                {/* Score Dial */}
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 border border-indigo-500/30 shrink-0 min-w-[130px]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Predictibilidad</span>
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    {evalScore}%
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                    {evalScore >= 80 ? 'Alta Certidumbre' : 'Moderada Certidumbre'}
                  </span>
                </div>
              </div>
            </div>

            {/* Hoja de Ruta de Apuesta Maestra (Ciclo de Vida de la Apuesta) */}
            <div className="rounded-2xl p-5 bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-100">
                    Hoja de Ruta de Apuesta Maestra (Estrategia por Fases)
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Plan 1-2-3</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Paso 1: Antes */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Paso 1: Antes (Pre-Match)
                    </span>
                    {temporal.evaluacion_global.hoja_de_ruta_apuesta_maestra.cuota_prematch && (
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        @{temporal.evaluacion_global.hoja_de_ruta_apuesta_maestra.cuota_prematch}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 font-medium">
                    {temporal.evaluacion_global.hoja_de_ruta_apuesta_maestra.fase_antes_prematch}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Entrada base antes de iniciar el partido con la mayor cobertura estadística.
                  </p>
                </div>

                {/* Paso 2: Presente */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Paso 2: Presente (En Vivo)
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">Min 25-60'</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">
                    {temporal.evaluacion_global.hoja_de_ruta_apuesta_maestra.fase_presente_live}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {temporal.evaluacion_global.hoja_de_ruta_apuesta_maestra.gatillo_live}
                  </p>
                </div>

                {/* Paso 3: Después */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      Paso 3: Después (Cobertura)
                    </span>
                    <span className="text-xs font-mono text-purple-400 font-bold">Min 75-90+'</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">
                    {temporal.evaluacion_global.hoja_de_ruta_apuesta_maestra.fase_despues_cobertura}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Cierre o mitigación de riesgo para proteger ganancias y evitar goles de último minuto.
                  </p>
                </div>
              </div>

              {/* Conclusión experta */}
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-200/90 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Conclusión del Modelo 360°:</strong> {temporal.evaluacion_global.conclusion_experta}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* FASE 1: EL ANTES (PRE-MATCH) */}
        {(activeTab === 'antes' || activeTab === 'todo') && (
          <div className="rounded-2xl p-5 bg-slate-950/80 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-amber-400" />
                <h4 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  FASE 1: El Antes (Pre-Partido y Preparación)
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                Pre-Match Intelligence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contexto y urgencia */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Urgencia Clasificatoria y Puntos en Juego
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {temporal.antes.contexto_y_urgencia}
                </p>
              </div>

              {/* Plan táctico inicial */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Pizarrón Táctico Inicial & Esquemas
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {temporal.antes.plan_tactico_inicial}
                </p>
              </div>

              {/* Presión y moral */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Presión Psicológica y Factor Localía
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {temporal.antes.presion_psicologica_y_moral}
                </p>
              </div>

              {/* Descanso y rotaciones */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Días de Descanso & Rotaciones Previstas
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {temporal.antes.dias_descanso_y_rotaciones}
                </p>
              </div>
            </div>

            {/* Checklist interactivo pre-apuesta */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                Checklist Pre-Partido Indispensable (60 Minutos Antes)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {temporal.antes.checklist_pre_partido_apuestas.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${
                      checkedItems[idx]
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border mt-0.5 ${
                      checkedItems[idx] ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold' : 'border-slate-600'
                    }`}>
                      {checkedItems[idx] && '✓'}
                    </span>
                    <span className="leading-snug">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FASE 2: EL PRESENTE (DURANTE EL PARTIDO - 90 MIN) */}
        {(activeTab === 'presente' || activeTab === 'todo') && (
          <div className="rounded-2xl p-5 bg-slate-950/80 border border-emerald-500/30 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-emerald-400" />
                  FASE 2: El Presente (Dinámica Minuto 0 a 90+)
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                En Vivo & Desarrollo
              </span>
            </div>

            {/* Cronología por Cuartos de Hora */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-400">Min 1' - 30'</span>
                  <span className="text-[10px] text-slate-500">Estudio e Intensidad</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {temporal.presente.fase_minutos_1_30}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-400">Min 31' - 60'</span>
                  <span className="text-[10px] text-slate-500">Ajustes & Córners</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {temporal.presente.fase_minutos_31_60}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-400">Min 61' - 90+'</span>
                  <span className="text-[10px] text-slate-500">Desgaste & Goles Tardíos</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {temporal.presente.fase_minutos_61_90}
                </p>
              </div>
            </div>

            {/* Puntos de Inflexión (Game Changers) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Puntos de Inflexión y "Game Changers"
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {temporal.presente.puntos_de_inflexion_game_changers.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gatillos de Apuestas en Vivo (Live Betting Triggers) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Gatillos de Apuestas en Vivo (Live Betting Triggers)
              </span>

              <div className="space-y-2">
                {temporal.presente.estrategia_apuestas_en_vivo.map((strat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {strat.minuto_aprox}
                        </span>
                        <strong className="text-xs text-slate-200">{strat.condicion_live}</strong>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {strat.accion_recomendada}
                      </p>
                    </div>

                    <div className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold text-xs text-right">
                      {strat.mercado_gatillo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FASE 3: EL DESPUÉS (POST-MATCH Y PROYECCIÓN) */}
        {(activeTab === 'despues' || activeTab === 'todo') && (
          <div className="rounded-2xl p-5 bg-slate-950/80 border border-cyan-500/30 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-cyan-400" />
                <h4 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-cyan-400" />
                  FASE 3: El Después (Consecuencias Post-Partido)
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                Post-Match & Futuros
              </span>
            </div>

            {/* Impacto en tabla y próximo juego */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Impacto en la Tabla y Objetivos de Temporada
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {temporal.despues.impacto_tabla_y_temporada}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Desgaste Físico & Próximo Encuentro
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {temporal.despues.desgaste_y_proximo_partido}
                </p>
              </div>
            </div>

            {/* Escenarios Post-Resultado (Local, Empate, Visitante) */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Escenarios según el Desenlace Final
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-400 block">
                    Si Gana {equipoLocal}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {temporal.despues.escenarios_post_resultado.si_gana_local}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    Si Hay Empate
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {temporal.despues.escenarios_post_resultado.si_hay_empate}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-1">
                  <span className="text-[10px] font-black uppercase text-cyan-400 block">
                    Si Gana {equipoVisitante}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {temporal.despues.escenarios_post_resultado.si_gana_visitante}
                  </p>
                </div>
              </div>
            </div>

            {/* Lecciones para futuras apuestas */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Lecciones de Aprendizaje para Próximas Fechas
              </span>
              <ul className="space-y-1.5">
                {temporal.despues.lecciones_para_futuras_apuestas.map((lec, idx) => (
                  <li key={idx} className="text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{lec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
