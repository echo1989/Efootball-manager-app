export interface Player {
  id: string
  nome: string
  ruolo: string
  eta: number
  overall: number
  piede: 'Dx' | 'Sx'
  stile: string
  ingaggio: number
  costo_svincolo: number
  stato: 'OK' | 'IN VENDITA' | 'VENDUTO' | 'SVINCOLATO' | 'NUOVO ACQUISTO'
  created_at?: string
  updated_at?: string
}

export interface TeamConfig {
  id?: string
  name: string
  capital: number
  stadium_cost: number
  cantera_cost: number
  max_overall: number
  updated_at?: string
}

export interface Calculations {
  salariNormali: number
  salariTemporanei: number
  costiSvincolo: number
  capitaleNormale: number
  capitaleTemporaneo: number
  vgNormali: number
  vgTemporanei: number
  isOverVGNormali: boolean
  isOverVGTemporanei: boolean
}
