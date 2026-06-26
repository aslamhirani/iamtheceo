export type LifePillar = 'health' | 'learning' | 'finance' | 'relationships' | 'community'

export const PILLAR_LABELS: Record<LifePillar, string> = {
  health: 'Health & Longevity',
  learning: 'Learning & Focus',
  finance: 'Finance',
  relationships: 'Relationships',
  community: 'Community Give-Back',
}

export interface MicroAdjustment {
  id: string
  title: string
  pillar: LifePillar
  expertLineage: string
  startDate: string
  logs: { date: string; reflection: string }[]
  active: boolean
}

export interface BaselineItem {
  id: string
  pillar: LifePillar
  label: string
  threshold: string
  reflectionPrompt: string
  logs: { date: string; met: boolean; reflection: string }[]
}

export interface QuantumLeap {
  id: string
  title: string
  pillar: LifePillar
  quarterKey: string
  blueprintingStart: string
  activationDate?: string
  status: 'blueprinting' | 'active' | 'completed'
  preparationNotes: string[]
}

export interface KnowledgeEntry {
  id: string
  pillar: LifePillar
  expert: string
  domain: string
  directive: string
  source: string
  sourceYear: number
}

export interface ReflectionEntry {
  id: string
  date: string
  prompt: string
  response: string
}

export interface AppState {
  microAdjustments: MicroAdjustment[]
  baselines: BaselineItem[]
  leaps: QuantumLeap[]
  reflections: ReflectionEntry[]
}
