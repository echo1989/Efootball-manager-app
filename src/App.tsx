import { useState } from 'react'
import { usePlayers } from './hooks/usePlayers'
import { useTeamConfig } from './hooks/useTeamConfig'
import Navbar from './components/layout/Navbar'
import Dashboard from './components/dashboard/Dashboard'
import PlayerForm from './components/forms/PlayerForm'
import TeamSettingsForm from './components/forms/TeamSettingsForm'
import Modal from './components/ui/Modal'
import type { Player, TeamConfig } from './types'

type View = 'dashboard' | 'playerForm' | 'teamSettings'

export default function App() {
  const { players, loading: playersLoading, addPlayer, updatePlayer, deletePlayer, updateStatus } = usePlayers()
  const { config, loading: configLoading, saveConfig } = useTeamConfig()

  const [view, setView] = useState<View>('dashboard')
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loading = playersLoading || configLoading

  const handleAddPlayer = () => {
    setEditingPlayer(null)
    setView('playerForm')
  }

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setView('playerForm')
  }

  const handleSavePlayer = async (data: Omit<Player, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true)
    try {
      if (editingPlayer) {
        await updatePlayer(editingPlayer.id, data)
      } else {
        await addPlayer(data)
      }
      setView('dashboard')
      setEditingPlayer(null)
    } catch (err) {
      console.error(err)
      alert('Errore nel salvataggio. Riprova.')
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    try {
      await deletePlayer(deletingId)
    } catch (err) {
      console.error(err)
      alert('Errore nella eliminazione. Riprova.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaveConfig = async (updates: Partial<TeamConfig>) => {
    setSaving(true)
    try {
      await saveConfig(updates)
      setView('dashboard')
    } catch (err) {
      console.error(err)
      alert('Errore nel salvataggio impostazioni. Riprova.')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (id: string, stato: Player['stato']) => {
    try {
      await updateStatus(id, stato)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white font-sans">
      <Navbar
        teamName={config.name}
        view={view}
        onNavigate={v => {
          setView(v)
          if (v !== 'playerForm') setEditingPlayer(null)
        }}
        onAddPlayer={handleAddPlayer}
      />

      <main className="max-w-5xl mx-auto px-4 pt-5 pb-28 md:pb-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white/30 flex items-center gap-3">
              <i className="fas fa-spinner fa-spin text-xl"></i>
              <span className="text-sm">Caricamento...</span>
            </div>
          </div>
        ) : (
          <>
            {view === 'dashboard' && (
              <Dashboard
                players={players}
                config={config}
                onEditPlayer={handleEditPlayer}
                onDeletePlayer={setDeletingId}
                onStatusChange={handleStatusChange}
              />
            )}
            {view === 'playerForm' && (
              <div className={saving ? 'opacity-60 pointer-events-none' : ''}>
                <PlayerForm
                  player={editingPlayer}
                  onSave={handleSavePlayer}
                  onCancel={() => { setView('dashboard'); setEditingPlayer(null) }}
                />
              </div>
            )}
            {view === 'teamSettings' && (
              <div className={saving ? 'opacity-60 pointer-events-none' : ''}>
                <TeamSettingsForm
                  config={config}
                  onSave={handleSaveConfig}
                  onCancel={() => setView('dashboard')}
                />
              </div>
            )}
          </>
        )}
      </main>

      {deletingId && (
        <Modal
          title="Elimina Giocatore"
          message="Sei sicuro di voler eliminare definitivamente questo giocatore? L'operazione non può essere annullata."
          confirmLabel="Elimina"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
