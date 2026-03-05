import { STATI } from '../../constants/football'
import { formatCurrency } from '../../utils/format'
import type { Player } from '../../types'

const statusColors: Record<Player['stato'], string> = {
  'OK': 'text-emerald-400',
  'IN VENDITA': 'text-amber-400',
  'NUOVO ACQUISTO': 'text-blue-400',
  'VENDUTO': 'text-slate-500',
  'SVINCOLATO': 'text-slate-500',
}

interface Props {
  players: Player[]
  onAddPlayer: () => void
  onEditPlayer: (player: Player) => void
  onDeletePlayer: (id: string) => void
  onStatusChange: (id: string, stato: Player['stato']) => void
}

export default function PlayerTable({
  players,
  onAddPlayer,
  onEditPlayer,
  onDeletePlayer,
  onStatusChange,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-users text-lg"></i> Rosa Giocatori ({players.length})
        </h2>
        <button
          onClick={onAddPlayer}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          <i className="fas fa-plus"></i> Aggiungi
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-3 font-medium">Giocatore</th>
              <th className="p-3 font-medium text-center">Ruolo</th>
              <th className="p-3 font-medium text-center">VG</th>
              <th className="p-3 font-medium">Ingaggio</th>
              <th className="p-3 font-medium">Stato</th>
              <th className="p-3 font-medium text-center">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-sm">
            {players.map(player => (
              <tr key={player.id} className="hover:bg-slate-700/30 transition">
                <td className="p-3">
                  <div className="font-bold text-slate-200">{player.nome}</div>
                  <div className="text-xs text-slate-400">
                    {player.eta} anni • {player.piede} • {player.stile}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold">
                    {player.ruolo}
                  </span>
                </td>
                <td className="p-3 text-center font-bold text-blue-400">{player.overall}</td>
                <td className="p-3 text-slate-300">
                  <div>{formatCurrency(player.ingaggio)}</div>
                  {player.stato === 'SVINCOLATO' && player.costo_svincolo > 0 && (
                    <div className="text-xs text-red-400">
                      Penale: {formatCurrency(player.costo_svincolo)}
                    </div>
                  )}
                  {player.stato !== 'SVINCOLATO' && player.costo_svincolo > 0 && (
                    <div className="text-xs text-slate-500">
                      Clausola: {formatCurrency(player.costo_svincolo)}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <select
                    value={player.stato}
                    onChange={e => onStatusChange(player.id, e.target.value as Player['stato'])}
                    className={`bg-slate-900 border border-slate-600 rounded-lg text-xs p-1.5 font-medium focus:ring-emerald-500 focus:border-emerald-500 outline-none ${statusColors[player.stato]}`}
                  >
                    {STATI.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-3 text-lg">
                    <button
                      onClick={() => onEditPlayer(player)}
                      className="text-slate-400 hover:text-white transition"
                      title="Modifica"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => onDeletePlayer(player.id)}
                      className="text-slate-400 hover:text-red-400 transition"
                      title="Elimina"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Nessun giocatore in rosa. Aggiungine uno!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
