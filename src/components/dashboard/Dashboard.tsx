import { useMemo } from 'react'
import { calculateTotals } from '../../lib/calculations'
import FinanceCard from './FinanceCard'
import VGCard from './VGCard'
import PlayerTable from './PlayerTable'
import type { Player, TeamConfig } from '../../types'

interface Props {
  players: Player[]
  config: TeamConfig
  onAddPlayer: () => void
  onEditPlayer: (player: Player) => void
  onDeletePlayer: (id: string) => void
  onStatusChange: (id: string, stato: Player['stato']) => void
}

export default function Dashboard({
  players,
  config,
  onAddPlayer,
  onEditPlayer,
  onDeletePlayer,
  onStatusChange,
}: Props) {
  const calc = useMemo(() => calculateTotals(players, config), [players, config])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FinanceCard config={config} calc={calc} />
        <VGCard config={config} calc={calc} />
      </div>
      <PlayerTable
        players={players}
        onAddPlayer={onAddPlayer}
        onEditPlayer={onEditPlayer}
        onDeletePlayer={onDeletePlayer}
        onStatusChange={onStatusChange}
      />
    </div>
  )
}
