'use client'

import Link from 'next/link'
import { useAppState, today } from '@/lib/store'
import { LifePillar, PILLAR_LABELS } from '@/lib/types'
import Shield from '@/components/Shield'

const PILLARS: LifePillar[] = ['health', 'learning', 'finance', 'relationships', 'community']

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function Dashboard() {
  const { state, activeAdjustments, activeLeap } = useAppState()
  const todayStr = today()

  const todayBaselines = state.baselines.map(b => {
    const log = b.logs.find(l => l.date === todayStr)
    return { ...b, todayMet: log?.met ?? null }
  })
  const checkedIn = todayBaselines.filter(b => b.todayMet !== null).length
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

  const totalBaselines = state.baselines.length
  const pendingCheckins = totalBaselines - checkedIn
  const pendingLogs = activeAdjustments.filter(a => !a.logs.some(l => l.date === todayStr)).length

  const isNewUser = totalBaselines === 0 && activeAdjustments.length === 0

  return (
    <div className="p-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>{todayLabel()}</p>
        <h1 className="sans text-2xl font-light">Good day.</h1>
      </div>

      {/* New user welcome */}
      {isNewUser && (
        <div className="border p-6 mb-8" style={{ borderColor: 'var(--border)' }}>
          <p className="sans text-sm font-medium mb-2">Welcome to IntentionalOS</p>
          <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
            This system has three layers of practice. Start with your daily habits — the non-negotiables you protect every single day.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-4">
              <span className="sans text-xs border w-6 h-6 flex items-center justify-center shrink-0 mt-0.5" style={{ borderColor: 'var(--fg)' }}>1</span>
              <div>
                <p className="sans text-sm font-medium">Set your daily habits</p>
                <p className="sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  Go to <strong>Habits & Shield</strong> to see your 5 pre-loaded baseline habits — or add your own.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="sans text-xs border w-6 h-6 flex items-center justify-center shrink-0 mt-0.5" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>2</span>
              <div>
                <p className="sans text-sm" style={{ color: 'var(--muted)' }}>Add a 1% improvement</p>
                <p className="sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  Go to <strong>Daily Improvements</strong> to add a small, specific habit you want to compound.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="sans text-xs border w-6 h-6 flex items-center justify-center shrink-0 mt-0.5" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>3</span>
              <div>
                <p className="sans text-sm" style={{ color: 'var(--muted)' }}>Plan a big structural change</p>
                <p className="sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  Go to <strong>Big Bet</strong> when you&apos;re ready for a quarterly, irreversible life shift.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <Link href="/second-eye" className="sans text-xs border px-4 py-2 hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--fg)' }}>
              Start with Habits →
            </Link>
          </div>
        </div>
      )}

      {/* Today's actions — only when there's data */}
      {!isNewUser && (
        <div className="mb-8">
          <p className="sans text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--muted)' }}>Today&apos;s actions</p>
          <div className="flex flex-col gap-2">
            {pendingCheckins > 0 && (
              <Link
                href="/second-eye"
                className="flex items-center justify-between border p-4 hover:opacity-80 transition-opacity"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <p className="sans text-sm font-medium">Check in on your habits</p>
                  <p className="sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {pendingCheckins} of {totalBaselines} not yet recorded today
                  </p>
                </div>
                <span className="sans text-xs" style={{ color: 'var(--muted)' }}>→</span>
              </Link>
            )}
            {pendingLogs > 0 && (
              <Link
                href="/first-eye"
                className="flex items-center justify-between border p-4 hover:opacity-80 transition-opacity"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <p className="sans text-sm font-medium">Log your daily improvements</p>
                  <p className="sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {pendingLogs} improvement{pendingLogs > 1 ? 's' : ''} without a reflection today
                  </p>
                </div>
                <span className="sans text-xs" style={{ color: 'var(--muted)' }}>→</span>
              </Link>
            )}
            {pendingCheckins === 0 && pendingLogs === 0 && (
              <div className="border p-4" style={{ borderColor: 'var(--border)' }}>
                <p className="sans text-sm font-medium">All done for today</p>
                <p className="sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Every habit checked in and every improvement logged.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Three system cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Daily Improvements */}
        <div className="border p-5" style={{ borderColor: 'var(--border)' }}>
          <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)', fontSize: 10 }}>First Eye</p>
          <p className="sans text-sm font-medium mb-1">Daily Improvements</p>
          <p className="sans text-xs mb-4" style={{ color: 'var(--muted)' }}>1% compound habits. Max 2 at once.</p>
          {activeAdjustments.length === 0 ? (
            <p className="sans text-xs mb-4" style={{ color: 'var(--muted)' }}>No active improvements yet.</p>
          ) : (
            <div className="flex flex-col gap-1.5 mb-4">
              {activeAdjustments.map(a => {
                const loggedToday = a.logs.some(l => l.date === todayStr)
                return (
                  <div key={a.id} className="flex items-center gap-2">
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: loggedToday ? 'var(--fg)' : 'transparent',
                      border: '1px solid var(--fg)',
                      flexShrink: 0,
                    }} />
                    <p className="sans text-xs truncate">{a.title}</p>
                  </div>
                )
              })}
            </div>
          )}
          <Link href="/first-eye" className="sans text-xs hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
            Manage →
          </Link>
        </div>

        {/* Habits & Shield */}
        <div className="border p-5 flex flex-col items-center text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)', fontSize: 10 }}>Second Eye</p>
          <p className="sans text-sm font-medium mb-3">Habits & Shield</p>
          <Shield status={shieldStatus} daysDefended={streak} />
          <p className="sans text-xs mt-3 mb-3" style={{ color: 'var(--muted)' }}>
            {checkedIn}/{totalBaselines} habits checked in today
          </p>
          <Link href="/second-eye" className="sans text-xs hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
            Check in →
          </Link>
        </div>

        {/* Big Bet */}
        <div className="border p-5" style={{ borderColor: 'var(--border)' }}>
          <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)', fontSize: 10 }}>Third Eye</p>
          <p className="sans text-sm font-medium mb-1">Big Bet</p>
          <p className="sans text-xs mb-4" style={{ color: 'var(--muted)' }}>One structural change per quarter.</p>
          {activeLeap ? (
            <div className="mb-4">
              <p className="sans text-xs font-medium truncate">{activeLeap.title}</p>
              <p className="sans text-xs mt-0.5 capitalize" style={{ color: 'var(--muted)' }}>{activeLeap.status}</p>
            </div>
          ) : (
            <p className="sans text-xs mb-4" style={{ color: 'var(--muted)' }}>No active bet this quarter.</p>
          )}
          <Link href="/third-eye" className="sans text-xs hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
            Manage →
          </Link>
        </div>
      </div>

      {/* Life Pillars */}
      {!isNewUser && (
        <div>
          <p className="sans text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--muted)' }}>Life Pillars — Today</p>
          <div className="grid grid-cols-5 gap-px" style={{ background: 'var(--border)' }}>
            {PILLARS.map(p => {
              const items = state.baselines.filter(b => b.pillar === p)
              const met = items.filter(b => todayBaselines.find(tb => tb.id === b.id)?.todayMet === true).length
              return (
                <div key={p} className="p-4" style={{ background: 'var(--bg)' }}>
                  <p className="sans text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontSize: 10 }}>
                    {PILLAR_LABELS[p]}
                  </p>
                  <p className="sans text-xl font-light">
                    {met}<span className="text-sm" style={{ color: 'var(--muted)' }}>/{items.length}</span>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
