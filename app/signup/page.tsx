'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp, validateEmail, validatePassword } from '@/lib/auth'

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length

  const label = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][score]
  const colors = ['#B91C1C', '#B91C1C', '#D97706', '#16A34A', '#16A34A']
  const color = colors[score]

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              height: 3,
              flex: 1,
              background: i < score ? color : 'var(--border)',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
      <p className="sans text-xs" style={{ color }}>{label}</p>
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmTouched, setConfirmTouched] = useState(false)

  useEffect(() => { emailRef.current?.focus() }, [])

  const validateConfirm = (val: string) => {
    if (!val) return 'Please confirm your password.'
    if (val !== password) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailTouched(true)
    setPasswordTouched(true)
    setConfirmTouched(true)
    setFormError('')

    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    const cErr = validateConfirm(confirm)
    setEmailError(eErr ?? '')
    setPasswordError(pErr ?? '')
    setConfirmError(cErr ?? '')
    if (eErr || pErr || cErr) return

    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)

    if (error) {
      setFormError(error)
      return
    }

    router.replace('/')
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
            &ldquo;A 1% daily<br />improvement<br />compounds to<br />37× better.&rdquo;
          </p>
          <p className="sans text-xs opacity-50">— James Clear, Atomic Habits</p>
        </div>
        <p className="sans text-xs opacity-30">
          Aga Khan Trust for Culture × Behavioral Science
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <p className="sans text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>
              Begin your architecture
            </p>
            <h1 className="sans text-2xl font-light">Create account</h1>
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

            {/* Password */}
            <div className="mb-5">
              <label htmlFor="password" className="sans text-xs block mb-1.5" style={{ color: 'var(--muted)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    if (passwordTouched) setPasswordError(validatePassword(e.target.value) ?? '')
                    if (confirmTouched && confirm) setConfirmError(validateConfirm(confirm) ?? '')
                  }}
                  onBlur={() => { setPasswordTouched(true); setPasswordError(validatePassword(password) ?? '') }}
                  className="w-full border px-4 text-sm pr-12"
                  style={{
                    borderColor: passwordError ? '#B91C1C' : 'var(--border)',
                    background: 'var(--bg)',
                    height: 48,
                    outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = passwordError ? '#B91C1C' : 'var(--fg)' }}
                  aria-describedby="password-error password-strength"
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
              <div id="password-strength">
                <PasswordStrength password={password} />
              </div>
            </div>

            {/* Confirm password */}
            <div className="mb-2">
              <label htmlFor="confirm" className="sans text-xs block mb-1.5" style={{ color: 'var(--muted)' }}>
                Confirm password
              </label>
              <input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={e => {
                  setConfirm(e.target.value)
                  if (confirmTouched) setConfirmError(validateConfirm(e.target.value) ?? '')
                }}
                onBlur={() => { setConfirmTouched(true); setConfirmError(validateConfirm(confirm) ?? '') }}
                className="w-full border px-4 text-sm"
                style={{
                  borderColor: confirmError ? '#B91C1C' : confirm && confirm === password ? '#16A34A' : 'var(--border)',
                  background: 'var(--bg)',
                  height: 48,
                  outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = confirmError ? '#B91C1C' : 'var(--fg)' }}
                aria-describedby={confirmError ? 'confirm-error' : undefined}
                aria-invalid={!!confirmError}
              />
              {confirmError ? (
                <p id="confirm-error" className="sans text-xs mt-1.5" style={{ color: '#B91C1C' }} role="alert">
                  {confirmError}
                </p>
              ) : confirm && confirm === password ? (
                <p className="sans text-xs mt-1.5" style={{ color: '#16A34A' }}>Passwords match</p>
              ) : null}
            </div>

            {formError && (
              <div className="border px-4 py-3 mt-4" style={{ borderColor: '#B91C1C', background: '#FEF2F2' }} role="alert">
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
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>

            <p className="sans text-xs text-center mt-4" style={{ color: 'var(--muted)' }}>
              By creating an account, your data stays on this device.
            </p>
          </form>

          <p className="sans text-xs text-center mt-8" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--fg)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
