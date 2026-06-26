'use client'

import { useState } from 'react'
import { useAppState, today } from '@/lib/store'
import { BaselineItem } from '@/lib/types'
import Shield from '@/components/Shield'
import PillarBadge from '@/components/PillarBadge'

function BaselineCheckModal({ item, onClose, onLog }: {
  item: BaselineItem
  onClose: () => void
  onLog: (met: boolean, reflection: string) => void
}) {
  const [reflection, setReflection] = useState('')
  const [met, setMet] = useState<boolean | null>(null)

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(250,250,248,0.95)' }}>
      <div className="w-full max-w-xl p-10 border" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>Baseline Check-In</p>
        <div className="flex items-center gap-2 mb-4">
          <PillarBadge pillar={item.pillar} />
          <p className="sans text-lg font-light">{item.label}</p>
        </div>
        <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
          Threshold: <em>{item.threshold}</em>
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--fg)' }}>{item.reflectionPrompt}</p>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMet(true)}
            className="sans text-xs border px-4 py-2 flex-1 transition-opacity"
            style={{
              borderColor: met === true ? 'var(--fg)' : 'var(--border)',
              background: met === true ? 'var(--fg)' : 'transparent',
              color: met === true ? 'var(--bg)' : 'var(--fg)',
            }}
          >
            Threshold Met
          </button>
          <button
            onClick={() => setMet(false)}
            className="sans text-xs border px-4 py-2 flex-1 transition-opacity"
            style={{
              borderColor: met === false ? 'var(--fg)' : 'var(--border)',
              background: met === false ? 'var(--fg)' : 'transparent',
              color: met === false ? 'var(--bg)' : 'var(--fg)',
            }}
          >
            Threshold Not Met
          </button>
        </div>

        {met !== null && (
          <div className="mb-4">
            <p className="sans text-xs mb-2" style={{ color: 'var(--muted)' }}>
              {met ? 'What made today a defended day for this baseline?' : 'What slipped, and what would have held it?'}
            </p>
            <textarea
              className="w-full border p-3 text-sm resize-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)', minHeight: 100 }}
              placeholder="Be honest and specific..."
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => { if (met !== null && reflection.trim()) onLog(met, reflection.trim()) }}
            disabled={met === null || !reflection.trim()}
            className="sans text-xs border px-4 py-2 hover:opacity-70 disabled:opacity-30"
            style={{ borderColor: 'var(--fg)' }}
          >
            Record
          </button>
          <button onClick={onClose} className="sans text-xs px-4 py-2 hover:opacity-70" style={{ color: 'var(--muted)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SecondEye() {
  const { state, logBaseline } = useAppState()
  const [checking, setChecking] = useState<BaselineItem | null>(null)
  const todayStr = today()

  const todayBaselines = state.baselines.map(b => {
    const log = b.logs.find(l => l.date === todayStr)
    return { ...b, todayLog: log ?? null }
  })

  const missedToday = todayBaselines.filter(b => b.todayLog?.met === false).length
  const metToday = todayBaselines.filter(b => b.todayLog?.met === true).length
  const shieldStatus = missedToday === 0 ? 'defended' as const : missedToday === 1 ? 'partial' as const : 'breached' as const

  const sortedDates = [...new Set(state.baselines.flatMap(b => b.logs.map(l => l.date)))].sort()
  let streak = 0
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const date = sortedDates[i]
    const allMet = state.baselines.every(b => {
      const log = b.logs.find(l => l.date === date)
      return log?.met !== false
    })
    if (allMet) streak++
    else break
  }

  return (
    <div className="p-12 max-w-3xl">
      {checking && (
        <BaselineCheckModal
          item={checking}
          onClose={() => setChecking(null)}
          onLog={(met, reflection) => {
            logBaseline(checking.id, todayStr, met, reflection)
            setChecking(null)
          }}
        />
      )}

      <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>The Second Eye</p>
      <h1 className="sans text-3xl font-light mb-2">Consistency Shield</h1>
      <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
        Track preservation of the floor, not performance maximization. The shield measures how many consecutive days you prevent your fundamental baselines from dropping below acceptable thresholds.
      </p>

      <div className="flex gap-12 mb-12 items-start">
        <Shield status={shieldStatus} daysDefended={streak} />
        <div className="flex-1 pt-2">
          <div className="grid grid-cols-3 gap-px mb-4" style={{ background: 'var(--border)' }}>
            <div className="p-4" style={{ background: 'var(--bg)' }}>
              <p className="sans text-2xl font-light">{metToday}</p>
              <p className="sans text-xs mt-1" style={{ color: 'var(--muted)' }}>Met today</p>
            </div>
            <div className="p-4" style={{ background: 'var(--bg)' }}>
              <p className="sans text-2xl font-light">{missedToday}</p>
              <p className="sans text-xs mt-1" style={{ color: 'var(--muted)' }}>Missed today</p>
            </div>
            <div className="p-4" style={{ background: 'var(--bg)' }}>
              <p className="sans text-2xl font-light">{todayBaselines.filter(b => !b.todayLog).length}</p>
              <p className="sans text-xs mt-1" style={{ color: 'var(--muted)' }}>Not yet logged</p>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {shieldStatus === 'defended' && metToday > 0 && 'Shield defended today. Every threshold met.'}
            {shieldStatus === 'defended' && metToday === 0 && 'Begin your baseline check-ins below.'}
            {shieldStatus === 'partial' && 'One threshold missed. Shield degraded but not broken.'}
            {shieldStatus === 'breached' && 'Two or more thresholds missed. The floor has dropped.'}
          </p>
        </div>
      </div>

      <div>
        <p className="sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>Today&apos;s Baseline Check-Ins</p>
        <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>
          {todayBaselines.map(item => {
            const logged = !!item.todayLog
            const met = item.todayLog?.met
            return (
              <div key={item.id} className="p-6" style={{ background: 'var(--bg)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <PillarBadge pillar={item.pillar} />
                      <p className="sans text-sm font-medium">{item.label}</p>
                      {logged && (
                        <span
                          className="sans text-xs px-2 py-0.5 border"
                          style={{
                            borderColor: met ? 'var(--fg)' : 'var(--border)',
                            color: met ? 'var(--fg)' : 'var(--muted)',
                          }}
                        >
                          {met ? 'Met' : 'Missed'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs italic mb-1" style={{ color: 'var(--muted)' }}>&ldquo;{item.reflectionPrompt}&rdquo;</p>
                    <p className="sans text-xs" style={{ color: 'var(--muted)' }}>Threshold: {item.threshold}</p>
                  </div>
                  {!logged && (
                    <button
                      onClick={() => setChecking(item)}
                      className="sans text-xs border px-3 py-1 hover:opacity-70 transition-opacity shrink-0"
                      style={{ borderColor: 'var(--fg)' }}
                    >
                      Check In
                    </button>
                  )}
                </div>
                {logged && item.todayLog && (
                  <div className="mt-3 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm italic" style={{ color: 'var(--muted)' }}>
                      &ldquo;{item.todayLog.reflection}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
