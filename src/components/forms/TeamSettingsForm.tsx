import { useRef } from 'react'
import { formatNumber, parseCurrency } from '../../utils/format'
import type { TeamConfig } from '../../types'

interface Props {
  config: TeamConfig
  onSave: (updates: Partial<TeamConfig>) => void
  onCancel: () => void
}

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-sky-500/50 focus:bg-white/[0.07] transition'
const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-white/30 mb-1.5'

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
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-white/30 hover:text-white/60 transition">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-lg font-bold text-white">Configurazione Squadra</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Squadra */}
        <section className="rounded-2xl bg-[#0f0f1a] border border-white/[0.07] p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Squadra</p>
          <div>
            <label className={labelCls}>Nome Squadra</label>
            <input type="text" name="name" defaultValue={config.name} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Limite Overall (VG Max)</label>
            <input type="number" name="max_overall" defaultValue={config.max_overall} required className={inputCls} />
          </div>
        </section>

        {/* Budget */}
        <section className="rounded-2xl bg-[#0f0f1a] border border-white/[0.07] p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Budget</p>
          <div>
            <label className={labelCls}>Capitale Disponibile (€)</label>
            <input
              ref={capitalRef}
              type="text"
              inputMode="numeric"
              defaultValue={formatNumber(config.capital)}
              onChange={handleCurrencyInput}
              required
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Costo Stadio (€)</label>
              <input
                ref={stadiumRef}
                type="text"
                inputMode="numeric"
                defaultValue={formatNumber(config.stadium_cost)}
                onChange={handleCurrencyInput}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Costo Cantera (€)</label>
              <input
                ref={canteraRef}
                type="text"
                inputMode="numeric"
                defaultValue={formatNumber(config.cantera_cost)}
                onChange={handleCurrencyInput}
                required
                className={inputCls}
              />
            </div>
          </div>
        </section>

        <div className="flex gap-3 pb-24 md:pb-0">
          <button
            type="submit"
            className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            Salva impostazioni
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 bg-white/5 hover:bg-white/10 text-white/60 font-semibold py-3 rounded-xl transition text-sm"
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  )
}
