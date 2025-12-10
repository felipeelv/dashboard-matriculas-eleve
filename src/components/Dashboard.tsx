'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { dadosSemanais, metas, calcularTendencia, calcularPrevisao } from '@/data/matriculas';

function CardMetrica({
  titulo,
  valor,
  subtitulo,
  cor,
}: {
  titulo: string;
  valor: string | number;
  subtitulo: string;
  cor: string;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${cor}`}>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{titulo}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{valor}</p>
      <p className="text-gray-500 text-sm mt-1">{subtitulo}</p>
    </div>
  );
}

function CardTendencia({ tendencia }: { tendencia: string }) {
  const config = {
    crescimento: {
      cor: 'bg-green-100 text-green-800 border-green-500',
      icone: '↑',
      texto: 'Tendência de Crescimento',
    },
    queda: {
      cor: 'bg-red-100 text-red-800 border-red-500',
      icone: '↓',
      texto: 'Tendência de Queda',
    },
    estável: {
      cor: 'bg-yellow-100 text-yellow-800 border-yellow-500',
      icone: '→',
      texto: 'Tendência Estável',
    },
  }[tendencia] || { cor: 'bg-gray-100 text-gray-800 border-gray-500', icone: '?', texto: 'Indefinido' };

  return (
    <div className={`rounded-xl p-6 border-l-4 ${config.cor}`}>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{config.icone}</span>
        <div>
          <h3 className="font-semibold text-lg">{config.texto}</h3>
          <p className="text-sm opacity-75">Baseado nas últimas 3 semanas</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const tendencia = calcularTendencia(dadosSemanais);
  const previsao = calcularPrevisao(dadosSemanais, 12);
  const meta2026 = metas.find((m) => m.ano === 2026);
  const meta2025 = metas.find((m) => m.ano === 2025);

  const dadosComparativos = dadosSemanais.filter((d) => d.matriculas2026 > 0);
  const ultimosDados2026 = dadosComparativos[dadosComparativos.length - 1];
  const mesmosPeriodo2025 = dadosSemanais.find(
    (d) => d.semana === ultimosDados2026?.semana
  );

  const variacaoPercentual = mesmosPeriodo2025
    ? (((ultimosDados2026?.acumulado2026 || 0) - mesmosPeriodo2025.acumulado2025) /
        mesmosPeriodo2025.acumulado2025) *
      100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard de Matrículas</h1>
          <p className="text-blue-100 mt-2">Colégio Eleve - Comparativo 2025 vs 2026</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CardMetrica
            titulo="Matrículas 2026"
            valor={meta2026?.atual || 0}
            subtitulo={`Meta: ${meta2026?.meta || 0}`}
            cor="border-blue-500"
          />
          <CardMetrica
            titulo="Matrículas 2025"
            valor={meta2025?.atual || 0}
            subtitulo={`Meta: ${meta2025?.meta || 0}`}
            cor="border-gray-400"
          />
          <CardMetrica
            titulo="Variação"
            valor={`${variacaoPercentual >= 0 ? '+' : ''}${variacaoPercentual.toFixed(1)}%`}
            subtitulo="vs mesmo período 2025"
            cor={variacaoPercentual >= 0 ? 'border-green-500' : 'border-red-500'}
          />
          <CardMetrica
            titulo="Previsão 2026"
            valor={previsao}
            subtitulo="Estimativa final"
            cor="border-purple-500"
          />
        </div>

        {/* Card de tendência */}
        <div className="mb-8">
          <CardTendencia tendencia={tendencia} />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de barras - Matrículas por semana */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Matrículas por Semana
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosSemanais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="matriculas2025" name="2025" fill="#9CA3AF" />
                <Bar dataKey="matriculas2026" name="2026" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de linhas - Evolução acumulada */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Evolução Acumulada
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosSemanais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="acumulado2025"
                  name="Acumulado 2025"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="acumulado2026"
                  name="Acumulado 2026"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progresso das metas */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Progresso das Metas
          </h2>
          <div className="space-y-6">
            {metas.map((meta) => {
              const progresso = (meta.atual / meta.meta) * 100;
              return (
                <div key={meta.ano}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">Ano {meta.ano}</span>
                    <span className="text-gray-600">
                      {meta.atual} / {meta.meta} ({progresso.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        meta.ano === 2026 ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(progresso, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabela de dados */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Dados Detalhados
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-700">Semana</th>
                <th className="py-3 px-4 font-semibold text-gray-700">2025</th>
                <th className="py-3 px-4 font-semibold text-gray-700">2026</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Diferença</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Acum. 2025</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Acum. 2026</th>
              </tr>
            </thead>
            <tbody>
              {dadosSemanais.map((dados, index) => {
                const diferenca = dados.matriculas2026 - dados.matriculas2025;
                return (
                  <tr
                    key={dados.semana}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="py-3 px-4 font-medium">{dados.semana}</td>
                    <td className="py-3 px-4">{dados.matriculas2025}</td>
                    <td className="py-3 px-4">
                      {dados.matriculas2026 > 0 ? dados.matriculas2026 : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {dados.matriculas2026 > 0 ? (
                        <span
                          className={`font-medium ${
                            diferenca > 0
                              ? 'text-green-600'
                              : diferenca < 0
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {diferenca > 0 ? '+' : ''}
                          {diferenca}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4">{dados.acumulado2025}</td>
                    <td className="py-3 px-4">
                      {dados.matriculas2026 > 0 ? dados.acumulado2026 : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>Colégio Eleve - Dashboard de Matrículas</p>
          <p className="text-sm mt-1 text-gray-500">
            Dados atualizados automaticamente
          </p>
        </div>
      </footer>
    </div>
  );
}
