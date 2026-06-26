'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSession, signOut } from '@/lib/auth'

const groups = [
  {
    label: 'Daily Practice',
    links: [
      { href: '/', label: 'Dashboard' },
      { href: '/first-eye', label: 'Daily Improvements' },
      { href: '/second-eye', label: 'Habits & Shield' },
    ],
  },
  {
    label: 'Strategy',
    links: [
      { href: '/third-eye', label: 'Big Bet' },
      { href: '/knowledge-base', label: 'Knowledge Base' },
    ],
  },
  {
    label: 'Reflect',
    links: [
      { href: '/reflection', label: 'Reflection' },
    ],
  },
]

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const session = getSession()

  const normalizedPath = pathname.replace(/\/$/, '') || '/'

  const handleSignOut = () => {
    signOut()
    router.replace('/login')
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-52 border-r flex flex-col pt-8 pb-6 px-5" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
      <div className="mb-8">
        <p className="sans text-sm font-medium" style={{ color: 'var(--fg)' }}>IntentionalOS</p>
        <p className="sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>v2.0</p>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {groups.map(group => (
          <div key={group.label}>
            <p className="sans tracking-widest uppercase mb-2 px-2" style={{ color: 'var(--muted)', fontSize: 10 }}>
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.links.map(l => {
                const active = normalizedPath === l.href
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center py-1.5 px-2 sans text-sm transition-opacity hover:opacity-70"
                      style={{
                        color: active ? 'var(--fg)' : 'var(--muted)',
                        background: active ? 'rgba(10,10,10,0.06)' : 'transparent',
                        fontWeight: active ? 500 : 400,
                        borderLeft: active ? '2px solid var(--fg)' : '2px solid transparent',
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
        {session && (
          <p className="sans text-xs mb-3 truncate" style={{ color: 'var(--muted)' }} title={session.email}>
            {session.email}
          </p>
        )}
        <button
          onClick={handleSignOut}
          className="sans text-xs hover:opacity-70 transition-opacity block"
          style={{ color: 'var(--muted)' }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
