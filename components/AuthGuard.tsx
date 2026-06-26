'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Nav from '@/components/Nav'

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  const isPublic = PUBLIC_PATHS.includes(pathname)

  useEffect(() => {
    const session = getSession()
    if (!session && !isPublic) {
      router.replace('/login')
    } else if (session && isPublic) {
      router.replace('/')
    } else {
      setChecked(true)
    }
  }, [pathname, router, isPublic])

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
        <div
          className="rounded-full animate-spin"
          style={{ width: 24, height: 24, border: '1px solid var(--border)', borderTopColor: 'var(--fg)' }}
        />
      </div>
    )
  }

  if (isPublic) {
    // Auth pages: full-screen, no nav
    return <>{children}</>
  }

  return (
    <>
      <Nav />
      <main className="flex-1 ml-48 min-h-full">
        {children}
      </main>
    </>
  )
}
