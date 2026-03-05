import type { Player, TeamConfig, Calculations } from '../types'

export function calculateTotals(players: Player[], config: TeamConfig, includeFixedCosts = true): Calculations {
  const normali = players.filter(p =>
    ['OK', 'IN VENDITA', 'VENDUTO', 'SVINCOLATO'].includes(p.stato)
  )
  const temporanei = players.filter(p =>
    ['OK', 'IN VENDITA', 'NUOVO ACQUISTO'].includes(p.stato)
  )

  // SVINCOLATO ha ingaggio 0, la penale è tracciata in costiSvincolo
  const salariNormali = normali.reduce((s, p) =>
    s + (p.stato === 'SVINCOLATO' ? 0 : p.ingaggio), 0
  )
  const salariTemporanei = temporanei.reduce((s, p) => s + p.ingaggio, 0)

  // Penali svincolo (solo SVINCOLATO) → uscita in entrambi i conteggi
  const costiSvincolo = players
    .filter(p => p.stato === 'SVINCOLATO')
    .reduce((s, p) => s + p.costo_svincolo, 0)

  // Ricavi da vendite (solo VENDUTO) → entrata nel Post-Mercato
  const ricaviVendite = players
    .filter(p => p.stato === 'VENDUTO')
    .reduce((s, p) => s + p.costo_svincolo, 0)

  // Costi acquisti (solo NUOVO ACQUISTO) → uscita nel Post-Mercato
  const costiAcquisti = players
    .filter(p => p.stato === 'NUOVO ACQUISTO')
    .reduce((s, p) => s + p.costo_svincolo, 0)

  const speseFisse = includeFixedCosts ? config.stadium_cost + config.cantera_cost : 0

  const capitaleNormale = config.capital - speseFisse - salariNormali / 2
  const capitaleTemporaneo = config.capital - speseFisse - costiSvincolo - salariTemporanei / 2 + ricaviVendite - costiAcquisti

  const vgNormali = normali.reduce((s, p) => s + p.overall, 0)
  const vgTemporanei = temporanei.reduce((s, p) => s + p.overall, 0)

  const countNormali = normali.length
  const countPTNormali = normali.filter(p => p.ruolo === 'PT').length
  const countTemporanei = temporanei.length
  const countPTTemporanei = temporanei.filter(p => p.ruolo === 'PT').length

  return {
    salariNormali,
    salariTemporanei,
    costiSvincolo,
    ricaviVendite,
    costiAcquisti,
    capitaleNormale,
    capitaleTemporaneo,
    vgNormali,
    vgTemporanei,
    isOverVGNormali: vgNormali > config.max_overall,
    isOverVGTemporanei: vgTemporanei > config.max_overall,
    countNormali,
    countPTNormali,
    countTemporanei,
    countPTTemporanei,
  }
}
