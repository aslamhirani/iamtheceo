'use client'

import { useState } from 'react'
import { useAppState, today, generateId } from '@/lib/store'

const PROMPTS = [
  'Did you execute your primary practice today with full intention — or to cross it off a list? What is the difference you felt?',
  'Where did your attention go that it should not have gone today? What pulled it?',
  'What decision did you make today out of habit, when deliberate choice was required?',
  'Describe one moment today where you operated from your values. Describe one where you did not.',
  'What is one thing that should have taken longer than you allowed it?',
  'If your most trusted mentor had watched your entire day, what would they note first?',
  'What baseline did you protect today that no one else knows you protected?',
  'What relationship did you invest in this week — and was the quality of that investment genuine?',
  'Did you brush your teeth at a 45-degree angle — or did you brush to cross it off a list?',
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

  const handleClose = () => {
    setFrictionMode(false)
    setSubmitted(false)
    setResponse('')
  }

  if (frictionMode) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center p-16"
        style={{ background: 'var(--bg)', zIndex: 50 }}
      >
        {!submitted ? (
          <>
            <p className="sans text-xs tracking-widest uppercase mb-8" style={{ color: 'var(--muted)' }}>
              High-Friction Reflection — {todayStr}
            </p>
            <p className="text-xl leading-relaxed mb-10 max-w-xl text-center" style={{ maxWidth: 540 }}>
              {currentPrompt}
            </p>
            <textarea
              className="w-full border p-4 text-sm resize-none mb-4"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg)',
                maxWidth: 540,
                minHeight: 140,
              }}
              placeholder="Write with precision. Do not summarize. Describe."
              value={response}
              onChange={e => setResponse(e.target.value)}
              autoFocus
            />
            <div className="flex gap-4" style={{ maxWidth: 540, width: '100%' }}>
              <button
                onClick={handleSubmit}
                disabled={!response.trim()}
                className="sans text-xs border px-5 py-2 hover:opacity-70 disabled:opacity-30"
                style={{ borderColor: 'var(--fg)' }}
              >
                Record
              </button>
              <button
                onClick={handleClose}
                className="sans text-xs px-5 py-2 hover:opacity-70"
                style={{ color: 'var(--muted)' }}
              >
                Exit
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="sans text-xs tracking-widest uppercase mb-8" style={{ color: 'var(--muted)' }}>Recorded</p>
            <p className="sans text-lg font-light mb-10 text-center">Reflection captured.</p>
            <div className="flex gap-4">
              <button
                onClick={handleNext}
                className="sans text-xs border px-5 py-2 hover:opacity-70"
                style={{ borderColor: 'var(--fg)' }}
              >
                Next Prompt
              </button>
              <button
                onClick={handleClose}
                className="sans text-xs px-5 py-2 hover:opacity-70"
                style={{ color: 'var(--muted)' }}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="p-12 max-w-3xl">
      <p className="sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>Module 3</p>
      <h1 className="sans text-3xl font-light mb-2">Reflection</h1>
      <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
        High-friction intentional prompts. Not checkboxes. The system locks the viewport into minimalist canvas mode to prevent passive engagement.
      </p>

      <div className="border p-8 mb-10" style={{ borderColor: 'var(--border)' }}>
        <p className="sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>Today&apos;s Prompt</p>
        <p className="text-lg leading-relaxed mb-6">{currentPrompt}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setFrictionMode(true)}
            className="sans text-xs border px-4 py-2 hover:opacity-70"
            style={{ borderColor: 'var(--fg)' }}
          >
            Enter Reflection Mode
          </button>
          <button
            onClick={() => setPromptIndex(p => (p + 1) % PROMPTS.length)}
            className="sans text-xs px-4 py-2 hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            Different prompt
          </button>
        </div>
      </div>

      {todayReflections.length > 0 && (
        <div className="mb-8">
          <p className="sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
            Today&apos;s Reflections — {todayReflections.length}
          </p>
          <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>
            {todayReflections.map(r => (
              <div key={r.id} className="p-6" style={{ background: 'var(--bg)' }}>
                <p className="sans text-xs italic mb-3" style={{ color: 'var(--muted)' }}>&ldquo;{r.prompt}&rdquo;</p>
                <p className="text-sm leading-relaxed">{r.response}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.reflections.length > todayReflections.length && (
        <div>
          <p className="sans text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>Prior Reflections</p>
          <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>
            {[...state.reflections]
              .filter(r => r.date !== todayStr)
              .reverse()
              .slice(0, 10)
              .map(r => (
                <div key={r.id} className="p-5" style={{ background: 'var(--bg)' }}>
                  <p className="sans text-xs mb-1" style={{ color: 'var(--muted)' }}>{r.date}</p>
                  <p className="sans text-xs italic mb-2" style={{ color: 'var(--muted)' }}>&ldquo;{r.prompt.slice(0, 80)}...&rdquo;</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{r.response.slice(0, 160)}{r.response.length > 160 ? '...' : ''}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
