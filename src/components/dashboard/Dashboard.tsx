import { useMemo, useState } from 'react'
import { calculateTotals } from '../../lib/calculations'
import FinanceCard from './FinanceCard'
import VGCard from './VGCard'
import PlayerTable from './PlayerTable'
import type { Player, TeamConfig } from '../../types'

const LS_KEY = 'efm_include_fixed_costs'

interface Props {
  players: Player[]
  config: TeamConfig
  onEditPlayer: (player: Player) => void
  onDeletePlayer: (id: string) => void
  onStatusChange: (id: string, stato: Player['stato']) => void
}

export default function Dashboard({ players, config, onEditPlayer, onDeletePlayer, onStatusChange }: Props) {
  const [includeFixedCosts, setIncludeFixedCosts] = useState<boolean>(() => {
    const stored = localStorage.getItem(LS_KEY)
    return stored === null ? true : stored === 'true'
  })

  const toggleFixedCosts = () => {
    setIncludeFixedCosts(prev => {
      localStorage.setItem(LS_KEY, String(!prev))
      return !prev
    })
  }

  const calc = useMemo(
    () => calculateTotals(players, config, includeFixedCosts),
    [players, config, includeFixedCosts]
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FinanceCard
          config={config}
          calc={calc}
          includeFixedCosts={includeFixedCosts}
          onToggleFixedCosts={toggleFixedCosts}
        />
        <VGCard config={config} calc={calc} />
      </div>

      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30">
          Rosa · {players.length} giocatori
        </h2>
      </div>

      <PlayerTable
        players={players}
        onEditPlayer={onEditPlayer}
        onDeletePlayer={onDeletePlayer}
        onStatusChange={onStatusChange}
      />
    </div>
  )
}
