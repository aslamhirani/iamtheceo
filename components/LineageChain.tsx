interface Props {
  directive: string
  expert: string
  source: string
}

export default function LineageChain({ directive, expert, source }: Props) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-start gap-3">
        <span className="sans text-xs px-2 py-0.5 border mt-0.5 shrink-0" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>DIRECTIVE</span>
        <p className="text-sm leading-relaxed">{directive}</p>
      </div>
      <div className="ml-16 flex items-center gap-2" style={{ color: 'var(--muted)' }}>
        <span className="sans text-xs">↓ endorsed by</span>
      </div>
      <div className="flex items-start gap-3">
        <span className="sans text-xs px-2 py-0.5 border mt-0.5 shrink-0" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>EXPERT</span>
        <p className="sans text-sm font-medium">{expert}</p>
      </div>
      <div className="ml-16 flex items-center gap-2" style={{ color: 'var(--muted)' }}>
        <span className="sans text-xs">↓ sourced from</span>
      </div>
      <div className="flex items-start gap-3">
        <span className="sans text-xs px-2 py-0.5 border mt-0.5 shrink-0" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>SOURCE</span>
        <p className="sans text-xs italic" style={{ color: 'var(--muted)' }}>{source}</p>
      </div>
    </div>
  )
}
