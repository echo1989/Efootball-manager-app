import { useState } from 'react'
import { RUOLI, STATI } from '../../constants/football'
import { formatCurrency } from '../../utils/format'
import type { Player } from '../../types'

const RUOLO_ORDER: Record<string, number> = Object.fromEntries(RUOLI.map((r, i) => [r, i]))

const STATUS_META: Record<Player['stato'], { color: string; dot: string; label: string }> = {
  'OK':             { color: 'text-emerald-400', dot: 'bg-emerald-400',  label: 'OK' },
  'IN VENDITA':     { color: 'text-amber-400',   dot: 'bg-amber-400',    label: 'In vendita' },
  'NUOVO ACQUISTO': { color: 'text-sky-400',      dot: 'bg-sky-400',      label: 'Nuovo' },
  'VENDUTO':        { color: 'text-white/20',     dot: 'bg-white/20',     label: 'Venduto' },
  'SVINCOLATO':     { color: 'text-white/20',     dot: 'bg-orange-400/50', label: 'Svincolato' },
}

const STATUS_BORDER: Record<Player['stato'], string> = {
  'OK':             'border-l-emerald-500/60',
  'IN VENDITA':     'border-l-amber-400/60',
  'NUOVO ACQUISTO': 'border-l-sky-400/60',
  'VENDUTO':        'border-l-white/10',
  'SVINCOLATO':     'border-l-orange-400/30',
}

type SortKey = 'nome' | 'ruolo' | 'overall' | 'ingaggio'
type SortDir = 'asc' | 'desc'

interface Props {
  players: Player[]
  onEditPlayer: (player: Player) => void
  onDeletePlayer: (id: string) => void
  onStatusChange: (id: string, stato: Player['stato']) => void
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <i className="fas fa-sort text-white/15 ml-1 text-[9px]"></i>
  return dir === 'asc'
    ? <i className="fas fa-sort-up text-white/50 ml-1 text-[9px]"></i>
    : <i className="fas fa-sort-down text-white/50 ml-1 text-[9px]"></i>
}

export default function PlayerTable({ players, onEditPlayer, onDeletePlayer, onStatusChange }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('ruolo')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...players].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'nome') {
      cmp = a.nome.localeCompare(b.nome, 'it')
    } else if (sortKey === 'ruolo') {
      cmp = (RUOLO_ORDER[a.ruolo] ?? 99) - (RUOLO_ORDER[b.ruolo] ?? 99)
    } else if (sortKey === 'overall') {
      cmp = a.overall - b.overall
    } else if (sortKey === 'ingaggio') {
      cmp = a.ingaggio - b.ingaggio
    }
    return sortDir === 'asc' ? cmp : -cmp
  })

  if (players.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#0f0f1a] flex flex-col items-center justify-center py-16 gap-3 text-white/20">
        <i className="fas fa-users text-4xl"></i>
        <p className="text-sm">Nessun giocatore in rosa</p>
      </div>
    )
  }

  const thCls = (key: SortKey) =>
    `px-4 py-3 font-medium cursor-pointer select-none hover:text-white/50 transition ${sortKey === key ? 'text-white/40' : ''}`

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0f0f1a] overflow-hidden">
      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-white/5">
        {sorted.map(p => {
          const meta = STATUS_META[p.stato]
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-4 py-3 border-l-2 ${STATUS_BORDER[p.stato]}`}
            >
              {/* Role badge */}
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white/60">{p.ruolo}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{p.nome}</p>
                <p className="text-[11px] text-white/30 truncate">{p.stile} · {p.eta}a · {p.piede}</p>
              </div>

              {/* VG */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-white">{p.overall}</p>
                {p.stato === 'VENDUTO' && p.costo_svincolo > 0
                  ? <p className="text-[11px] text-emerald-400 font-semibold">+{formatCurrency(p.costo_svincolo)}</p>
                  : p.stato === 'NUOVO ACQUISTO' && p.costo_svincolo > 0
                  ? <p className="text-[11px] text-red-400 font-semibold">-{formatCurrency(p.costo_svincolo)}</p>
                  : <p className="text-[11px] text-white/25">{formatCurrency(p.ingaggio)}</p>
                }
              </div>

              {/* Status select */}
              <select
                value={p.stato}
                onChange={e => onStatusChange(p.id, e.target.value as Player['stato'])}
                className={`text-[10px] font-semibold bg-transparent border-0 outline-none cursor-pointer ${meta.color} shrink-0`}
              >
                {STATI.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button onClick={() => onEditPlayer(p)} className="text-white/20 hover:text-white/60 transition text-sm">
                  <i className="fas fa-pen"></i>
                </button>
                <button onClick={() => onDeletePlayer(p.id)} className="text-white/20 hover:text-red-400 transition text-sm">
                  <i className="fas fa-xmark"></i>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-white/20 border-b border-white/5">
              <th className="px-5 py-3 text-left font-medium w-4"></th>
              <th className={`${thCls('nome')} text-left`} onClick={() => handleSort('nome')}>
                Giocatore <SortIcon active={sortKey === 'nome'} dir={sortDir} />
              </th>
              <th className={`${thCls('ruolo')} text-center`} onClick={() => handleSort('ruolo')}>
                Ruolo <SortIcon active={sortKey === 'ruolo'} dir={sortDir} />
              </th>
              <th className={`${thCls('overall')} text-center`} onClick={() => handleSort('overall')}>
                VG <SortIcon active={sortKey === 'overall'} dir={sortDir} />
              </th>
              <th className={`${thCls('ingaggio')} text-left`} onClick={() => handleSort('ingaggio')}>
                Ingaggio <SortIcon active={sortKey === 'ingaggio'} dir={sortDir} />
              </th>
              <th className="px-4 py-3 text-left font-medium">Stato</th>
              <th className="px-4 py-3 text-center font-medium">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {sorted.map(p => {
              const meta = STATUS_META[p.stato]
              return (
                <tr key={p.id} className={`group border-l-2 ${STATUS_BORDER[p.stato]} hover:bg-white/[0.02] transition`}>
                  <td className="pl-3 pr-0 py-3.5">
                    <span className={`block w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-white">{p.nome}</p>
                    <p className="text-[11px] text-white/30">{p.stile} · {p.eta} anni · {p.piede}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 text-xs font-bold text-white/50">
                      {p.ruolo}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-white">{p.overall}</td>
                  <td className="px-4 py-3.5 text-white/50 tabular-nums">
                    <p>{formatCurrency(p.ingaggio)}</p>
                    {p.costo_svincolo > 0 && (() => {
                      if (p.stato === 'VENDUTO') return (
                        <p className="text-[11px] text-emerald-400 font-semibold">
                          Vendita +{formatCurrency(p.costo_svincolo)}
                        </p>
                      )
                      if (p.stato === 'SVINCOLATO') return (
                        <p className="text-[11px] text-orange-400/70">
                          Penale -{formatCurrency(p.costo_svincolo)}
                        </p>
                      )
                      if (p.stato === 'NUOVO ACQUISTO') return (
                        <p className="text-[11px] text-red-400 font-semibold">
                          Acquisto -{formatCurrency(p.costo_svincolo)}
                        </p>
                      )
                      return (
                        <p className="text-[11px] text-white/25">
                          Clausola: {formatCurrency(p.costo_svincolo)}
                        </p>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      value={p.stato}
                      onChange={e => onStatusChange(p.id, e.target.value as Player['stato'])}
                      className={`text-xs font-semibold bg-transparent border-0 outline-none cursor-pointer ${meta.color}`}
                    >
                      {STATI.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => onEditPlayer(p)} className="text-white/30 hover:text-white transition">
                        <i className="fas fa-pen text-xs"></i>
                      </button>
                      <button onClick={() => onDeletePlayer(p.id)} className="text-white/30 hover:text-red-400 transition">
                        <i className="fas fa-xmark"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
