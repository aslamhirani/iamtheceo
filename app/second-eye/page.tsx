'use client'

import { useState } from 'react'
import { useAppState, today } from '@/lib/store'
import { BaselineItem } from '@/lib/types'
import Shield from '@/components/Shield'
import PillarBadge from '@/components/PillarBadge'

function CheckModal({ item, onClose, onLog }: {
  item: BaselineItem
  onClose: () => void
  onLog: (met: boolean, reflection: string) => void
}) {
  const [reflection, setReflection] = useState('')
  const [met, setMet] = useState<boolean | null>(null)

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(248,247,244,0.94)', zIndex: 50
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 520, padding: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <PillarBadge pillar={item.pillar} />
          <p className="sans" style={{ fontSize: 16, fontWeight: 400 }}>{item.label}</p>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
          Threshold: <em>{item.threshold}</em>
        </p>
        <p style={{ fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>{item.reflectionPrompt}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[true, false].map(val => (
            <button
              key={String(val)}
              onClick={() => setMet(val)}
              className="btn"
              style={{
                flex: 1, justifyContent: 'center',
                background: met === val ? 'var(--fg)' : 'transparent',
                color: met === val ? 'var(--bg)' : 'var(--fg)',
                borderColor: met === val ? 'var(--fg)' : 'var(--border-2)',
              }}
            >
              {val ? 'Met' : 'Not met'}
            </button>
          ))}
        </div>

        {met !== null && (
          <div style={{ marginBottom: 16 }}>
            <p className="sans" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
              {met ? 'What made today a defended day for this habit?' : 'What slipped, and what would have held it?'}
            </p>
            <textarea
              style={{
                width: '100%', border: '1px solid var(--border)', borderRadius: 6,
                padding: '10px 12px', fontSize: 14, fontFamily: 'Georgia, serif',
                background: 'var(--bg-card)', resize: 'none', minHeight: 100,
              }}
              placeholder="Be honest and specific..."
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { if (met !== null && reflection.trim()) onLog(met, reflection.trim()) }}
            disabled={met === null || !reflection.trim()}
            className="btn btn-primary"
          >
            Save
          </button>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function SecondEye() {
  const { state, logBaseline } = useAppState()
  const [checking, setChecking] = useState<BaselineItem | null>(null)
  const todayStr = today()

  const todayBaselines = state.baselines.map(b => ({
    ...b,
    todayLog: b.logs.find(l => l.date === todayStr) ?? null,
  }))

  const missedToday = todayBaselines.filter(b => b.todayLog?.met === false).length
  const metToday = todayBaselines.filter(b => b.todayLog?.met === true).length
  const notYet = todayBaselines.filter(b => !b.todayLog).length
  const shieldStatus = missedToday === 0 ? 'defended' as const : missedToday === 1 ? 'partial' as const : 'breached' as const

  const sortedDates = [...new Set(state.baselines.flatMap(b => b.logs.map(l => l.date)))].sort()
  let streak = 0
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const date = sortedDates[i]
    const allMet = state.baselines.every(b => b.logs.find(l => l.date === date)?.met !== false)
    if (allMet) streak++
    else break
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760 }}>
      {checking && (
        <CheckModal
          item={checking}
          onClose={() => setChecking(null)}
          onLog={(met, reflection) => {
            logBaseline(checking.id, todayStr, met, reflection)
            setChecking(null)
          }}
        />
      )}

      <div style={{ marginBottom: 32 }}>
        <p className="sans" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          Habits & Shield · Second Eye
        </p>
        <h1 className="sans" style={{ fontSize: 24, fontWeight: 300, marginBottom: 8 }}>Daily Consistency</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
          The shield tracks how many consecutive days you protect every baseline habit. Not performance — protection of the floor.
        </p>
      </div>

      {/* Shield + stats */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 36 }}>
        <Shield status={shieldStatus} daysDefended={streak} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              { value: metToday, label: 'Met today' },
              { value: missedToday, label: 'Missed' },
              { value: notYet, label: 'Pending' },
            ].map(({ value, label }) => (
              <div key={label} className="card" style={{ padding: '14px 16px' }}>
                <p className="sans" style={{ fontSize: 24, fontWeight: 300 }}>{value}</p>
                <p className="sans" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
            {shieldStatus === 'defended' && metToday > 0 && 'Shield defended. Every threshold met.'}
            {shieldStatus === 'defended' && metToday === 0 && 'Begin your check-ins below.'}
            {shieldStatus === 'partial' && 'One threshold missed. Shield weakened but not broken.'}
            {shieldStatus === 'breached' && 'Two or more missed. The floor has dropped — reflect on what slipped.'}
          </p>
        </div>
      </div>

      {/* Habit list */}
      <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
        Today&apos;s Habits — {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {todayBaselines.map(item => {
          const logged = !!item.todayLog
          const met = item.todayLog?.met
          return (
            <div key={item.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <PillarBadge pillar={item.pillar} />
                    <p className="sans" style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
                    {logged && (
                      <span className="sans" style={{
                        fontSize: 11, padding: '1px 8px', borderRadius: 4,
                        background: met ? 'var(--fg)' : 'var(--border)',
                        color: met ? 'var(--bg)' : 'var(--muted)',
                      }}>
                        {met ? 'Met' : 'Missed'}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>{item.threshold}</p>
                </div>
                {!logged && (
                  <button onClick={() => setChecking(item)} className="btn btn-secondary" style={{ flexShrink: 0 }}>
                    Check in
                  </button>
                )}
              </div>
              {logged && item.todayLog && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
                    &ldquo;{item.todayLog.reflection}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
