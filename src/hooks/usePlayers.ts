import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Player } from '../types'

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) {
      setError(error.message)
    } else {
      setPlayers(data ?? [])
    }
    setLoading(false)
  }

  async function addPlayer(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('players')
      .insert(player)
      .select()
      .single()
    if (error) throw error
    setPlayers(prev => [...prev, data])
    return data
  }

  async function updatePlayer(id: string, updates: Partial<Omit<Player, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('players')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setPlayers(prev => prev.map(p => p.id === id ? data : p))
    return data
  }

  async function deletePlayer(id: string) {
    const { error } = await supabase.from('players').delete().eq('id', id)
    if (error) throw error
    setPlayers(prev => prev.filter(p => p.id !== id))
  }

  async function updateStatus(id: string, stato: Player['stato']) {
    return updatePlayer(id, { stato })
  }

  return { players, loading, error, addPlayer, updatePlayer, deletePlayer, updateStatus }
}
