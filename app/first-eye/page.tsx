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
        <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>Daily Reflection</p>
        <p className="sans text-lg font-light mb-6">{adjustment.title}</p>
        {alreadyLogged ? (
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>You have already written a reflection for this today.</p>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              Did you actually do this today — with intention, not just to tick a box? Describe specifically what you did and why it counts.
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
              Save Reflection
            </button>
          )}
          <button
            onClick={onClose}
            className="sans text-xs px-4 py-2 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--muted)' }}
          >
            {alreadyLogged ? 'Close' : 'Cancel'}
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
        <p className="sans text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>New Daily Improvement</p>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          A small, specific habit you'll practise every day. Think 1% — not a life overhaul.
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="sans text-xs block mb-1" style={{ color: 'var(--muted)' }}>What is the improvement?</label>
            <input
              className="w-full border p-2 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
              placeholder="e.g. Brush at a 45-degree angle for 2 minutes"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="sans text-xs block mb-1" style={{ color: 'var(--muted)' }}>Which life area does it belong to?</label>
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
            <label className="sans text-xs block mb-1" style={{ color: 'var(--muted)' }}>Source or inspiration (optional)</label>
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
            Add Improvement
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
  const slotsRemaining = 2 - activeAdjustments.length

  return (
    <div className="p-10 max-w-3xl">
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

      <div className="mb-8">
        <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>Daily Improvements · First Eye</p>
        <h1 className="sans text-2xl font-light mb-2">1% Every Day</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Small, specific habits that compound over time. You can work on at most 2 at once — focus beats volume. Each day you log a written reflection, not a checkbox.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="sans text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
            Active — {activeAdjustments.length}/2
          </p>
          {slotsRemaining > 0 ? (
            <button
              onClick={() => setAdding(true)}
              className="sans text-xs border px-3 py-1 hover:opacity-70 transition-opacity"
              style={{ borderColor: 'var(--fg)' }}
            >
              + Add Improvement
            </button>
          ) : (
            <p className="sans text-xs" style={{ color: 'var(--muted)' }}>Slots full — complete one before adding another</p>
          )}
        </div>

        <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>
          {activeAdjustments.length === 0 ? (
            <div className="p-8 text-center" style={{ background: 'var(--bg)' }}>
              <p className="sans text-sm mb-1" style={{ color: 'var(--muted)' }}>No active improvements yet.</p>
              <p className="sans text-xs mb-4" style={{ color: 'var(--muted)' }}>Add your first — something small and specific you can do every day.</p>
              <button
                onClick={() => setAdding(true)}
                className="sans text-xs border px-4 py-2 hover:opacity-70 transition-opacity"
                style={{ borderColor: 'var(--fg)' }}
              >
                Add First Improvement
              </button>
            </div>
          ) : (
            activeAdjustments.map(adj => {
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
                        Source: {adj.expertLineage}
                      </p>
                      <p className="sans text-xs" style={{ color: 'var(--muted)' }}>
                        {adj.logs.length} day{adj.logs.length !== 1 ? 's' : ''} logged · Started {adj.startDate}
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
                        {todayLogged ? '✓ Logged today' : 'Log today'}
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
                      <p className="sans text-xs mb-1" style={{ color: 'var(--muted)' }}>Latest reflection</p>
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
            })
          )}
        </div>
      </div>

      {inactive.length > 0 && (
        <div>
          <p className="sans text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--muted)' }}>Past Improvements</p>
          <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>
            {inactive.map(adj => (
              <div key={adj.id} className="p-4 flex items-center gap-3" style={{ background: 'var(--bg)' }}>
                <PillarBadge pillar={adj.pillar} />
                <p className="sans text-sm" style={{ color: 'var(--muted)' }}>{adj.title}</p>
                <p className="sans text-xs ml-auto" style={{ color: 'var(--muted)' }}>{adj.logs.length} days</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
