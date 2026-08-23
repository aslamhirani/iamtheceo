'use client'

import { useState } from 'react'
import { useAppState, today, generateId } from '@/lib/store'

const PROMPTS = [
  'Which of your 7 flourishing domains received the least attention today — and why did you allow that?',
  'Did you act with full integrity today, or did you compromise your values even slightly? Describe the moment.',
  'Was there a relationship that needed more of you today? What did you give, and what did you withhold?',
  'Describe one moment today where you felt genuine meaning or purpose — not productivity, but meaning.',
  'Where did your attention go that it should not have gone? What pulled it away from what matters?',
  'What decision did you make today out of habit, when deliberate choice was required?',
  'If your most trusted mentor had watched your entire day, what would they note first?',
  'Did you experience any sense of gratitude, awe, or connection to something larger today?',
  'What baseline habit did you protect today that no one else knows you protected?',
  'What friction did you avoid today that you should have leaned into?',
]

export default function Reflection() {
  const { state, addReflection } = useAppState()
  const [frictionMode, setFrictionMode] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const todayStr = today()
  const todayReflections = state.reflections.filter(r => r.date === todayStr)

  const currentPrompt = PROMPTS[promptIndex]

  const handleSubmit = () => {
    if (!response.trim()) return
    addReflection({
      id: generateId(),
      date: todayStr,
      prompt: currentPrompt,
      response: response.trim(),
    })
    setSubmitted(true)
    setResponse('')
  }

  const handleNext = () => {
    setSubmitted(false)
    setPromptIndex(p => (p + 1) % PROMPTS.length)
    setFrictionMode(true)
  }

  if (frictionMode) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '64px 48px',
        background: 'var(--bg)', zIndex: 50,
      }}>
        {!submitted ? (
          <>
            <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 32 }}>
              Reflection — {todayStr}
            </p>
            <p style={{ fontSize: 20, lineHeight: 1.6, marginBottom: 32, maxWidth: 520, textAlign: 'center' }}>
              {currentPrompt}
            </p>
            <textarea
              style={{
                width: '100%', maxWidth: 520, border: '1px solid var(--border)',
                borderRadius: 8, padding: '14px 16px', fontSize: 14,
                fontFamily: 'Georgia, serif', background: 'var(--bg-card)',
                resize: 'none', minHeight: 140, lineHeight: 1.65,
              }}
              placeholder="Write with precision. Do not summarise. Describe."
              value={response}
              onChange={e => setResponse(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16, maxWidth: 520, width: '100%' }}>
              <button
                onClick={handleSubmit}
                disabled={!response.trim()}
                className="btn btn-primary"
              >
                Save reflection
              </button>
              <button onClick={() => { setFrictionMode(false); setResponse(''); }} className="btn btn-ghost">
                Exit
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24 }}>
              Recorded
            </p>
            <p className="sans" style={{ fontSize: 18, fontWeight: 300, marginBottom: 32 }}>Reflection captured.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleNext} className="btn btn-primary">Next prompt</button>
              <button onClick={() => { setFrictionMode(false); setSubmitted(false); }} className="btn btn-ghost">Done</button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <p className="sans" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          Reflection
        </p>
        <h1 className="sans" style={{ fontSize: 24, fontWeight: 300, marginBottom: 8 }}>Daily Reflection</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
          Ten prompts drawn from the 7 flourishing domains. Not checkboxes — written responses only. The reflection mode locks the screen to remove distractions.
        </p>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 32 }}>
        <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
          Today&apos;s Prompt
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>{currentPrompt}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setFrictionMode(true)} className="btn btn-primary">
            Begin reflection
          </button>
          <button
            onClick={() => setPromptIndex(p => (p + 1) % PROMPTS.length)}
            className="btn btn-ghost"
          >
            Different prompt
          </button>
        </div>
      </div>

      {todayReflections.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            Today&apos;s Reflections ({todayReflections.length})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayReflections.map(r => (
              <div key={r.id} className="card" style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 8 }}>&ldquo;{r.prompt}&rdquo;</p>
                <p style={{ fontSize: 14, lineHeight: 1.7 }}>{r.response}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.reflections.filter(r => r.date !== todayStr).length > 0 && (
        <div>
          <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            Past Reflections
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...state.reflections]
              .filter(r => r.date !== todayStr)
              .reverse()
              .slice(0, 10)
              .map(r => (
                <div key={r.id} className="card" style={{ padding: '14px 20px' }}>
                  <p className="sans" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{r.date}</p>
                  <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 6 }}>
                    &ldquo;{r.prompt.slice(0, 80)}...&rdquo;
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
                    {r.response.slice(0, 160)}{r.response.length > 160 ? '...' : ''}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
