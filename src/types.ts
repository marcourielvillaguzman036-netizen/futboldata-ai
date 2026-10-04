export interface ValueBet {
  mercado: string;
  seleccion: string;
  cuota_estimada: string;
  nivel_confianza: 'ALTA' | 'MEDIA' | 'BAJA';
  nivel_riesgo?: 'BAJO' | 'MEDIO' | 'ALTO';
  probabilidad_estimada?: number;
  perfil?: string;
  justificacion_big_data: string;
}

export interface BetsByRiskLevel {
  riesgo_bajo: ValueBet[];
  riesgo_medio: ValueBet[];
  riesgo_alto: ValueBet[];
}

export interface KeyPlayer {
  jugador: string;
  equipo: string;
  impacto_esperado: string;
}

export interface RecentTeamMatch {
  rival: string;
  marcador: string;
  resultado: 'V' | 'E' | 'D' | string;
  condicion: 'Local' | 'Visitante' | string;
  competicion: string;
  fecha: string;
  golesFavor: number;
  golesContra: number;
  corners?: string;
  tarjetas?: string;
}

export interface TeamMatchesHistory {
  equipo: string;
  rachaReciente: string[]; // e.g. ['V', 'V', 'E', 'D', 'V']
  promedioGolesAnotados: number;
  promedioGolesEncajados: number;
  vallasInvictasRecientes: number;
  partidos: RecentTeamMatch[];
  conclusionRacha: string;
}

export interface PlayerDetailedAnalysis {
  nombre: string;
  posicion: string;
  equipo: string;
  dorsal?: string;
  estadoForma: 'Excelente' | 'Bueno' | 'Regular' | 'Baja / En duda';
  metricasClave: string; // e.g. "12 goles, 3.4 remates/p, 87% precisión"
  analisisTactico: string; // rol e impacto en el juego
  mercadoRelevante?: string; // pronóstico/mercado individual
}

export interface MonteCarloScoreProb {
  marcador: string;
  probabilidad: number; // 0 - 100
  es_mas_probable?: boolean;
}

export interface MonteCarloSimulation {
  simulaciones_totales: number; // e.g. 10000
  matriz_marcadores: MonteCarloScoreProb[];
  curva_goles_probabilidad: {
    over05: number;
    over15: number;
    over25: number;
    over35: number;
    over45: number;
  };
  ambos_marcan_prob: number;
  simulacion_resumen: string;
}

export interface GameScriptScenario {
  nombre_escenario: string;
  probabilidad_ocurrencia: number; // 0 - 100
  descripcion_desarrollo: string;
  impacto_en_mercados: string;
  apuesta_en_vivo_recomendada: string;
}

export interface AdvancedBigDataMetrics {
  ppda_local: number; // Pases Permitidos por Acción Defensiva (menor número = mayor presión alta)
  ppda_visitante: number;
  field_tilt_local: number; // Inclinación territorial en último tercio (0-100)
  field_tilt_visitante: number;
  eficiencia_conversion_local: number; // % remates a gol
  eficiencia_conversion_visitante: number;
  duelos_aereos_favorables: string; // Equipo dominante por alto
  indice_fragilidad_transicion_local: string; // Baja, Moderada, Crítica
  indice_fragilidad_transicion_visitante: string;
}

export interface ExpectedValueEdge {
  mercado: string;
  seleccion: string;
  cuota_casa: number;
  probabilidad_implicita_casa: number; // 0 - 100
  probabilidad_real_ia: number; // 0 - 100
  edge_matematico: number; // ej. +12.4%
  stake_kelly_recomendado: string; // ej. "2.4% del Bankroll"
  explicacion_matematica: string;
}

export interface PrimerGolPrediction {
  equipo_favorito_primer_gol: string;
  probabilidad_primer_gol_local: number; // 0 - 100
  probabilidad_primer_gol_visitante: number; // 0 - 100
  probabilidad_sin_goles: number; // 0 - 100
  jugador_mas_probable: string;
  minuto_estimado_rango: string; // ej: "Min 15 - 30"
  cuota_estimada_primer_gol: string; // ej: "1.72"
  analisis_probabilidad: string;
}

export interface MatchAnalysis {
  partido_formateado: string;
  equipo_local: string;
  equipo_visitante: string;
  competicion_o_liga: string;
  fecha_o_contexto?: string;

  // Exact fields from user's initial code
  goles: string;
  corners: string;
  tarjetas: string;
  tiros: string;
  ambos_anotan: string;

  // Extended quantitative Big Data metrics
  probabilidad_local: number;
  probabilidad_empate: number;
  probabilidad_visitante: number;
  marcador_probable: string;

  // Primer gol prediction
  primer_gol?: PrimerGolPrediction;

  goles_over_under_linea?: string;
  goles_esperados_total?: string;

  corners_rango_estimado?: string;
  corners_equipo_dominante?: string;

  tarjetas_rango_estimado?: string;
  nivel_intensidad_arbitral?: string;

  tiros_puerta_local?: string;
  tiros_puerta_visitante?: string;

  ambos_anotan_porcentaje: number;
  ambos_anotan_veredicto: string;

  apuestas_de_valor: ValueBet[];
  analisis_tactico_big_data: string;
  jugadores_clave?: KeyPlayer[];
  
  // Previous matches analysis for both teams
  historial_local?: TeamMatchesHistory;
  historial_visitante?: TeamMatchesHistory;

  // Detailed player-by-player analysis for both teams
  jugadores_analisis_local?: PlayerDetailedAnalysis[];
  jugadores_analisis_visitante?: PlayerDetailedAnalysis[];

  // Advanced Sports Intelligence Layers
  simulacion_monte_carlo?: MonteCarloSimulation;
  guiones_de_partido?: GameScriptScenario[];
  metricas_avanzadas_big_data?: AdvancedBigDataMetrics;
  analisis_edge_ev?: ExpectedValueEdge[];

  // Bets Classified by Risk Level (Bajo, Medio, Alto)
  apuestas_por_riesgo?: BetsByRiskLevel;

  // Real-time Internet Web Intelligence for both teams
  inteligencia_web?: WebIntelligenceReport;

  // Deep Chronological Analysis: Antes (Pre-Match), Presente (En Vivo/Desarrollo) y Después (Post-Match)
  analisis_temporal?: AnalisisTemporalCompleto;

  indice_riesgo: 'Bajo' | 'Moderado' | 'Alto';
  
  // Timestamp
  analyzedAt?: string;
  sourceType?: 'text' | 'capture';
}

export interface AnalisisAntesPartido {
  fase: 'ANTES';
  contexto_y_urgencia: string;
  plan_tactico_inicial: string;
  presion_psicologica_y_moral: string;
  dias_descanso_y_rotaciones: string;
  checklist_pre_partido_apuestas: string[];
}

export interface LiveBetTrigger {
  condicion_live: string;
  minuto_aprox: string;
  mercado_gatillo: string;
  accion_recomendada: string;
}

export interface AnalisisPresentePartido {
  fase: 'PRESENTE';
  fase_minutos_1_30: string;
  fase_minutos_31_60: string;
  fase_minutos_61_90: string;
  puntos_de_inflexion_game_changers: string[];
  estrategia_apuestas_en_vivo: LiveBetTrigger[];
}

export interface AnalisisDespuesPartido {
  fase: 'DESPUES';
  impacto_tabla_y_temporada: string;
  desgaste_y_proximo_partido: string;
  escenarios_post_resultado: {
    si_gana_local: string;
    si_hay_empate: string;
    si_gana_visitante: string;
  };
  lecciones_para_futuras_apuestas: string[];
}

export interface EvaluacionGlobalHolistica {
  score_predictibilidad: number; // 0 a 100
  veredicto_unificado_360: string;
  hoja_de_ruta_apuesta_maestra: {
    fase_antes_prematch: string;
    cuota_prematch: string;
    fase_presente_live: string;
    gatillo_live: string;
    fase_despues_cobertura: string;
  };
  conclusion_experta: string;
}

export interface AnalisisTemporalCompleto {
  antes: AnalisisAntesPartido;
  presente: AnalisisPresentePartido;
  despues: AnalisisDespuesPartido;
  evaluacion_global: EvaluacionGlobalHolistica;
  sintesis_linea_tiempo: string;
}

export type ChronologicalMatchCycle = AnalisisTemporalCompleto;
export type TimelinePhaseAntes = AnalisisAntesPartido;
export type TimelinePhasePresente = AnalisisPresentePartido;
export type TimelinePhaseDespues = AnalisisDespuesPartido;
export type TimelineEvaluacionGlobal = EvaluacionGlobalHolistica;

export interface WebSource {
  titulo: string;
  medio: string;
  url?: string;
  fecha?: string;
  relevancia?: 'ALTA' | 'MEDIA';
}

export interface TeamWebReport {
  equipo: string;
  noticias_recientes: string[];
  bajas_lesionados_confirmados: string[];
  ambiente_vestuario: string;
  racha_detectada_web?: string;
}

export interface WebIntelligenceReport {
  activo: boolean;
  fuentes_consultadas: WebSource[];
  estado_forma_internet_local: TeamWebReport;
  estado_forma_internet_visitante: TeamWebReport;
  clima_y_factores_externos?: {
    estadio: string;
    clima_pronosticado?: string;
    impacto_campo?: string;
  };
  sintesis_red_en_vivo: string;
  fecha_rastreo_web: string;
}


export interface QuickMatch {
  partido: string;
  liga: string;
  badge: string;
  contexto: string;
}

export interface HeadToHeadMetricPair {
  teamA: number;
  teamB: number;
}

export interface HeadToHeadStats {
  golesPorPartido: HeadToHeadMetricPair;
  golesConcedidos: HeadToHeadMetricPair;
  xG_promedio: HeadToHeadMetricPair;
  posesionPromedio: HeadToHeadMetricPair;
  cornersPorPartido: HeadToHeadMetricPair;
  tarjetasPorPartido: HeadToHeadMetricPair;
  tirosPuertaPorPartido: HeadToHeadMetricPair;
  cleanSheetPercentage: HeadToHeadMetricPair;
}

export interface PastMatchH2H {
  fechaOAnno: string;
  resultado: string;
  competicion: string;
  ganador: string;
}

export interface HeadToHeadData {
  teamA: string;
  teamB: string;
  rivalryName: string;
  competition: string;
  summary: string;
  statsComparison: HeadToHeadStats;
  historicalH2H: {
    victoriasTeamA: number;
    empates: number;
    victoriasTeamB: number;
    totalPartidosRegistrados: number;
    promedioGolesH2H: number;
    ambosAnotanPorcentajeH2H: number;
    over25PorcentajeH2H: number;
    ultimosPartidos: PastMatchH2H[];
  };
  recentForm: {
    teamAForm: string[];
    teamBForm: string[];
  };
  tacticalAdvantage: {
    teamAAdvantage: string;
    teamBAdvantage: string;
    keyTacticalBattle: string;
  };
  keyPlayerDuel?: {
    playerA: { name: string; position: string; stat: string };
    playerB: { name: string; position: string; stat: string };
    duelDescription: string;
  };
  veredictoH2H: {
    favorito: string;
    probabilidadA: number;
    probabilidadEmpate: number;
    probabilidadB: number;
    marcadorEstimado: string;
    analisisFinal: string;
    mercadosRecomendadosH2H: Array<{ mercado: string; seleccion: string; motivo: string }>;
  };
  analyzedAt?: string;
}

