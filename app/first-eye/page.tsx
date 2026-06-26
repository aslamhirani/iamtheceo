'use client'

import { useState } from 'react'
import { useAppState, today, generateId } from '@/lib/store'
import { LifePillar, PILLAR_LABELS, MicroAdjustment } from '@/lib/types'
import PillarBadge from '@/components/PillarBadge'

const PILLARS: LifePillar[] = ['health', 'learning', 'finance', 'relationships', 'community']

function LogModal({ adjustment, onClose, onLog }: {
  adjustment: MicroAdjustment
  onClose: () => void
  onLog: (reflection: string) => void
}) {
  const [text, setText] = useState('')
  const todayStr = today()
  const alreadyLogged = adjustment.logs.some(l => l.date === todayStr)

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(250,250,248,0.92)' }}>
      <div className="w-full max-w-xl p-10 border" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>Semantic Reflection</p>
        <p className="sans text-lg font-light mb-6">{adjustment.title}</p>
        {alreadyLogged ? (
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>You have already logged a reflection for this adjustment today.</p>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              Did you execute this with full intention today — or to cross it off a list? Describe specifically what you did and why it counts.
            </p>
            <textarea
              className="w-full border p-3 text-sm resize-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)', minHeight: 120 }}
              placeholder="Write your honest reflection..."
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
            />
          </>
        )}
        <div className="flex gap-3 mt-4">
          {!alreadyLogged && (
            <button
              onClick={() => { if (text.trim()) onLog(text.trim()) }}
              disabled={!text.trim()}
              className="sans text-xs border px-4 py-2 hover:opacity-70 transition-opacity disabled:opacity-30"
              style={{ borderColor: 'var(--fg)' }}
            >
              Record Reflection
            </button>
          )}
          <button
            onClick={onClose}
            className="sans text-xs px-4 py-2 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--muted)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function AddModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (item: MicroAdjustment) => void
}) {
  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState<LifePillar>('health')
  const [expert, setExpert] = useState('')

  const handleAdd = () => {
    if (!title.trim()) return
    onAdd({
      id: generateId(),
      title: title.trim(),
      pillar,
      expertLineage: expert.trim() || 'Self-directed',
      startDate: today(),
      logs: [],
      active: true,
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(250,250,248,0.92)' }}>
      <div className="w-full max-w-xl p-10 border" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <p className="sans text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--muted)' }}>New Micro-Adjustment</p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="sans text-xs block mb-1" style={{ color: 'var(--muted)' }}>Title</label>
            <input
              className="w-full border p-2 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
              placeholder="e.g. 45-degree toothbrush angle"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="sans text-xs block mb-1" style={{ color: 'var(--muted)' }}>Life Pillar</label>
            <select
              className="w-full border p-2 text-sm sans"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
              value={pillar}
              onChange={e => setPillar(e.target.value as LifePillar)}
            >
              {PILLARS.map(p => <option key={p} value={p}>{PILLAR_LABELS[p]}</option>)}
            </select>
          </div>
          <div>
            <label className="sans text-xs block mb-1" style={{ color: 'var(--muted)' }}>Expert Lineage (optional)</label>
            <input
              className="w-full border p-2 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
              placeholder="e.g. James Clear / Atomic Habits"
              value={expert}
              onChange={e => setExpert(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="sans text-xs border px-4 py-2 hover:opacity-70 transition-opacity disabled:opacity-30"
            style={{ borderColor: 'var(--fg)' }}
          >
            Add Adjustment
          </button>
          <button onClick={onClose} className="sans text-xs px-4 py-2 hover:opacity-70" style={{ color: 'var(--muted)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FirstEye() {
  const { state, activeAdjustments, addMicroAdjustment, removeMicroAdjustment, logMicroReflection } = useAppState()
  const [logging, setLogging] = useState<MicroAdjustment | null>(null)
  const [adding, setAdding] = useState(false)

  const inactive = state.microAdjustments.filter(m => !m.active)

  return (
    <div className="p-12 max-w-3xl">
      {logging && (
        <LogModal
          adjustment={logging}
          onClose={() => setLogging(null)}
          onLog={reflection => {
            logMicroReflection(logging.id, today(), reflection)
            setLogging(null)
          }}
        />
      )}
      {adding && (
        <AddModal
          onClose={() => setAdding(false)}
          onAdd={item => {
            addMicroAdjustment(item)
            setAdding(false)
          }}
        />
      )}

      <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>The First Eye</p>
      <h1 className="sans text-3xl font-light mb-2">Incremental Gains</h1>
      <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
        1% marginal compound adjustments. Maximum 2 active at any time. Each requires a semantic reflection, not a checkbox.
      </p>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="sans text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
            Active Adjustments — {activeAdjustments.length}/2
          </p>
          <button
            onClick={() => setAdding(true)}
            disabled={activeAdjustments.length >= 2}
            className="sans text-xs border px-3 py-1 hover:opacity-70 transition-opacity disabled:opacity-30"
            style={{ borderColor: 'var(--fg)' }}
          >
            + Add Adjustment
          </button>
        </div>

        <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>
          {[0, 1].map(i => {
            const adj = activeAdjustments[i]
            if (!adj) {
              return (
                <div key={i} className="p-6" style={{ background: 'var(--bg)' }}>
                  <p className="sans text-xs" style={{ color: 'var(--muted)' }}>Slot {i + 1} — open</p>
                </div>
              )
            }
            const todayLogged = adj.logs.some(l => l.date === today())
            return (
              <div key={adj.id} className="p-6" style={{ background: 'var(--bg)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <PillarBadge pillar={adj.pillar} />
                      <p className="sans text-sm font-medium">{adj.title}</p>
                    </div>
                    <p className="sans text-xs mb-1" style={{ color: 'var(--muted)' }}>
                      Lineage: {adj.expertLineage}
                    </p>
                    <p className="sans text-xs" style={{ color: 'var(--muted)' }}>
                      {adj.logs.length} reflection{adj.logs.length !== 1 ? 's' : ''} · Started {adj.startDate}
                    </p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <button
                      onClick={() => setLogging(adj)}
                      className="sans text-xs border px-3 py-1 hover:opacity-70 transition-opacity"
                      style={{
                        borderColor: todayLogged ? 'var(--border)' : 'var(--fg)',
                        color: todayLogged ? 'var(--muted)' : 'var(--fg)',
                      }}
                    >
                      {todayLogged ? 'Logged today' : 'Log today'}
                    </button>
                    <button
                      onClick={() => removeMicroAdjustment(adj.id)}
                      className="sans text-xs px-2 py-1 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--muted)' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {adj.logs.length > 0 && (
                  <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                    <p className="sans text-xs mb-2" style={{ color: 'var(--muted)' }}>Recent reflection</p>
                    <p className="text-sm italic" style={{ color: 'var(--muted)' }}>
                      &ldquo;{adj.logs[adj.logs.length - 1].reflection}&rdquo;
                    </p>
                    <p className="sans text-xs mt-1" style={{ color: 'var(--muted)' }}>
                      — {adj.logs[adj.logs.length - 1].date}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {inactive.length > 0 && (
        <div>
          <p className="sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>Completed / Removed</p>
          <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>
            {inactive.map(adj => (
              <div key={adj.id} className="p-4 flex items-center gap-3" style={{ background: 'var(--bg)' }}>
                <PillarBadge pillar={adj.pillar} />
                <p className="sans text-sm" style={{ color: 'var(--muted)' }}>{adj.title}</p>
                <p className="sans text-xs ml-auto" style={{ color: 'var(--muted)' }}>{adj.logs.length} logs</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
