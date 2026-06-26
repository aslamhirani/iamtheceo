import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'IntentionalOS',
  description: 'Systemic life architecture. Engineered for permanence.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex" style={{ background: 'var(--bg)' }}>
        <Nav />
        <main className="flex-1 ml-48 min-h-full">
          {children}
        </main>
      </body>
    </html>
  )
}
