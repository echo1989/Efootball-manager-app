import { useRef } from 'react'
import { RUOLI, STILI_GIOCO, STATI } from '../../constants/football'
import { formatNumber, parseCurrency } from '../../utils/format'
import type { Player } from '../../types'

type PlayerInput = Omit<Player, 'id' | 'created_at' | 'updated_at'>

interface Props {
  player?: Player | null
  onSave: (data: PlayerInput) => void
  onCancel: () => void
}

export default function PlayerForm({ player, onSave, onCancel }: Props) {
  const ingaggioRef = useRef<HTMLInputElement>(null)
  const costoRef = useRef<HTMLInputElement>(null)

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    e.target.value = raw ? formatNumber(raw) : ''
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    onSave({
      nome: fd.get('nome') as string,
      ruolo: fd.get('ruolo') as string,
      eta: Number(fd.get('eta')),
      overall: Number(fd.get('overall')),
      piede: fd.get('piede') as 'Dx' | 'Sx',
      stile: fd.get('stile') as string,
      ingaggio: parseCurrency(ingaggioRef.current?.value ?? '0'),
      costo_svincolo: parseCurrency(costoRef.current?.value ?? '0'),
      stato: fd.get('stato') as Player['stato'],
    })
  }

  return (
    <div className="max-w-3xl mx-auto bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <i className="fas fa-users text-emerald-400 text-2xl"></i>
        <h2 className="text-2xl font-bold">
          {player ? 'Modifica Giocatore' : 'Nuovo Giocatore'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-400 mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              defaultValue={player?.nome}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Ruolo</label>
            <select
              name="ruolo"
              defaultValue={player?.ruolo ?? 'DC'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {RUOLI.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Overall (VG)</label>
            <input
              type="number"
              name="overall"
              defaultValue={player?.overall ?? 70}
              min={1}
              max={99}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Età</label>
            <input
              type="number"
              name="eta"
              defaultValue={player?.eta ?? 20}
              min={15}
              max={45}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Piede Preferito</label>
            <select
              name="piede"
              defaultValue={player?.piede ?? 'Dx'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Dx">Destro (Dx)</option>
              <option value="Sx">Sinistro (Sx)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1">Stile Giocatore</label>
            <select
              name="stile"
              defaultValue={player?.stile ?? 'Nessuno'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {STILI_GIOCO.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Ingaggio (€)</label>
            <input
              ref={ingaggioRef}
              type="text"
              inputMode="numeric"
              name="ingaggio_display"
              defaultValue={formatNumber(player?.ingaggio ?? 0)}
              onChange={handleCurrencyInput}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              {player?.stato === 'SVINCOLATO' ? 'Penale Svincolo (€)' : 'Clausola Rescissoria (€)'}
            </label>
            <input
              ref={costoRef}
              type="text"
              inputMode="numeric"
              name="costo_svincolo_display"
              defaultValue={formatNumber(player?.costo_svincolo ?? 0)}
              onChange={handleCurrencyInput}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Stato Mercato</label>
            <select
              name="stato"
              defaultValue={player?.stato ?? 'OK'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-bold text-amber-400 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {STATI.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-lg font-bold transition flex justify-center items-center gap-2"
          >
            <i className="fas fa-check"></i> {player ? 'Salva Modifiche' : 'Aggiungi in Rosa'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg font-bold transition"
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  )
}
