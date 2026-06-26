import { LifePillar, PILLAR_LABELS } from '@/lib/types'

const PILLAR_ABBR: Record<LifePillar, string> = {
  health: 'HL',
  learning: 'LN',
  finance: 'FN',
  relationships: 'RL',
  community: 'CM',
}

export default function PillarBadge({ pillar }: { pillar: LifePillar }) {
  return (
    <span
      className="sans text-xs px-2 py-0.5 border"
      style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      title={PILLAR_LABELS[pillar]}
    >
      {PILLAR_ABBR[pillar]}
    </span>
  )
}
