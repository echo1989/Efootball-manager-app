import { useRef } from 'react'
import { formatNumber, parseCurrency } from '../../utils/format'
import type { TeamConfig } from '../../types'

interface Props {
  config: TeamConfig
  onSave: (updates: Partial<TeamConfig>) => void
  onCancel: () => void
}

export default function TeamSettingsForm({ config, onSave, onCancel }: Props) {
  const capitalRef = useRef<HTMLInputElement>(null)
  const stadiumRef = useRef<HTMLInputElement>(null)
  const canteraRef = useRef<HTMLInputElement>(null)

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    e.target.value = raw ? formatNumber(raw) : ''
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSave({
      name: fd.get('name') as string,
      capital: parseCurrency(capitalRef.current?.value ?? '0'),
      stadium_cost: parseCurrency(stadiumRef.current?.value ?? '0'),
      cantera_cost: parseCurrency(canteraRef.current?.value ?? '0'),
      max_overall: Number(fd.get('max_overall')),
    })
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <i className="fas fa-cog text-blue-400 text-2xl"></i>
        <h2 className="text-2xl font-bold">Impostazioni Squadra</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Nome Squadra</label>
          <input
            type="text"
            name="name"
            defaultValue={config.name}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Capitale Disponibile (€)
            </label>
            <input
              ref={capitalRef}
              type="text"
              inputMode="numeric"
              defaultValue={formatNumber(config.capital)}
              onChange={handleCurrencyInput}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Limite Overall Squadra
            </label>
            <input
              type="number"
              name="max_overall"
              defaultValue={config.max_overall}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Costo Gestione Stadio (€)
            </label>
            <input
              ref={stadiumRef}
              type="text"
              inputMode="numeric"
              defaultValue={formatNumber(config.stadium_cost)}
              onChange={handleCurrencyInput}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Costo Cantera (€)
            </label>
            <input
              ref={canteraRef}
              type="text"
              inputMode="numeric"
              defaultValue={formatNumber(config.cantera_cost)}
              onChange={handleCurrencyInput}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition flex justify-center items-center gap-2"
          >
            <i className="fas fa-check"></i> Salva Impostazioni
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
