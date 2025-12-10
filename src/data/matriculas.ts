export interface DadosSemana {
  semana: string;
  matriculas2025: number;
  matriculas2026: number;
  acumulado2025: number;
  acumulado2026: number;
}

export interface MetaAnual {
  ano: number;
  meta: number;
  atual: number;
}

export const dadosSemanais: DadosSemana[] = [
  { semana: 'Sem 1', matriculas2025: 45, matriculas2026: 52, acumulado2025: 45, acumulado2026: 52 },
  { semana: 'Sem 2', matriculas2025: 38, matriculas2026: 48, acumulado2025: 83, acumulado2026: 100 },
  { semana: 'Sem 3', matriculas2025: 42, matriculas2026: 55, acumulado2025: 125, acumulado2026: 155 },
  { semana: 'Sem 4', matriculas2025: 35, matriculas2026: 41, acumulado2025: 160, acumulado2026: 196 },
  { semana: 'Sem 5', matriculas2025: 50, matriculas2026: 62, acumulado2025: 210, acumulado2026: 258 },
  { semana: 'Sem 6', matriculas2025: 48, matriculas2026: 58, acumulado2025: 258, acumulado2026: 316 },
  { semana: 'Sem 7', matriculas2025: 40, matriculas2026: 53, acumulado2025: 298, acumulado2026: 369 },
  { semana: 'Sem 8', matriculas2025: 55, matriculas2026: 65, acumulado2025: 353, acumulado2026: 434 },
  { semana: 'Sem 9', matriculas2025: 47, matriculas2026: 0, acumulado2025: 400, acumulado2026: 434 },
  { semana: 'Sem 10', matriculas2025: 52, matriculas2026: 0, acumulado2025: 452, acumulado2026: 434 },
];

export const metas: MetaAnual[] = [
  { ano: 2025, meta: 600, atual: 452 },
  { ano: 2026, meta: 650, atual: 434 },
];

export function calcularTendencia(dados: DadosSemana[]): string {
  const ultimasSemanas = dados.filter(d => d.matriculas2026 > 0).slice(-3);
  if (ultimasSemanas.length < 2) return 'estável';

  const crescimentos = [];
  for (let i = 1; i < ultimasSemanas.length; i++) {
    crescimentos.push(ultimasSemanas[i].matriculas2026 - ultimasSemanas[i-1].matriculas2026);
  }

  const mediaCrescimento = crescimentos.reduce((a, b) => a + b, 0) / crescimentos.length;

  if (mediaCrescimento > 5) return 'crescimento';
  if (mediaCrescimento < -5) return 'queda';
  return 'estável';
}

export function calcularPrevisao(dados: DadosSemana[], semanasRestantes: number): number {
  const dadosComMatriculas = dados.filter(d => d.matriculas2026 > 0);
  if (dadosComMatriculas.length === 0) return 0;

  const media = dadosComMatriculas.reduce((acc, d) => acc + d.matriculas2026, 0) / dadosComMatriculas.length;
  const atual = dadosComMatriculas[dadosComMatriculas.length - 1].acumulado2026;

  return Math.round(atual + (media * semanasRestantes));
}
