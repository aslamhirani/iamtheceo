'use client'

import { useState } from 'react'
import { useAppState, today, generateId } from '@/lib/store'
import { LifePillar, PILLAR_LABELS, MicroAdjustment } from '@/lib/types'
import PillarBadge from '@/components/PillarBadge'

const PILLARS: LifePillar[] = ['health', 'mind', 'purpose', 'relationships', 'finance', 'character', 'spirit']

function LogModal({ adjustment, onClose, onLog }: {
  adjustment: MicroAdjustment
  onClose: () => void
  onLog: (reflection: string) => void
}) {
  const [text, setText] = useState('')
  const todayStr = today()
  const alreadyLogged = adjustment.logs.some(l => l.date === todayStr)

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(248,247,244,0.94)', zIndex: 50
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 520, padding: 36 }}>
        <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          Daily Reflection
        </p>
        <p className="sans" style={{ fontSize: 18, fontWeight: 300, marginBottom: 20 }}>{adjustment.title}</p>
        {alreadyLogged ? (
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>You already wrote a reflection for this today.</p>
        ) : (
          <>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.7 }}>
              Did you actually do this today — with intention, not just to tick a box? Describe specifically what you did and why it counts.
            </p>
            <textarea
              style={{
                width: '100%', border: '1px solid var(--border)', borderRadius: 6,
                padding: '12px 14px', fontSize: 14, fontFamily: 'Georgia, serif',
                background: 'var(--bg-card)', resize: 'none', minHeight: 120, lineHeight: 1.65,
              }}
              placeholder="Write your honest reflection..."
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
            />
          </>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {!alreadyLogged && (
            <button onClick={() => { if (text.trim()) onLog(text.trim()) }} disabled={!text.trim()} className="btn btn-primary">
              Save reflection
            </button>
          )}
          <button onClick={onClose} className="btn btn-ghost">{alreadyLogged ? 'Close' : 'Cancel'}</button>
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

  const inputStyle = {
    width: '100%', border: '1px solid var(--border)', borderRadius: 6,
    padding: '8px 12px', fontSize: 14, fontFamily: '-apple-system, Helvetica Neue, sans-serif',
    background: 'var(--bg-card)',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(248,247,244,0.94)', zIndex: 50
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 480, padding: 36 }}>
        <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          New Daily Improvement
        </p>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.7 }}>
          A small, specific behaviour you will practise every day. Think 1% — not a life overhaul.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="sans" style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>What is the improvement?</label>
            <input style={inputStyle} placeholder="e.g. Brush at a 45-degree angle for 2 minutes" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="sans" style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Which flourishing domain?</label>
            <select style={inputStyle} value={pillar} onChange={e => setPillar(e.target.value as LifePillar)}>
              {PILLARS.map(p => <option key={p} value={p}>{PILLAR_LABELS[p]}</option>)}
            </select>
          </div>
          <div>
            <label className="sans" style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Source or inspiration (optional)</label>
            <input style={inputStyle} placeholder="e.g. James Clear / Atomic Habits" value={expert} onChange={e => setExpert(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button onClick={handleAdd} disabled={!title.trim()} className="btn btn-primary">Add improvement</button>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
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
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
      {logging && (
        <LogModal adjustment={logging} onClose={() => setLogging(null)} onLog={r => {
          logMicroReflection(logging.id, today(), r)
          setLogging(null)
        }} />
      )}
      {adding && (
        <AddModal onClose={() => setAdding(false)} onAdd={item => {
          addMicroAdjustment(item)
          setAdding(false)
        }} />
      )}

      <div style={{ marginBottom: 32 }}>
        <p className="sans" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          Daily Improvements · First Eye
        </p>
        <h1 className="sans" style={{ fontSize: 24, fontWeight: 300, marginBottom: 8 }}>1% Every Day</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
          Small, specific habits that compound over time. Maximum 2 active at once — focus beats volume. Each day requires a written reflection, not a checkbox.
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Active — {activeAdjustments.length}/2
          </p>
          {activeAdjustments.length < 2 ? (
            <button onClick={() => setAdding(true)} className="btn btn-secondary">+ Add improvement</button>
          ) : (
            <p className="sans" style={{ fontSize: 12, color: 'var(--muted)' }}>Slots full</p>
          )}
        </div>

        {activeAdjustments.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <p className="sans" style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>No active improvements yet</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.7 }}>
              Add something small and specific — one behaviour across one of the 7 flourishing domains.
            </p>
            <button onClick={() => setAdding(true)} className="btn btn-primary">Add first improvement</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeAdjustments.map(adj => {
              const todayLogged = adj.logs.some(l => l.date === today())
              return (
                <div key={adj.id} className="card" style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <PillarBadge pillar={adj.pillar} />
                        <p className="sans" style={{ fontSize: 14, fontWeight: 500 }}>{adj.title}</p>
                      </div>
                      <p className="sans" style={{ fontSize: 12, color: 'var(--muted)' }}>
                        Source: {adj.expertLineage} · {adj.logs.length} day{adj.logs.length !== 1 ? 's' : ''} logged
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                      <button
                        onClick={() => setLogging(adj)}
                        className="btn"
                        style={{
                          background: todayLogged ? 'transparent' : 'var(--fg)',
                          color: todayLogged ? 'var(--muted)' : 'var(--bg)',
                          borderColor: todayLogged ? 'var(--border-2)' : 'var(--fg)',
                        }}
                      >
                        {todayLogged ? '✓ Logged' : 'Log today'}
                      </button>
                      <button onClick={() => removeMicroAdjustment(adj.id)} className="btn btn-ghost" style={{ padding: '6px 8px' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                  {adj.logs.length > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--muted)', lineHeight: 1.6 }}>
                        &ldquo;{adj.logs[adj.logs.length - 1].reflection}&rdquo;
                      </p>
                      <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                        {adj.logs[adj.logs.length - 1].date}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {inactive.length > 0 && (
        <div>
          <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            Past Improvements
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {inactive.map(adj => (
              <div key={adj.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <PillarBadge pillar={adj.pillar} />
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>{adj.title}</p>
                <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>{adj.logs.length} days</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
