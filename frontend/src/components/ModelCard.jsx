const MODEL_LABELS = {
  random_forest:  'Random Forest',
  svm:            'SVM',
  knn:            'KNN',
  neural_network: 'Neural Network',
}

export default function ModelCard({ model, result }) {
  const label = MODEL_LABELS[model] ?? model
  const pass = result?.prediction === 1
  const confidence = result?.confidence ?? null
  const color = result ? (pass ? '#39ff14' : '#ff4444') : 'rgba(255,255,255,0.15)'

  return (
    <div
      className="rounded-xl flex flex-col gap-2"
      style={{
        background: 'rgba(57,255,20,0.04)',
        border: '1px solid rgba(57,255,20,0.09)',
        padding: '14px 16px 12px 16px',
      }}
    >
      <span className="text-base text-gray-400 leading-tight">{label}</span>

      <div className="flex justify-between items-center">
        <span className="text-lg font-bold" style={{ color }}>
          {result ? (pass ? 'PASS' : 'FAIL') : '—'}
        </span>
        <span className="text-xl font-mono font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {confidence !== null ? `${(confidence * 100).toFixed(1)}%` : '—'}
        </span>
      </div>

      <div className="w-full rounded-full overflow-hidden" style={{ height: '5px', background: 'rgba(255,255,255,0.08)' }}>
        {confidence !== null && (
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${confidence * 100}%`,
              background: color,
              boxShadow: `0 0 6px ${color}80`,
            }}
          />
        )}
      </div>
    </div>
  )
}
