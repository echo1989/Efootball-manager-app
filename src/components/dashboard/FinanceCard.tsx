import { formatCurrency } from '../../utils/format'
import type { Calculations, TeamConfig } from '../../types'

interface Props {
  config: TeamConfig
  calc: Calculations
}

export default function FinanceCard({ config, calc }: Props) {
  return (
    <div className="bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-700">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <i className="fas fa-dollar-sign text-xl"></i>
        <h2 className="text-xl font-bold">Resoconto Finanziario</h2>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Capitale Iniziale:</span>
          <span>{formatCurrency(config.capital)}</span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>Spese Fisse (Stadio + Cantera):</span>
          <span className="text-red-400">-{formatCurrency(config.stadium_cost + config.cantera_cost)}</span>
        </div>

        {calc.costiSvincolo > 0 && (
          <div className="flex justify-between text-slate-400">
            <span>Costi di Svincolo:</span>
            <span className="text-red-400 font-medium">-{formatCurrency(calc.costiSvincolo)}</span>
          </div>
        )}

        <div className="h-px bg-slate-700 my-2" />

        {/* Normali */}
        <div className="flex justify-between items-center text-slate-300">
          <span>Ingaggi Normali (÷2):</span>
          <span className="font-semibold">{formatCurrency(calc.salariNormali)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Capitale Disp. (Normali):</span>
          <span className={`font-bold text-lg ${calc.capitaleNormale >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(calc.capitaleNormale)}
          </span>
        </div>

        <div className="h-px bg-slate-700 my-2 border-dashed border-t" />

        {/* Temporanei */}
        <div className="flex justify-between items-center text-amber-200">
          <span>Ingaggi Post-Mercato (÷2):</span>
          <span>{formatCurrency(calc.salariTemporanei)}</span>
        </div>
        <div className="flex justify-between items-center text-amber-200">
          <span className="font-medium">Capitale Disp. (Post-Mercato):</span>
          <span className={`font-bold text-lg ${calc.capitaleTemporaneo >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
            {formatCurrency(calc.capitaleTemporaneo)}
          </span>
        </div>
      </div>
    </div>
  )
}
