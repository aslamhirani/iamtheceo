'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppState, MicroAdjustment, BaselineItem, QuantumLeap, ReflectionEntry } from './types'
import { DEFAULT_BASELINES } from './seed-data'

const STORAGE_KEY = 'intentionalos_v2'

function getInitialState(): AppState {
  if (typeof window === 'undefined') return { microAdjustments: [], baselines: DEFAULT_BASELINES, leaps: [], reflections: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { microAdjustments: [], baselines: DEFAULT_BASELINES, leaps: [], reflections: [] }
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useAppState() {
  const [state, setState] = useState<AppState>({ microAdjustments: [], baselines: DEFAULT_BASELINES, leaps: [], reflections: [] })

  useEffect(() => {
    setState(getInitialState())
  }, [])

  const update = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }, [])

  const addMicroAdjustment = useCallback((item: MicroAdjustment) => {
    update(s => ({ ...s, microAdjustments: [...s.microAdjustments, item] }))
  }, [update])

  const removeMicroAdjustment = useCallback((id: string) => {
    update(s => ({ ...s, microAdjustments: s.microAdjustments.map(m => m.id === id ? { ...m, active: false } : m) }))
  }, [update])

  const logMicroReflection = useCallback((id: string, date: string, reflection: string) => {
    update(s => ({
      ...s,
      microAdjustments: s.microAdjustments.map(m =>
        m.id === id ? { ...m, logs: [...m.logs, { date, reflection }] } : m
      )
    }))
  }, [update])

  const logBaseline = useCallback((id: string, date: string, met: boolean, reflection: string) => {
    update(s => ({
      ...s,
      baselines: s.baselines.map(b =>
        b.id === id ? { ...b, logs: [...b.logs, { date, met, reflection }] } : b
      )
    }))
  }, [update])

  const addLeap = useCallback((leap: QuantumLeap) => {
    update(s => ({ ...s, leaps: [...s.leaps, leap] }))
  }, [update])

  const updateLeap = useCallback((id: string, changes: Partial<QuantumLeap>) => {
    update(s => ({ ...s, leaps: s.leaps.map(l => l.id === id ? { ...l, ...changes } : l) }))
  }, [update])

  const addReflection = useCallback((entry: ReflectionEntry) => {
    update(s => ({ ...s, reflections: [...s.reflections, entry] }))
  }, [update])

  const activeAdjustments = state.microAdjustments.filter(m => m.active)
  const currentQuarter = getQuarterKey(new Date())
  const activeLeap = state.leaps.find(l => l.quarterKey === currentQuarter && l.status !== 'completed')

  return {
    state,
    activeAdjustments,
    activeLeap,
    currentQuarter,
    addMicroAdjustment,
    removeMicroAdjustment,
    logMicroReflection,
    logBaseline,
    addLeap,
    updateLeap,
    addReflection,
  }
}

export function getQuarterKey(date: Date): string {
  const q = Math.floor(date.getMonth() / 3) + 1
  return `${date.getFullYear()}-Q${q}`
}

export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getDaysSince(dateStr: string): number {
  const start = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function getBlueprintingDay(startDate: string): number {
  return Math.min(getDaysSince(startDate) + 1, 7)
}
