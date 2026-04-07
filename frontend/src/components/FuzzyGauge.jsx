export default function FuzzyGauge({ score }) {
  const value = score ?? 0
  const pct = Math.min(Math.max(value / 100, 0), 1)

  const cx = 100, cy = 100, r = 80
  const angle = Math.PI - pct * Math.PI

  const arcPath = (from, to) => {
    const x1 = cx + r * Math.cos(from), y1 = cy - r * Math.sin(from)
    const x2 = cx + r * Math.cos(to),   y2 = cy - r * Math.sin(to)
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  }

  // Needle tip position
  const tipLen = r * 0.70
  const tx = cx + tipLen * Math.cos(angle)
  const ty = cy - tipLen * Math.sin(angle)

  // Arrow triangle — 3 points around the tip
  const arrowSize = 5
  const perpX = -Math.sin(angle)
  const perpY = -Math.cos(angle)
  const arrowPoints = [
    `${tx + Math.cos(angle) * arrowSize},${ty - Math.sin(angle) * arrowSize}`,
    `${tx - perpX * arrowSize * 0.45},${ty - perpY * arrowSize * 0.45}`,
    `${tx + perpX * arrowSize * 0.45},${ty + perpY * arrowSize * 0.45}`,
  ].join(' ')

  const color = value >= 60 ? '#39ff14' : value >= 35 ? '#f0a500' : '#ff4444'

  return (
    <div
      className="rounded-xl flex flex-col"
      style={{
        background: 'rgba(57,255,20,0.04)',
        border: '1px solid rgba(57,255,20,0.09)',
        padding: '12px 14px 8px 14px',
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-400">Fuzzy Score</span>
        <span className="text-lg font-mono font-bold" style={{ color }}>
          {score !== null && score !== undefined ? Math.round(value) : '—'}
        </span>
      </div>

      <svg viewBox="8 10 184 106" width="100%" style={{ overflow: 'visible' }}>
        {/* Background arc */}
        <path d={arcPath(Math.PI, 0)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round" />
        {/* Progress arc */}
        {pct > 0 && (
          <path d={arcPath(Math.PI, angle)} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${color}90)` }} />
        )}
        {/* Needle line */}
        <line
          x1={cx} y1={cy}
          x2={tx} y2={ty}
          stroke={color} strokeWidth="2" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
        {/* Arrowhead */}
        <polygon
          points={arrowPoints}
          fill={color}
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
        {/* Pivot */}
        <circle cx={cx} cy={cy} r="4" fill={color} />
        {/* Zone labels */}
        <text x="22"  y="113" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">Low</text>
        <text x="100" y="36"  textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">Mid</text>
        <text x="178" y="113" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">High</text>
      </svg>
    </div>
  )
}
