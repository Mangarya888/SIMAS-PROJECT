const cfg = {
  Tersedia: { bg: 'var(--green-dim)',  text: 'var(--green)',  border: 'var(--green-border)', dot: 'var(--green)' },
  Digunakan:{ bg: 'var(--accent-dim)', text: 'var(--accent-light)', border: 'var(--accent-border)', dot: 'var(--accent-light)' },
  Rusak:    { bg: 'var(--red-dim)',    text: 'var(--red)',    border: 'var(--red-border)',   dot: 'var(--red)' },
}

export default function StatusBadge({ status }: { status: string }) {
  const c = cfg[status as keyof typeof cfg] || cfg.Tersedia
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {status}
    </span>
  )
}
