type View = 'dashboard' | 'playerForm' | 'teamSettings'

interface NavbarProps {
  teamName: string
  view: View
  onNavigate: (view: View) => void
  onAddPlayer: () => void
}

export default function Navbar({ teamName, view, onNavigate, onAddPlayer }: NavbarProps) {
  return (
    <>
      {/* Top bar — desktop */}
      <header className="hidden md:flex sticky top-0 z-20 items-center justify-between px-6 h-14 bg-[#08080f]/90 backdrop-blur border-b border-white/5">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <i className="fas fa-shield-halved text-xs text-white"></i>
          </div>
          <span className="font-semibold text-sm text-white/80 group-hover:text-white transition">
            {teamName}
          </span>
        </button>

        <nav className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              view === 'dashboard'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Rosa
          </button>
          <button
            onClick={onAddPlayer}
            className="px-4 py-1.5 rounded-lg text-sm font-medium text-white/40 hover:text-white/70 transition"
          >
            + Giocatore
          </button>
          <button
            onClick={() => onNavigate('teamSettings')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              view === 'teamSettings'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <i className="fas fa-sliders text-xs mr-1.5"></i>Impostazioni
          </button>
        </nav>
      </header>

      {/* Top minimal bar — mobile */}
      <header className="md:hidden flex items-center justify-between px-4 h-12 bg-[#08080f]/90 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <i className="fas fa-shield-halved text-[10px] text-white"></i>
          </div>
          <span className="font-semibold text-sm text-white/70 truncate max-w-[160px]">{teamName}</span>
        </div>
      </header>

      {/* Bottom tab bar — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex items-center bg-[#0e0e18]/95 backdrop-blur border-t border-white/5 pb-safe">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition ${
            view === 'dashboard' ? 'text-emerald-400' : 'text-white/30 hover:text-white/60'
          }`}
        >
          <i className="fas fa-users text-base"></i>
          Rosa
        </button>
        <button
          onClick={onAddPlayer}
          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium text-white/30 hover:text-white/60 transition"
        >
          <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center mb-0.5">
            <i className="fas fa-plus text-white text-xs"></i>
          </span>
        </button>
        <button
          onClick={() => onNavigate('teamSettings')}
          className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition ${
            view === 'teamSettings' ? 'text-emerald-400' : 'text-white/30 hover:text-white/60'
          }`}
        >
          <i className="fas fa-sliders text-base"></i>
          Config
        </button>
      </nav>
    </>
  )
}
