import type { Calculations, TeamConfig } from '../../types'

interface Props {
  config: TeamConfig
  calc: Calculations
}

export default function VGCard({ config, calc }: Props) {
  const isOverAny = calc.isOverVGNormali || calc.isOverVGTemporanei

  return (
    <div
      className={`p-5 rounded-2xl shadow-lg border ${
        isOverAny ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800 border-slate-700'
      }`}
    >
      <div className={`flex items-center gap-2 mb-4 ${isOverAny ? 'text-red-400' : 'text-blue-400'}`}>
        <i className="fas fa-chart-line text-xl"></i>
        <h2 className="text-xl font-bold">Valutazione Globale (VG)</h2>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm mb-1">Limite Max</p>
          <p className="text-2xl font-bold text-slate-200">{config.max_overall}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm mb-1">VG Normali</p>
          <p className={`text-2xl font-bold ${calc.isOverVGNormali ? 'text-red-400' : 'text-blue-400'}`}>
            {calc.vgNormali}
          </p>
        </div>
      </div>

      <div className="bg-slate-900/50 p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-amber-200 font-medium">VG Post-Mercato:</span>
          <span className={`text-2xl font-bold ${calc.isOverVGTemporanei ? 'text-red-400' : 'text-amber-400'}`}>
            {calc.vgTemporanei}
          </span>
        </div>
        {isOverAny && (
          <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Attenzione: hai superato il limite VG!</span>
          </div>
        )}
      </div>
    </div>
  )
}
