'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, validateEmail, validatePassword } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  useEffect(() => { emailRef.current?.focus() }, [])

  const handleEmailBlur = () => {
    setEmailTouched(true)
    setEmailError(validateEmail(email) ?? '')
  }

  const handlePasswordBlur = () => {
    setPasswordTouched(true)
    setPasswordError(validatePassword(password) ?? '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailTouched(true)
    setPasswordTouched(true)
    setFormError('')

    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailError(eErr ?? '')
    setPasswordError(pErr ?? '')
    if (eErr || pErr) return

    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      setFormError(error)
      return
    }

    router.replace('/')
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel — brand */}
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
            &ldquo;Protect the floor.<br />Defend the shield.&rdquo;
          </p>
          <p className="sans text-xs opacity-50 leading-relaxed">
            Systemic life architecture engineered for permanence. Not another productivity app.
          </p>
        </div>
        <p className="sans text-xs opacity-30">
          Aga Khan Trust for Culture × Behavioral Science
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <p className="sans text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>
              Welcome back
            </p>
            <h1 className="sans text-2xl font-light">Sign in</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-5">
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
                  setFormError('')
                }}
                onBlur={handleEmailBlur}
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

            {/* Password */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="sans text-xs" style={{ color: 'var(--muted)' }}>
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="sans text-xs hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--fg)' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    if (passwordTouched) setPasswordError(validatePassword(e.target.value) ?? '')
                    setFormError('')
                  }}
                  onBlur={handlePasswordBlur}
                  className="w-full border px-4 text-sm pr-12"
                  style={{
                    borderColor: passwordError ? '#B91C1C' : 'var(--border)',
                    background: 'var(--bg)',
                    height: 48,
                    outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = passwordError ? '#B91C1C' : 'var(--fg)' }}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  aria-invalid={!!passwordError}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 sans text-xs hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="sans text-xs mt-1.5" style={{ color: '#B91C1C' }} role="alert">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Form-level error */}
            {formError && (
              <div
                className="border px-4 py-3 mt-4"
                style={{ borderColor: '#B91C1C', background: '#FEF2F2' }}
                role="alert"
              >
                <p className="sans text-xs" style={{ color: '#B91C1C' }}>{formError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full sans text-sm mt-6 flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-50"
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
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="sans text-xs text-center mt-8" style={{ color: 'var(--muted)' }}>
            No account?{' '}
            <Link href="/signup" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--fg)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
