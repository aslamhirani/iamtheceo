import { LifePillar, PILLAR_SHORT } from '@/lib/types'

const PILLAR_COLORS: Record<LifePillar, { bg: string; fg: string }> = {
  health:        { bg: 'var(--pillar-health)',        fg: 'var(--pillar-health-fg)' },
  mind:          { bg: 'var(--pillar-mind)',          fg: 'var(--pillar-mind-fg)' },
  purpose:       { bg: 'var(--pillar-purpose)',       fg: 'var(--pillar-purpose-fg)' },
  relationships: { bg: 'var(--pillar-relationships)', fg: 'var(--pillar-relationships-fg)' },
  finance:       { bg: 'var(--pillar-finance)',       fg: 'var(--pillar-finance-fg)' },
  character:     { bg: 'var(--pillar-character)',     fg: 'var(--pillar-character-fg)' },
  spirit:        { bg: 'var(--pillar-spirit)',        fg: 'var(--pillar-spirit-fg)' },
}

export default function PillarBadge({ pillar }: { pillar: LifePillar }) {
  const colors = PILLAR_COLORS[pillar]
  return (
    <span
      className="sans inline-flex items-center shrink-0"
      style={{
        background: colors.bg,
        color: colors.fg,
        fontSize: 11,
        fontWeight: 500,
        padding: '2px 8px',
        borderRadius: 4,
        letterSpacing: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {PILLAR_SHORT[pillar]}
    </span>
  )
}
