'use client'

import { useState } from 'react'
import { KNOWLEDGE_BASE } from '@/lib/seed-data'
import { LifePillar, PILLAR_LABELS, PILLAR_SHORT } from '@/lib/types'
import PillarBadge from '@/components/PillarBadge'
import LineageChain from '@/components/LineageChain'

const PILLARS: LifePillar[] = ['health', 'mind', 'purpose', 'relationships', 'finance', 'character', 'spirit']

export default function KnowledgeBase() {
  const [filter, setFilter] = useState<LifePillar | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const entries = filter === 'all' ? KNOWLEDGE_BASE : KNOWLEDGE_BASE.filter(e => e.pillar === filter)

  return (
    <div style={{ padding: '40px 48px', maxWidth: 820 }}>
      <div style={{ marginBottom: 32 }}>
        <p className="sans" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          Knowledge Base
        </p>
        <h1 className="sans" style={{ fontSize: 24, fontWeight: 300, marginBottom: 8 }}>Expert Lineage</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>
          Every directive traces its lineage from actionable guidance through domain expert endorsement to empirical source. Grounded in the Global Flourishing Study&apos;s 7 domains.
        </p>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 14px', display: 'inline-block' }}>
          <p className="sans" style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>
            Directive → Expert → Empirical Source
          </p>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        <button
          onClick={() => setFilter('all')}
          className="btn"
          style={{
            background: filter === 'all' ? 'var(--fg)' : 'transparent',
            color: filter === 'all' ? 'var(--bg)' : 'var(--muted)',
            borderColor: filter === 'all' ? 'var(--fg)' : 'var(--border-2)',
          }}
        >
          All ({KNOWLEDGE_BASE.length})
        </button>
        {PILLARS.map(p => {
          const count = KNOWLEDGE_BASE.filter(e => e.pillar === p).length
          if (count === 0) return null
          return (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className="btn"
              style={{
                background: filter === p ? 'var(--fg)' : 'transparent',
                color: filter === p ? 'var(--bg)' : 'var(--muted)',
                borderColor: filter === p ? 'var(--fg)' : 'var(--border-2)',
              }}
            >
              {PILLAR_SHORT[p]} ({count})
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map(entry => {
          const isExpanded = expanded === entry.id
          return (
            <div key={entry.id} className="card" style={{ overflow: 'hidden' }}>
              <button
                style={{ width: '100%', padding: '16px 20px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setExpanded(isExpanded ? null : entry.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <PillarBadge pillar={entry.pillar} />
                  <div style={{ flex: 1 }}>
                    <p className="sans" style={{ fontSize: 14, fontWeight: 500 }}>{entry.expert}</p>
                    <p className="sans" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{entry.domain}</p>
                  </div>
                  <span className="sans" style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 300, marginTop: 2 }}>
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
                <p style={{ fontSize: 14, marginTop: 10, lineHeight: 1.65, color: 'var(--fg)', textAlign: 'left' }}>
                  {isExpanded ? entry.directive : entry.directive.slice(0, 120) + (entry.directive.length > 120 ? '...' : '')}
                </p>
              </button>
              {isExpanded && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', marginTop: 0 }}>
                  <div style={{ paddingTop: 16 }}>
                    <LineageChain
                      directive={entry.directive}
                      expert={entry.expert}
                      source={entry.source}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
