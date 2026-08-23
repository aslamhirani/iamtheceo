'use client'

import Link from 'next/link'
import { useAppState, today } from '@/lib/store'
import { LifePillar, PILLAR_SHORT } from '@/lib/types'
import Shield from '@/components/Shield'

const PILLARS: LifePillar[] = ['health', 'mind', 'purpose', 'relationships', 'finance', 'character', 'spirit']

const PILLAR_COLORS: Record<LifePillar, string> = {
  health:        'var(--pillar-health-fg)',
  mind:          'var(--pillar-mind-fg)',
  purpose:       'var(--pillar-purpose-fg)',
  relationships: 'var(--pillar-relationships-fg)',
  finance:       'var(--pillar-finance-fg)',
  character:     'var(--pillar-character-fg)',
  spirit:        'var(--pillar-spirit-fg)',
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function Dashboard() {
  const { state, activeAdjustments, activeLeap } = useAppState()
  const todayStr = today()

  const todayBaselines = state.baselines.map(b => ({
    ...b,
    todayLog: b.logs.find(l => l.date === todayStr) ?? null,
  }))

  const checkedIn = todayBaselines.filter(b => b.todayLog !== null).length
  const missedToday = todayBaselines.filter(b => b.todayLog?.met === false).length
  const total = state.baselines.length
  const shieldStatus = missedToday === 0 ? 'defended' as const : missedToday === 1 ? 'partial' as const : 'breached' as const

  const sortedDates = [...new Set(state.baselines.flatMap(b => b.logs.map(l => l.date)))].sort()
  let streak = 0
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const date = sortedDates[i]
    const allMet = state.baselines.every(b => b.logs.find(l => l.date === date)?.met !== false)
    if (allMet) streak++
    else break
  }

  const pendingCheckins = total - checkedIn
  const pendingLogs = activeAdjustments.filter(a => !a.logs.some(l => l.date === todayStr)).length
  const isNewUser = total === 0 && activeAdjustments.length === 0

  return (
    <div style={{ padding: '40px 48px', maxWidth: 860 }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p className="sans" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {todayLabel()}
        </p>
        <h1 className="sans" style={{ fontSize: 28, fontWeight: 300, color: 'var(--fg)', margin: 0 }}>
          Good day.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
          Grounded in the Global Flourishing Study — 7 domains of a life well lived.
        </p>
      </div>

      {/* New user onboarding */}
      {isNewUser && (
        <div className="card" style={{ padding: 28, marginBottom: 32 }}>
          <p className="sans" style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Welcome — here&apos;s how to start</p>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.7 }}>
            IntentionalOS structures your life around three practices: daily habits that protect the floor,
            small improvements that compound, and a single quarterly structural change.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {[
              { step: 1, title: 'Check in on your daily habits', desc: 'Habits & Shield shows 9 defaults across all 7 flourishing domains. Check in each day.', href: '/second-eye', cta: 'Go to Habits & Shield' },
              { step: 2, title: 'Add a small daily improvement', desc: 'Pick one specific behaviour to practise every day. Max 2 at once — focus is the point.', href: '/first-eye', cta: 'Go to Daily Improvements' },
              { step: 3, title: 'Plan your quarterly big bet', desc: 'One major structural decision per quarter, with a mandatory 7-day reflection before activation.', href: '/third-eye', cta: 'Go to Big Bet' },
            ].map(({ step, title, desc, href, cta }) => (
              <div key={step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span className="sans" style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: step === 1 ? 'var(--fg)' : 'transparent',
                  border: `1px solid ${step === 1 ? 'var(--fg)' : 'var(--border-2)'}`,
                  color: step === 1 ? 'var(--bg)' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600, marginTop: 2,
                }}>
                  {step}
                </span>
                <div>
                  <p className="sans" style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{title}</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/second-eye" className="btn btn-primary">Start with Habits →</Link>
        </div>
      )}

      {/* Today's actions */}
      {!isNewUser && (pendingCheckins > 0 || pendingLogs > 0) && (
        <div style={{ marginBottom: 32 }}>
          <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            Today&apos;s actions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendingCheckins > 0 && (
              <Link href="/second-eye" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '14px 18px',
                transition: 'opacity 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <div>
                  <p className="sans" style={{ fontSize: 14, fontWeight: 500 }}>Check in on your habits</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                    {pendingCheckins} of {total} habits not yet recorded today
                  </p>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: 18, fontWeight: 300 }}>›</span>
              </Link>
            )}
            {pendingLogs > 0 && (
              <Link href="/first-eye" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '14px 18px',
                transition: 'opacity 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <div>
                  <p className="sans" style={{ fontSize: 14, fontWeight: 500 }}>Log your daily improvements</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                    {pendingLogs} improvement{pendingLogs > 1 ? 's' : ''} without a reflection today
                  </p>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: 18, fontWeight: 300 }}>›</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {!isNewUser && pendingCheckins === 0 && pendingLogs === 0 && (
        <div className="card" style={{ padding: '14px 18px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>✓</span>
          <div>
            <p className="sans" style={{ fontSize: 14, fontWeight: 500 }}>All done for today</p>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Every habit logged and every improvement reflected on.</p>
          </div>
        </div>
      )}

      {/* Three practice cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 }}>
        {/* First Eye */}
        <div className="card" style={{ padding: 20 }}>
          <p className="sans" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Daily Improvements
          </p>
          <p className="sans" style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>1% Every Day</p>
          {activeAdjustments.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>No active improvements yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {activeAdjustments.map(a => {
                const logged = a.logs.some(l => l.date === todayStr)
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                      background: logged ? 'var(--fg)' : 'transparent',
                      border: `1.5px solid ${logged ? 'var(--fg)' : 'var(--border-2)'}`,
                    }} />
                    <p style={{ fontSize: 13, color: logged ? 'var(--fg)' : 'var(--muted)' }} className="sans truncate">{a.title}</p>
                  </div>
                )
              })}
            </div>
          )}
          <Link href="/first-eye" className="sans" style={{ fontSize: 12, color: 'var(--muted)' }}>Manage →</Link>
        </div>

        {/* Second Eye */}
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <p className="sans" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Habits & Shield
          </p>
          <p className="sans" style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Consistency</p>
          <Shield status={shieldStatus} daysDefended={streak} />
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, marginBottom: 12 }}>
            {checkedIn}/{total} habits checked in
          </p>
          <Link href="/second-eye" className="sans" style={{ fontSize: 12, color: 'var(--muted)' }}>Check in →</Link>
        </div>

        {/* Third Eye */}
        <div className="card" style={{ padding: 20 }}>
          <p className="sans" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Big Bet
          </p>
          <p className="sans" style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Quarterly Shift</p>
          {activeLeap ? (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 500 }} className="sans">{activeLeap.title}</p>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }} className="sans capitalize">
                {activeLeap.status === 'blueprinting' ? 'In 7-day review' : activeLeap.status}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>No active bet this quarter.</p>
          )}
          <Link href="/third-eye" className="sans" style={{ fontSize: 12, color: 'var(--muted)' }}>Manage →</Link>
        </div>
      </div>

      {/* 7 Flourishing Domains */}
      {!isNewUser && (
        <div>
          <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            7 Domains of Flourishing — Today
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {PILLARS.map(p => {
              const items = state.baselines.filter(b => b.pillar === p)
              const met = items.filter(b => todayBaselines.find(tb => tb.id === b.id)?.todayLog?.met === true).length
              const pct = items.length > 0 ? met / items.length : 0
              return (
                <div key={p} className="card" style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', margin: '0 auto 8px',
                    background: pct === 1 ? PILLAR_COLORS[p] : 'transparent',
                    border: `2px solid ${pct > 0 ? PILLAR_COLORS[p] : 'var(--border)'}`,
                  }} />
                  <p className="sans" style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.3 }}>
                    {PILLAR_SHORT[p]}
                  </p>
                  {items.length > 0 && (
                    <p className="sans" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                      {met}/{items.length}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
