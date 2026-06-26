'use client'

import { useState } from 'react'
import { KNOWLEDGE_BASE } from '@/lib/seed-data'
import { LifePillar, PILLAR_LABELS } from '@/lib/types'
import PillarBadge from '@/components/PillarBadge'
import LineageChain from '@/components/LineageChain'

const PILLARS: LifePillar[] = ['health', 'learning', 'finance', 'relationships', 'community']

export default function KnowledgeBase() {
  const [filter, setFilter] = useState<LifePillar | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const entries = filter === 'all' ? KNOWLEDGE_BASE : KNOWLEDGE_BASE.filter(e => e.pillar === filter)

  return (
    <div className="p-12 max-w-4xl">
      <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>Module 1</p>
      <h1 className="sans text-3xl font-light mb-2">Knowledge Base</h1>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
        Peer-reviewed blueprints with explicit provenance. Every directive traces its lineage from actionable guidance through domain expert endorsement to empirical source.
      </p>
      <div className="border-b mb-8 pb-4" style={{ borderColor: 'var(--border)' }}>
        <p className="sans text-xs mb-3" style={{ color: 'var(--muted)' }}>The Lineage Chain Rule:</p>
        <p className="sans text-xs font-mono" style={{ color: 'var(--fg)' }}>
          Actionable Directive → Domain Expert Endorsement → Empirical Source Asset
        </p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className="sans text-xs border px-3 py-1 transition-colors"
          style={{
            borderColor: filter === 'all' ? 'var(--fg)' : 'var(--border)',
            background: filter === 'all' ? 'var(--fg)' : 'transparent',
            color: filter === 'all' ? 'var(--bg)' : 'var(--muted)',
          }}
        >
          All ({KNOWLEDGE_BASE.length})
        </button>
        {PILLARS.map(p => {
          const count = KNOWLEDGE_BASE.filter(e => e.pillar === p).length
          return (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className="sans text-xs border px-3 py-1 transition-colors capitalize"
              style={{
                borderColor: filter === p ? 'var(--fg)' : 'var(--border)',
                background: filter === p ? 'var(--fg)' : 'transparent',
                color: filter === p ? 'var(--bg)' : 'var(--muted)',
              }}
            >
              {PILLAR_LABELS[p].split(' ')[0]} ({count})
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>
        {entries.map(entry => {
          const isExpanded = expanded === entry.id
          return (
            <div key={entry.id} style={{ background: 'var(--bg)' }}>
              <button
                className="w-full p-6 text-left hover:opacity-80 transition-opacity"
                onClick={() => setExpanded(isExpanded ? null : entry.id)}
              >
                <div className="flex items-start gap-3">
                  <PillarBadge pillar={entry.pillar} />
                  <div className="flex-1">
                    <p className="sans text-sm font-medium">{entry.expert}</p>
                    <p className="sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{entry.domain}</p>
                  </div>
                  <span className="sans text-xs" style={{ color: 'var(--muted)' }}>{isExpanded ? '−' : '+'}</span>
                </div>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: isExpanded ? 'var(--muted)' : 'var(--fg)' }}>
                  {entry.directive.slice(0, 100)}{entry.directive.length > 100 && !isExpanded ? '...' : ''}
                </p>
              </button>
              {isExpanded && (
                <div className="px-6 pb-6">
                  <LineageChain
                    directive={entry.directive}
                    expert={`${entry.expert} — ${entry.domain}`}
                    source={entry.source}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="sans text-xs mt-8" style={{ color: 'var(--muted)' }}>
        {entries.length} directive{entries.length !== 1 ? 's' : ''} — all entries contain verified expert and source attribution.
      </p>
    </div>
  )
}
