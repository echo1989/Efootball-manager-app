import type { Calculations, TeamConfig } from '../../types'

const MAX_PLAYERS = 23
const MIN_PT = 2

interface Props {
  config: TeamConfig
  calc: Calculations
}

function VGRow({
  label,
  vg,
  max,
  isOver,
}: {
  label: string
  vg: number
  max: number
  isOver: boolean
}) {
  const pct = Math.min(100, (vg / max) * 100)
  const delta = vg - max

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {isOver ? (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25 font-medium">
              +{delta} limite
            </span>
          ) : (
            <span className="text-[11px] text-white/20 tabular-nums">
              {delta} dal limite
            </span>
          )}
          <span className={`text-lg font-bold tabular-nums ${isOver ? 'text-red-400' : 'text-white'}`}>
            {vg}
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : 'bg-emerald-500/60'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function RosterRow({
  count,
  ptCount,
  checkPT = true,
}: {
  count: number
  ptCount: number
  checkPT?: boolean
}) {
  const isOverMax = count > MAX_PLAYERS
  const isUnderPT = checkPT && ptCount < MIN_PT
  const pct = Math.min(100, (count / MAX_PLAYERS) * 100)

  return (
    <div className="space-y-2 pt-1">
      {/* counts */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Rosa</span>
          {isUnderPT && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 font-medium flex items-center gap-1">
              <i className="fas fa-triangle-exclamation text-[9px]"></i>
              PT insufficienti
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] tabular-nums">
          <span className={isUnderPT ? 'text-amber-400 font-semibold' : 'text-white/25'}>
            {ptCount} PT
          </span>
          <span className="text-white/10">·</span>
          <span className={isOverMax ? 'text-red-400 font-bold' : 'text-white/40 font-medium'}>
            {count}
            <span className="text-white/20 font-normal"> / {MAX_PLAYERS}</span>
          </span>
        </div>
      </div>

      {/* bar */}
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isOverMax ? 'bg-red-500' : 'bg-white/20'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* over-max alert */}
      {isOverMax && (
        <p className="text-[11px] text-red-400/80 flex items-center gap-1">
          <i className="fas fa-triangle-exclamation text-[10px]"></i>
          Troppi giocatori: rimuovi {count - MAX_PLAYERS}
        </p>
      )}
    </div>
  )
}

export default function VGCard({ config, calc }: Props) {
  const hasVGAlert = calc.isOverVGNormali || calc.isOverVGTemporanei
  const hasRosterAlert =
    calc.countTemporanei > MAX_PLAYERS || calc.countPTTemporanei < MIN_PT

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#141420] to-[#0f0f1a] border border-white/[0.07] p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30">
          Valutazione Globale
        </h2>
        <span className="text-xs text-white/20">max {config.max_overall}</span>
      </div>

      <VGRow
        label="Normali"
        vg={calc.vgNormali}
        max={config.max_overall}
        isOver={calc.isOverVGNormali}
      />
      <RosterRow count={calc.countNormali} ptCount={calc.countPTNormali} checkPT={false} />

      <div className="border-t border-white/5" />

      <VGRow
        label="Post-Mercato"
        vg={calc.vgTemporanei}
        max={config.max_overall}
        isOver={calc.isOverVGTemporanei}
      />
      <RosterRow count={calc.countTemporanei} ptCount={calc.countPTTemporanei} />

      {(hasVGAlert || hasRosterAlert) && (
        <div className="space-y-1.5">
          {hasVGAlert && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/8 border border-red-500/15 rounded-xl px-3 py-2">
              <i className="fas fa-triangle-exclamation text-sm shrink-0"></i>
              <span>Hai superato il limite VG della tua squadra.</span>
            </div>
          )}
          {calc.countPTTemporanei < MIN_PT && (
            <div className="flex items-center gap-2 text-amber-400 text-xs bg-amber-500/8 border border-amber-500/15 rounded-xl px-3 py-2">
              <i className="fas fa-triangle-exclamation text-sm shrink-0"></i>
              <span>Servono almeno {MIN_PT} portieri in rosa.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
