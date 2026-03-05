type View = 'dashboard' | 'playerForm' | 'teamSettings'

interface NavbarProps {
  teamName: string
  view: View
  onNavigate: (view: View) => void
}

export default function Navbar({ teamName, view, onNavigate }: NavbarProps) {
  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-10 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3"
          >
            <div className="bg-emerald-500 p-2 rounded-lg text-slate-900">
              <i className="fas fa-chart-line text-xl font-bold"></i>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              {teamName} Manager
            </span>
            <span className="font-bold text-xl tracking-tight sm:hidden">eF Manager</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                view === 'dashboard'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('teamSettings')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                view === 'teamSettings'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <i className="fas fa-cog"></i>
              <span className="hidden sm:inline">Impostazioni</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
