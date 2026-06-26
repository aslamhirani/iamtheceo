'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Overview', abbr: 'OV' },
  { href: '/first-eye', label: 'First Eye', abbr: 'I' },
  { href: '/second-eye', label: 'Second Eye', abbr: 'II' },
  { href: '/third-eye', label: 'Third Eye', abbr: 'III' },
  { href: '/knowledge-base', label: 'Knowledge Base', abbr: 'KB' },
  { href: '/reflection', label: 'Reflection', abbr: 'RF' },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav className="fixed left-0 top-0 h-full w-48 border-r flex flex-col pt-10 pb-8 px-6" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
      <div className="mb-10">
        <p className="sans text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>IntentionalOS</p>
        <p className="sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>v2.0</p>
      </div>
      <ul className="flex flex-col gap-1 flex-1">
        {links.map(l => {
          const active = pathname === l.href
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex items-center gap-3 py-2 px-2 sans text-sm transition-colors"
                style={{
                  color: active ? 'var(--fg)' : 'var(--muted)',
                  borderLeft: active ? '2px solid var(--fg)' : '2px solid transparent',
                  paddingLeft: active ? '10px' : '12px',
                }}
              >
                <span className="sans text-xs w-5 text-right" style={{ color: 'var(--muted)' }}>{l.abbr}</span>
                {l.label}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="sans text-xs" style={{ color: 'var(--muted)' }}>
        <p>Protect the floor.</p>
        <p>Defend the shield.</p>
      </div>
    </nav>
  )
}
