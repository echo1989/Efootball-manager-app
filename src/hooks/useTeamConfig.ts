import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { TeamConfig } from '../types'

const DEFAULT_CONFIG: TeamConfig = {
  name: 'FC eFootball',
  capital: 5000000,
  stadium_cost: 200000,
  cantera_cost: 100000,
  max_overall: 1735,
}

export function useTeamConfig() {
  const [config, setConfig] = useState<TeamConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  async function fetchConfig() {
    setLoading(true)
    const { data, error } = await supabase
      .from('team_config')
      .select('*')
      .limit(1)
      .single()
    if (error) {
      if (error.code !== 'PGRST116') setError(error.message)
    } else if (data) {
      setConfig(data)
    }
    setLoading(false)
  }

  async function saveConfig(updates: Partial<TeamConfig>) {
    const next = { ...config, ...updates }
    if (config.id) {
      const { data, error } = await supabase
        .from('team_config')
        .update({ ...next, updated_at: new Date().toISOString() })
        .eq('id', config.id)
        .select()
        .single()
      if (error) throw error
      setConfig(data)
    } else {
      const { data, error } = await supabase
        .from('team_config')
        .insert(next)
        .select()
        .single()
      if (error) throw error
      setConfig(data)
    }
  }

  return { config, loading, error, saveConfig }
}
