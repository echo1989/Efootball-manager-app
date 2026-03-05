import type { Player } from '../../types'

const statusColors: Record<Player['stato'], string> = {
  'OK': 'text-emerald-400',
  'IN VENDITA': 'text-amber-400',
  'NUOVO ACQUISTO': 'text-blue-400',
  'VENDUTO': 'text-slate-500',
  'SVINCOLATO': 'text-slate-500',
}

interface Props {
  stato: Player['stato']
}

export default function StatusBadge({ stato }: Props) {
  return (
    <span className={`text-xs font-bold ${statusColors[stato]}`}>{stato}</span>
  )
}
