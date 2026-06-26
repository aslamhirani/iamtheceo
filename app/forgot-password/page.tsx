'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { validateEmail } from '@/lib/auth'

type Step = 'input' | 'sent'

export default function ForgotPasswordPage() {
  const emailRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>('input')
  const [emailTouched, setEmailTouched] = useState(false)

  useEffect(() => { emailRef.current?.focus() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailTouched(true)
    const err = validateEmail(email)
    setEmailError(err ?? '')
    if (err) return

    setLoading(true)
    // Simulate network latency — standard UX pattern: never reveal if email exists
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setStep('sent')
  }

  if (step === 'sent') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-sm text-center">
          {/* Success mark */}
          <div
            className="mx-auto mb-8 flex items-center justify-center border"
            style={{ width: 56, height: 56, borderColor: 'var(--fg)' }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M4 11.5L9 16.5L18 7" stroke="var(--fg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="sans text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>
            Check your email
          </p>
          <h1 className="sans text-2xl font-light mb-4">Instructions sent</h1>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
            If an account exists for <strong style={{ color: 'var(--fg)', fontStyle: 'normal' }}>{email}</strong>, you will receive a password reset link within a few minutes.
          </p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
            Check your spam folder if it doesn&apos;t arrive.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setStep('input'); setEmail(''); setEmailTouched(false) }}
              className="sans text-xs border px-4 py-3 w-full hover:opacity-70 transition-opacity"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              Try a different email
            </button>
            <Link
              href="/login"
              className="sans text-xs flex items-center justify-center border px-4 py-3 w-full hover:opacity-80 transition-opacity"
              style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-80 p-12 shrink-0"
        style={{ background: 'var(--fg)', color: 'var(--bg)' }}
      >
        <div>
          <p className="sans text-xs tracking-widest uppercase opacity-60 mb-3">IntentionalOS</p>
          <p className="sans text-xs opacity-40">v2.0</p>
        </div>
        <div>
          <p className="text-2xl font-light leading-relaxed mb-6">
            &ldquo;The system,<br />not the goal,<br />determines<br />the outcome.&rdquo;
          </p>
          <p className="sans text-xs opacity-50">— James Clear</p>
        </div>
        <p className="sans text-xs opacity-30">
          Aga Khan Trust for Culture × Behavioral Science
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link
            href="/login"
            className="sans text-xs flex items-center gap-2 mb-10 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to sign in
          </Link>

          <div className="mb-10">
            <p className="sans text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>
              Account recovery
            </p>
            <h1 className="sans text-2xl font-light mb-3">Forgot password?</h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Enter the email you signed up with. We&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label htmlFor="email" className="sans text-xs block mb-1.5" style={{ color: 'var(--muted)' }}>
                Email address
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  if (emailTouched) setEmailError(validateEmail(e.target.value) ?? '')
                }}
                onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email) ?? '') }}
                className="w-full border px-4 text-sm"
                style={{
                  borderColor: emailError ? '#B91C1C' : 'var(--border)',
                  background: 'var(--bg)',
                  height: 48,
                  outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = emailError ? '#B91C1C' : 'var(--fg)' }}
                aria-describedby={emailError ? 'email-error' : undefined}
                aria-invalid={!!emailError}
              />
              {emailError && (
                <p id="email-error" className="sans text-xs mt-1.5" style={{ color: '#B91C1C' }} role="alert">
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sans text-sm flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{
                height: 48,
                background: 'var(--fg)',
                color: 'var(--bg)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    style={{ width: 14, height: 14, border: '1px solid rgba(250,250,248,0.3)', borderTopColor: 'var(--bg)' }}
                    className="animate-spin rounded-full inline-block"
                  />
                  Sending…
                </span>
              ) : 'Send reset link'}
            </button>
          </form>

          <p className="sans text-xs text-center mt-8" style={{ color: 'var(--muted)' }}>
            Remember your password?{' '}
            <Link href="/login" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--fg)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
