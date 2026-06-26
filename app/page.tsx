'use client'

import Link from 'next/link'
import { useAppState, today } from '@/lib/store'
import { LifePillar } from '@/lib/types'
import Shield from '@/components/Shield'

function WIPBlock({ filled, total, label }: { filled: number; total: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              background: i < filled ? 'var(--fg)' : 'transparent',
              border: '1px solid var(--fg)',
            }}
          />
        ))}
      </div>
      <span className="sans text-xs" style={{ color: 'var(--muted)' }}>{label}: {filled}/{total}</span>
    </div>
  )
}

const PILLARS: LifePillar[] = ['health', 'learning', 'finance', 'relationships', 'community']

export default function Dashboard() {
  const { state, activeAdjustments, activeLeap } = useAppState()
  const todayStr = today()

  const todayBaselines = state.baselines.map(b => {
    const log = b.logs.find(l => l.date === todayStr)
    return { ...b, todayMet: log?.met ?? null }
  })
  const missedToday = todayBaselines.filter(b => b.todayMet === false).length
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

  const pillarStatus = PILLARS.map(p => {
    const items = state.baselines.filter(b => b.pillar === p)
    const met = items.filter(b => todayBaselines.find(tb => tb.id === b.id)?.todayMet === true)
    return { pillar: p, total: items.length, met: met.length }
  })

  return (
    <div className="p-12 max-w-5xl">
      <div className="border-b pb-6 mb-10" style={{ borderColor: 'var(--border)' }}>
        <p className="sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>Capacity Audit</p>
        <div className="flex gap-10">
          <WIPBlock filled={activeAdjustments.length} total={2} label="Micro WIP" />
          <WIPBlock filled={activeLeap ? 1 : 0} total={1} label="Macro WIP (quarter)" />
        </div>
      </div>

      <h1 className="sans text-3xl font-light mb-2">IntentionalOS</h1>
      <p className="text-sm mb-12" style={{ color: 'var(--muted)' }}>Systemic life architecture. Protect the floor. Defend the shield.</p>

      <div className="grid grid-cols-3 gap-px mb-12" style={{ background: 'var(--border)' }}>
        <div className="p-8" style={{ background: 'var(--bg)' }}>
          <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>The First Eye</p>
          <p className="sans text-lg font-light mb-4">Incremental Gains</p>
          <div className="flex flex-col gap-3 mb-6">
            {[0, 1].map(i => {
              const adj = activeAdjustments[i]
              return (
                <div key={i} className="border p-3" style={{ borderColor: 'var(--border)' }}>
                  {adj ? (
                    <>
                      <p className="sans text-xs font-medium">{adj.title}</p>
                      <p className="sans text-xs mt-1" style={{ color: 'var(--muted)' }}>{adj.logs.length} log entries</p>
                    </>
                  ) : (
                    <p className="sans text-xs" style={{ color: 'var(--muted)' }}>Slot {i + 1} — open</p>
                  )}
                </div>
              )
            })}
          </div>
          <Link href="/first-eye" className="sans text-xs border px-3 py-1.5 hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--fg)' }}>
            Manage
          </Link>
        </div>

        <div className="p-8 flex flex-col items-center" style={{ background: 'var(--bg)' }}>
          <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>The Second Eye</p>
          <p className="sans text-lg font-light mb-6">Consistency Shield</p>
          <Shield status={shieldStatus} daysDefended={streak} />
          <Link href="/second-eye" className="sans text-xs border px-3 py-1.5 mt-6 hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--fg)' }}>
            Check In
          </Link>
        </div>

        <div className="p-8" style={{ background: 'var(--bg)' }}>
          <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>The Third Eye</p>
          <p className="sans text-lg font-light mb-4">Quantum Leap</p>
          <div className="border p-3 mb-6" style={{ borderColor: 'var(--border)' }}>
            {activeLeap ? (
              <>
                <p className="sans text-xs font-medium">{activeLeap.title}</p>
                <p className="sans text-xs mt-1 capitalize" style={{ color: 'var(--muted)' }}>{activeLeap.status}</p>
              </>
            ) : (
              <p className="sans text-xs" style={{ color: 'var(--muted)' }}>No active leap this quarter</p>
            )}
          </div>
          <Link href="/third-eye" className="sans text-xs border px-3 py-1.5 hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--fg)' }}>
            Manage
          </Link>
        </div>
      </div>

      <div>
        <p className="sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>Life Pillars — Today</p>
        <div className="grid grid-cols-5 gap-px" style={{ background: 'var(--border)' }}>
          {pillarStatus.map(({ pillar, total, met }) => (
            <div key={pillar} className="p-4" style={{ background: 'var(--bg)' }}>
              <p className="sans text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>{pillar}</p>
              <p className="sans text-2xl font-light">{met}<span className="text-base" style={{ color: 'var(--muted)' }}>/{total}</span></p>
              <p className="sans text-xs mt-1" style={{ color: 'var(--muted)' }}>baselines met</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
