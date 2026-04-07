export default function RuleDisplay({ rule }) {
  const pass = rule?.prediction === 1
  const confidence = rule?.confidence ?? null
  const color = rule ? (pass ? '#39ff14' : '#ff4444') : 'rgba(255,255,255,0.15)'

  const seen = new Set()
  const unique = rule ? [...rule.conditions].reverse().filter(c => {
    if (seen.has(c.feature)) return false
    seen.add(c.feature)
    return true
  }).reverse() : []

  return (
    <div
      className="rounded-xl flex flex-col h-full"
      style={{
        background: 'rgba(57,255,20,0.04)',
        border: '1px solid rgba(57,255,20,0.09)',
        padding: '12px 14px 10px 14px',
      }}
    >
      {/* Title */}
      <span className="text-sm text-gray-400 mb-3">Active Rule</span>

      {/* Rules — staircase centered */}
      <div className="flex flex-col gap-2 flex-1 justify-center items-center">
        <div className="flex flex-col gap-2" style={{ width: 'fit-content' }}>
          {unique.map((c, i) => (
            <div key={i} className="flex items-baseline gap-2" style={{ paddingLeft: `${i * 25}px` }}>
              <span className="text-sm shrink-0" style={{ color: 'rgba(255,255,255,0.3)', minWidth: '5px', textAlign: i === 0 ? 'right' : 'left' }}>
                {i === 0 ? 'IF' : 'AND'}
              </span>
              <span className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {c.feature.replace(/_/g, ' ')}
              </span>
              <span className="text-base" style={{ color: 'rgba(57,255,20,0.6)' }}>
                {c.operator}
              </span>
              <span className="text-base font-mono font-semibold" style={{ color: '#39ff14' }}>
                {c.threshold}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Result + bar (same as ModelCard) */}
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold shrink-0 w-8" style={{ color }}>
            {rule ? (pass ? 'PASS' : 'FAIL') : '—'}
          </span>
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.08)' }}>
            {confidence !== null && (
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${confidence * 100}%`,
                  background: color,
                  boxShadow: `0 0 6px ${color}80`,
                }}
              />
            )}
          </div>
          <span className="text-sm font-mono font-semibold shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {confidence !== null ? `${(confidence * 100).toFixed(1)}%` : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
