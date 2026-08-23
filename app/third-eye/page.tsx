'use client'

import { useState } from 'react'
import { useAppState, today, generateId, getBlueprintingDay, getQuarterKey } from '@/lib/store'
import { LifePillar, PILLAR_LABELS, QuantumLeap } from '@/lib/types'
import PillarBadge from '@/components/PillarBadge'

const PILLARS: LifePillar[] = ['health', 'mind', 'purpose', 'relationships', 'finance', 'character', 'spirit']

const BLUEPRINT_PHASES = [
  'Define the change and why it cannot be undone',
  'List everyone and everything affected',
  'Identify the point of no return',
  'Plan what you will do if things go wrong',
  'Ground it in research or expert guidance',
  'Write the exact criteria that will trigger activation',
  'Honest self-assessment — are you truly ready?',
]

function NewLeapModal({ onClose, onAdd }: { onClose: () => void; onAdd: (leap: QuantumLeap) => void }) {
  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState<LifePillar>('health')

  const handleAdd = () => {
    if (!title.trim()) return
    onAdd({
      id: generateId(),
      title: title.trim(),
      pillar,
      quarterKey: getQuarterKey(new Date()),
      blueprintingStart: today(),
      status: 'blueprinting',
      preparationNotes: Array(7).fill(''),
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(250,250,248,0.95)' }}>
      <div className="w-full max-w-xl p-10 border" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <p className="sans text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>Start a Big Bet</p>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          A Big Bet is a major, hard-to-reverse life decision. You are limited to one per quarter. Before it goes live, you will spend 7 days thinking it through carefully.
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="sans text-xs block mb-1" style={{ color: 'var(--muted)' }}>What is the change?</label>
            <input
              className="w-full border p-2 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
              placeholder="e.g. Move all investments to index funds"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="sans text-xs block mb-1" style={{ color: 'var(--muted)' }}>Which life area?</label>
            <select
              className="w-full border p-2 text-sm sans"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
              value={pillar}
              onChange={e => setPillar(e.target.value as LifePillar)}
            >
              {PILLARS.map(p => <option key={p} value={p}>{PILLAR_LABELS[p]}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="sans text-xs border px-4 py-2 hover:opacity-70 disabled:opacity-30"
            style={{ borderColor: 'var(--fg)' }}
          >
            Start 7-Day Review
          </button>
          <button onClick={onClose} className="sans text-xs px-4 py-2 hover:opacity-70" style={{ color: 'var(--muted)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ThirdEye() {
  const { state, activeLeap, currentQuarter, addLeap, updateLeap } = useAppState()
  const [adding, setAdding] = useState(false)
  const [editingNote, setEditingNote] = useState<{ index: number; value: string } | null>(null)

  const completedLeaps = state.leaps.filter(l => l.status === 'completed')

  const blueprintDay = activeLeap ? getBlueprintingDay(activeLeap.blueprintingStart) : 0
  const canActivate = blueprintDay >= 7

  const saveNote = () => {
    if (!editingNote || !activeLeap) return
    const notes = [...activeLeap.preparationNotes]
    notes[editingNote.index] = editingNote.value
    updateLeap(activeLeap.id, { preparationNotes: notes })
    setEditingNote(null)
  }

  return (
    <div className="p-10 max-w-3xl">
      {adding && (
        <NewLeapModal
          onClose={() => setAdding(false)}
          onAdd={leap => {
            addLeap(leap)
            setAdding(false)
          }}
        />
      )}

      <div className="mb-8">
        <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>Big Bet · Third Eye</p>
        <h1 className="sans text-2xl font-light mb-2">Quarterly Structural Change</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          One significant, hard-to-reverse decision per quarter. Not a goal — a structural shift in how you live. The 7-day review process ensures you act from clarity, not impulse.
        </p>
      </div>

      {!activeLeap ? (
        <div className="border p-8 mb-8" style={{ borderColor: 'var(--border)' }}>
          <p className="sans text-sm font-medium mb-1">No active Big Bet — {currentQuarter}</p>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
            You have one slot available this quarter. Only use it for a decision that genuinely changes the structure of your life.
          </p>
          <button
            onClick={() => setAdding(true)}
            className="sans text-xs border px-4 py-2 hover:opacity-70"
            style={{ borderColor: 'var(--fg)' }}
          >
            Start a Big Bet
          </button>
        </div>
      ) : (
        <div className="mb-10">
          <div className="border-b pb-4 mb-6" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-1">
              <PillarBadge pillar={activeLeap.pillar} />
              <h2 className="sans text-xl font-light">{activeLeap.title}</h2>
            </div>
            <div className="flex gap-4 mt-2">
              <span className="sans text-xs capitalize" style={{ color: 'var(--muted)' }}>
                {activeLeap.status === 'blueprinting' ? 'In review' : activeLeap.status}
              </span>
              <span className="sans text-xs" style={{ color: 'var(--muted)' }}>Quarter: {activeLeap.quarterKey}</span>
              <span className="sans text-xs" style={{ color: 'var(--muted)' }}>Review started: {activeLeap.blueprintingStart}</span>
            </div>
          </div>

          {activeLeap.status === 'blueprinting' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="sans text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
                  7-Day Review — Day {blueprintDay}/7
                </p>
                {!canActivate && (
                  <p className="sans text-xs" style={{ color: 'var(--muted)' }}>
                    {7 - blueprintDay} day{7 - blueprintDay !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 4,
                      flex: 1,
                      background: i < blueprintDay ? 'var(--fg)' : 'var(--border)',
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-px mb-6" style={{ background: 'var(--border)' }}>
                {BLUEPRINT_PHASES.map((phase, i) => {
                  const note = activeLeap.preparationNotes[i] || ''
                  const isUnlocked = i < blueprintDay
                  return (
                    <div key={i} className="p-5" style={{ background: 'var(--bg)' }}>
                      <div className="flex gap-3 items-start">
                        <span
                          className="sans text-xs mt-0.5 shrink-0 w-10"
                          style={{ color: isUnlocked ? 'var(--fg)' : 'var(--muted)' }}
                        >
                          Day {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="sans text-sm" style={{ color: isUnlocked ? 'var(--fg)' : 'var(--muted)' }}>
                            {phase}
                          </p>
                          {isUnlocked && (
                            editingNote?.index === i ? (
                              <div className="mt-2">
                                <textarea
                                  className="w-full border p-2 text-sm resize-none"
                                  style={{ borderColor: 'var(--border)', background: 'var(--bg)', minHeight: 72 }}
                                  value={editingNote.value}
                                  onChange={e => setEditingNote({ index: i, value: e.target.value })}
                                  autoFocus
                                />
                                <div className="flex gap-2 mt-1">
                                  <button onClick={saveNote} className="sans text-xs border px-2 py-1" style={{ borderColor: 'var(--fg)' }}>Save</button>
                                  <button onClick={() => setEditingNote(null)} className="sans text-xs" style={{ color: 'var(--muted)' }}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2">
                                {note ? (
                                  <p className="text-sm italic" style={{ color: 'var(--muted)' }}>&ldquo;{note}&rdquo;</p>
                                ) : (
                                  <p className="sans text-xs" style={{ color: 'var(--muted)' }}>No notes yet</p>
                                )}
                                <button
                                  onClick={() => setEditingNote({ index: i, value: note })}
                                  className="sans text-xs mt-1 hover:opacity-70"
                                  style={{ color: 'var(--muted)' }}
                                >
                                  {note ? 'Edit note' : 'Add note'}
                                </button>
                              </div>
                            )
                          )}
                          {!isUnlocked && (
                            <p className="sans text-xs mt-1" style={{ color: 'var(--muted)' }}>Unlocks on day {i + 1}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {canActivate ? (
                <div>
                  <p className="sans text-xs mb-3" style={{ color: 'var(--muted)' }}>
                    Review complete. You can now activate this bet.
                  </p>
                  <button
                    onClick={() => updateLeap(activeLeap.id, { status: 'active', activationDate: today() })}
                    className="sans text-xs border px-4 py-2 hover:opacity-70"
                    style={{ borderColor: 'var(--fg)' }}
                  >
                    Activate Big Bet
                  </button>
                </div>
              ) : (
                <p className="sans text-xs" style={{ color: 'var(--muted)' }}>
                  Come back each day to reflect on each question. Activation unlocks after all 7 days.
                </p>
              )}
            </>
          )}

          {activeLeap.status === 'active' && (
            <div>
              <p className="sans text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--muted)' }}>Active</p>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                Activated on {activeLeap.activationDate}. Execute this change fully. Mark it complete when done.
              </p>
              <button
                onClick={() => updateLeap(activeLeap.id, { status: 'completed' })}
                className="sans text-xs border px-4 py-2 hover:opacity-70"
                style={{ borderColor: 'var(--fg)' }}
              >
                Mark Complete
              </button>
            </div>
          )}
        </div>
      )}

      {completedLeaps.length > 0 && (
        <div>
          <p className="sans text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--muted)' }}>Past Bets</p>
          <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>
            {completedLeaps.map(l => (
              <div key={l.id} className="p-4 flex items-center gap-3" style={{ background: 'var(--bg)' }}>
                <PillarBadge pillar={l.pillar} />
                <p className="sans text-sm" style={{ color: 'var(--muted)' }}>{l.title}</p>
                <p className="sans text-xs ml-auto" style={{ color: 'var(--muted)' }}>{l.quarterKey}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
