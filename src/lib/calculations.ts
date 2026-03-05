import type { Player, TeamConfig, Calculations } from '../types'

export function calculateTotals(players: Player[], config: TeamConfig): Calculations {
  const normali = players.filter(p =>
    ['OK', 'IN VENDITA', 'VENDUTO', 'SVINCOLATO'].includes(p.stato)
  )
  const temporanei = players.filter(p =>
    ['OK', 'IN VENDITA', 'NUOVO ACQUISTO'].includes(p.stato)
  )

  // SVINCOLATO ha ingaggio 0, ma paga penale costo_svincolo
  const salariNormali = normali.reduce((s, p) =>
    s + (p.stato === 'SVINCOLATO' ? 0 : p.ingaggio), 0
  )
  const salariTemporanei = temporanei.reduce((s, p) => s + p.ingaggio, 0)

  // Penali svincolo (solo SVINCOLATO)
  const costiSvincolo = players
    .filter(p => p.stato === 'SVINCOLATO')
    .reduce((s, p) => s + p.costo_svincolo, 0)

  const speseFisse = config.stadium_cost + config.cantera_cost

  const capitaleNormale = config.capital - speseFisse - costiSvincolo - salariNormali / 2
  const capitaleTemporaneo = config.capital - speseFisse - costiSvincolo - salariTemporanei / 2

  const vgNormali = normali.reduce((s, p) => s + p.overall, 0)
  const vgTemporanei = temporanei.reduce((s, p) => s + p.overall, 0)

  return {
    salariNormali,
    salariTemporanei,
    costiSvincolo,
    capitaleNormale,
    capitaleTemporaneo,
    vgNormali,
    vgTemporanei,
    isOverVGNormali: vgNormali > config.max_overall,
    isOverVGTemporanei: vgTemporanei > config.max_overall,
  }
}
