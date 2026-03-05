import { formatCurrency } from '../../utils/format'
import type { Calculations, TeamConfig } from '../../types'

interface Props {
  config: TeamConfig
  calc: Calculations
  includeFixedCosts: boolean
  onToggleFixedCosts: () => void
}

function BudgetBar({
  config,
  calc,
  mode,
  includeFixedCosts,
}: {
  config: TeamConfig
  calc: Calculations
  mode: 'normal' | 'temp'
  includeFixedCosts: boolean
}) {
  // In Post-Mercato the sale income expands the effective budget
  const effectiveTotal = config.capital + (mode === 'temp' ? calc.ricaviVendite : 0)
  const fixed = includeFixedCosts ? config.stadium_cost + config.cantera_cost : 0
  const svincolo = mode === 'temp' ? calc.costiSvincolo : 0
  const acquisti = mode === 'temp' ? calc.costiAcquisti : 0
  const salari = mode === 'normal' ? calc.salariNormali / 2 : calc.salariTemporanei / 2
  const available = mode === 'normal' ? calc.capitaleNormale : calc.capitaleTemporaneo

  const pFixed    = Math.max(0, Math.min(100, (fixed    / effectiveTotal) * 100))
  const pSvincolo = Math.max(0, Math.min(100, (svincolo / effectiveTotal) * 100))
  const pAcquisti = Math.max(0, Math.min(100, (acquisti / effectiveTotal) * 100))
  const pSalari   = Math.max(0, Math.min(100, (salari   / effectiveTotal) * 100))
  const pAvail    = Math.max(0, (available / effectiveTotal) * 100)
  const isOver    = available < 0

  return (
    <div className="space-y-1.5">
      <div className="flex h-2 rounded-full overflow-hidden bg-white/5 gap-px">
        {pFixed > 0 && (
          <div className="bg-red-500/60 transition-all duration-300" style={{ width: `${pFixed}%` }} title="Spese fisse" />
        )}
        {pSvincolo > 0 && (
          <div className="bg-orange-500/70 transition-all duration-300" style={{ width: `${pSvincolo}%` }} title="Svincoli" />
        )}
        {pAcquisti > 0 && (
          <div className="bg-red-400/50 transition-all duration-300" style={{ width: `${pAcquisti}%` }} title="Acquisti" />
        )}
        <div className="bg-amber-400/60 transition-all duration-300" style={{ width: `${pSalari}%` }} title="Ingaggi ÷2" />
        {!isOver && (
          <div className="bg-emerald-500/50 transition-all duration-300" style={{ width: `${pAvail}%` }} title="Disponibile" />
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-white/30">
          {isOver ? 'Deficit' : 'Disponibile'}
        </span>
        <span className={`text-sm font-bold tabular-nums ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>
          {formatCurrency(available)}
        </span>
      </div>
    </div>
  )
}

export default function FinanceCard({ config, calc, includeFixedCosts, onToggleFixedCosts }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#141420] to-[#0f0f1a] border border-white/[0.07] p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30">Finanze</h2>
        <span className="text-xs text-white/20">{formatCurrency(config.capital)}</span>
      </div>

      {/* Spese fisse pills + toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Spese fisse</span>
          <button
            onClick={onToggleFixedCosts}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition ${
              includeFixedCosts
                ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                : 'bg-white/5 text-white/25 border-white/10 hover:bg-white/10'
            }`}
            title={includeFixedCosts ? 'Escludi dalle spese' : 'Includi nelle spese'}
          >
            <i className={`fas ${includeFixedCosts ? 'fa-toggle-on' : 'fa-toggle-off'} text-sm`}></i>
            {includeFixedCosts ? 'incluse' : 'escluse'}
          </button>
        </div>

        <div className={`flex gap-2 flex-wrap transition-opacity ${includeFixedCosts ? 'opacity-100' : 'opacity-30'}`}>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            Stadio -{formatCurrency(config.stadium_cost)}
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            Cantera -{formatCurrency(config.cantera_cost)}
          </span>
        </div>
      </div>

      {/* Normali */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40 font-medium">Normali</span>
          <span className="text-[11px] text-white/25 tabular-nums">
            ingaggi {formatCurrency(calc.salariNormali)} ÷2
          </span>
        </div>
        <BudgetBar config={config} calc={calc} mode="normal" includeFixedCosts={includeFixedCosts} />
      </div>

      <div className="border-t border-white/5" />

      {/* Post-Mercato */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40 font-medium">Post-Mercato</span>
          <span className="text-[11px] text-white/25 tabular-nums">
            ingaggi {formatCurrency(calc.salariTemporanei)} ÷2
          </span>
        </div>

        {/* Operazioni di mercato */}
        {(calc.ricaviVendite > 0 || calc.costiAcquisti > 0 || calc.costiSvincolo > 0) && (
          <div className="flex gap-2 flex-wrap">
            {calc.ricaviVendite > 0 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <i className="fas fa-arrow-trend-up text-[10px]"></i>
                Vendite +{formatCurrency(calc.ricaviVendite)}
              </span>
            )}
            {calc.costiAcquisti > 0 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                <i className="fas fa-arrow-trend-down text-[10px]"></i>
                Acquisti -{formatCurrency(calc.costiAcquisti)}
              </span>
            )}
            {calc.costiSvincolo > 0 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                <i className="fas fa-link-slash text-[10px]"></i>
                Svincoli -{formatCurrency(calc.costiSvincolo)}
              </span>
            )}
          </div>
        )}

        <BudgetBar config={config} calc={calc} mode="temp" includeFixedCosts={includeFixedCosts} />
      </div>
    </div>
  )
}
