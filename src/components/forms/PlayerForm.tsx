import { useRef, useState } from 'react'
import { RUOLI, STILI_GIOCO, STATI } from '../../constants/football'
import { formatNumber, parseCurrency } from '../../utils/format'
import type { Player } from '../../types'

type PlayerInput = Omit<Player, 'id' | 'created_at' | 'updated_at'>

interface Props {
  player?: Player | null
  onSave: (data: PlayerInput) => void
  onCancel: () => void
}

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition'
const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-white/30 mb-1.5'

type CostoMeta = {
  label: string
  hint: string
  hintColor: string
  inputBorder: string
}

function getCostoMeta(stato: Player['stato']): CostoMeta {
  switch (stato) {
    case 'VENDUTO':
      return {
        label: 'Prezzo di Vendita (€)',
        hint: 'Entrata nel bilancio Post-Mercato',
        hintColor: 'text-emerald-400',
        inputBorder: 'focus:border-emerald-500/50',
      }
    case 'SVINCOLATO':
      return {
        label: 'Penale Svincolo (€)',
        hint: 'Uscita immediata dal bilancio',
        hintColor: 'text-orange-400',
        inputBorder: 'focus:border-orange-500/50',
      }
    case 'NUOVO ACQUISTO':
      return {
        label: 'Costo Acquisto (€)',
        hint: 'Uscita nel bilancio Post-Mercato',
        hintColor: 'text-red-400',
        inputBorder: 'focus:border-red-500/50',
      }
    default:
      return {
        label: 'Clausola (€)',
        hint: '',
        hintColor: '',
        inputBorder: 'focus:border-emerald-500/50',
      }
  }
}

export default function PlayerForm({ player, onSave, onCancel }: Props) {
  const ingaggioRef = useRef<HTMLInputElement>(null)
  const costoRef = useRef<HTMLInputElement>(null)
  const [stato, setStato] = useState<Player['stato']>(player?.stato ?? 'OK')

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    e.target.value = raw ? formatNumber(raw) : ''
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSave({
      nome: fd.get('nome') as string,
      ruolo: fd.get('ruolo') as string,
      eta: Number(fd.get('eta')),
      overall: Number(fd.get('overall')),
      piede: fd.get('piede') as 'Dx' | 'Sx',
      stile: fd.get('stile') as string,
      ingaggio: parseCurrency(ingaggioRef.current?.value ?? '0'),
      costo_svincolo: parseCurrency(costoRef.current?.value ?? '0'),
      stato,
    })
  }

  const costoMeta = getCostoMeta(stato)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="text-white/30 hover:text-white/60 transition">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-lg font-bold text-white">
          {player ? 'Modifica Giocatore' : 'Nuovo Giocatore'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identità */}
        <section className="rounded-2xl bg-[#0f0f1a] border border-white/[0.07] p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Identità</p>

          <div>
            <label className={labelCls}>Nome</label>
            <input type="text" name="nome" defaultValue={player?.nome} required placeholder="Es. L. Modrić" className={inputCls} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Ruolo</label>
              <select name="ruolo" defaultValue={player?.ruolo ?? 'DC'} className={inputCls}>
                {RUOLI.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Overall</label>
              <input type="number" name="overall" defaultValue={player?.overall ?? 75} min={1} max={99} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Età</label>
              <input type="number" name="eta" defaultValue={player?.eta ?? 22} min={15} max={45} required className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Piede</label>
              <select name="piede" defaultValue={player?.piede ?? 'Dx'} className={inputCls}>
                <option value="Dx">Destro</option>
                <option value="Sx">Sinistro</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Stile</label>
              <select name="stile" defaultValue={player?.stile ?? 'Nessuno'} className={inputCls}>
                {STILI_GIOCO.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Contratto */}
        <section className="rounded-2xl bg-[#0f0f1a] border border-white/[0.07] p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Contratto</p>

          <div>
            <label className={labelCls}>Stato Mercato</label>
            <select
              name="stato"
              value={stato}
              onChange={e => setStato(e.target.value as Player['stato'])}
              className={inputCls}
            >
              {STATI.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Ingaggio (€)</label>
              <input
                ref={ingaggioRef}
                type="text"
                inputMode="numeric"
                defaultValue={formatNumber(player?.ingaggio ?? 0)}
                onChange={handleCurrencyInput}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>{costoMeta.label}</label>
              <input
                ref={costoRef}
                type="text"
                inputMode="numeric"
                defaultValue={formatNumber(player?.costo_svincolo ?? 0)}
                onChange={handleCurrencyInput}
                required
                className={`${inputCls} ${costoMeta.inputBorder}`}
              />
              {costoMeta.hint && (
                <p className={`mt-1.5 text-[11px] font-medium flex items-center gap-1 ${costoMeta.hintColor}`}>
                  {stato === 'VENDUTO' && <i className="fas fa-arrow-trend-up text-[10px]"></i>}
                  {stato === 'SVINCOLATO' && <i className="fas fa-triangle-exclamation text-[10px]"></i>}
                  {stato === 'NUOVO ACQUISTO' && <i className="fas fa-arrow-trend-down text-[10px]"></i>}
                  {costoMeta.hint}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3 pb-24 md:pb-0">
          <button
            type="submit"
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            {player ? 'Salva modifiche' : 'Aggiungi alla rosa'}
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
