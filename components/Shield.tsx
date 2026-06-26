type ShieldStatus = 'defended' | 'partial' | 'breached'

interface Props {
  status: ShieldStatus
  daysDefended: number
}

const STATUS_COLOR: Record<ShieldStatus, string> = {
  defended: '#0A0A0A',
  partial: '#9CA3AF',
  breached: '#D1D5DB',
}

const STATUS_LABEL: Record<ShieldStatus, string> = {
  defended: 'DEFENDED',
  partial: 'PARTIAL',
  breached: 'BREACHED',
}

export default function Shield({ status, daysDefended }: Props) {
  const color = STATUS_COLOR[status]
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
        <svg viewBox="0 0 100 100" width={160} height={160} aria-label="Consistency Shield">
          <path
            d="M50 5 L90 18 L95 50 L90 78 L50 95 L10 78 L5 50 L10 18 Z"
            fill={color}
          />
          <text
            x="50"
            y="52"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FAFAF8"
            fontSize="11"
            fontFamily="Helvetica Neue, Arial, sans-serif"
            fontWeight="400"
            letterSpacing="-0.5"
          >
            {daysDefended}d
          </text>
        </svg>
      </div>
      <div className="text-center">
        <p className="sans text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
          {STATUS_LABEL[status]}
        </p>
        <p className="sans text-lg font-light mt-1">
          {daysDefended} {daysDefended === 1 ? 'day' : 'days'} defended
        </p>
      </div>
    </div>
  )
}
