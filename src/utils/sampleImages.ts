// Generates a synthetic realistic screenshot of a match stats & odds card
export function generateSampleMatchCard(local = 'Real Madrid', visitante = 'Bayern Múnich'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header banner
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(20, 20, 860, 80);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(20, 20, 8, 80);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('UEFA CHAMPIONS LEAGUE • SEMIFINAL 2026', 45, 50);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('ESTADÍSTICAS EN DIRECTO Y MERCADOS DE APUESTAS', 45, 82);

  // Matchup Box
  ctx.fillStyle = '#1e293b';
  ctx.roundRect(20, 115, 860, 150, 12);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(local, 60, 180);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '22px sans-serif';
  ctx.fillText('VS', 420, 180);

  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(visitante, 530, 180);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px monospace';
  ctx.fillText('Cuota 1: 2.10        Cuota X: 3.50        Cuota 2: 3.30', 250, 230);

  // Stats table
  const stats = [
    { label: 'Goles por partido (Racha)', local: '2.4', vis: '2.1' },
    { label: 'Promedio Tiros al Arco', local: '6.8', vis: '5.4' },
    { label: 'Córners a Favor (Media)', local: '6.2', vis: '5.1' },
    { label: 'Tarjetas Amarillas / Juego', local: '2.3', vis: '2.8' },
    { label: 'Probabilidad Ambos Marcan', local: '68%', vis: '72%' },
  ];

  ctx.fillStyle = '#1e293b';
  ctx.roundRect(20, 280, 860, 280, 12);
  ctx.fill();

  stats.forEach((st, i) => {
    const y = 330 + i * 48;
    ctx.fillStyle = i % 2 === 0 ? '#334155' : 'transparent';
    if (i % 2 === 0) {
      ctx.fillRect(30, y - 30, 840, 40);
    }
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(st.local, 80, y - 5);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '16px sans-serif';
    ctx.fillText(st.label, 310, y - 5);

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(st.vis, 750, y - 5);
  });

  return canvas.toDataURL('image/png');
}
