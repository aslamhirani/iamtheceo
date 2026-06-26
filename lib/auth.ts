'use client'

const USERS_KEY = 'intentionalos_users'
const SESSION_KEY = 'intentionalos_session'

interface StoredUser {
  id: string
  email: string
  passwordHash: string
  createdAt: string
}

interface Session {
  userId: string
  email: string
  expiresAt: number
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'intentionalos_salt_v2')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session: Session = JSON.parse(raw)
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

function createSession(user: StoredUser): Session {
  const session: Session = {
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY)
}

export async function signUp(email: string, password: string): Promise<{ error?: string }> {
  const normalizedEmail = email.trim().toLowerCase()
  const users = getUsers()

  if (users.find(u => u.email === normalizedEmail)) {
    return { error: 'An account with this email already exists.' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const passwordHash = await hashPassword(password)
  const newUser: StoredUser = {
    id: generateId(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])
  createSession(newUser)
  return {}
}

export async function signIn(email: string, password: string): Promise<{ error?: string }> {
  const normalizedEmail = email.trim().toLowerCase()
  const users = getUsers()
  const user = users.find(u => u.email === normalizedEmail)

  // Generic error — never reveal whether email exists
  if (!user) {
    return { error: 'Incorrect email or password.' }
  }

  const passwordHash = await hashPassword(password)
  if (passwordHash !== user.passwordHash) {
    return { error: 'Incorrect email or password.' }
  }

  createSession(user)
  return {}
}

export function emailExists(email: string): boolean {
  const users = getUsers()
  return !!users.find(u => u.email === email.trim().toLowerCase())
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.'
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  return null
}
