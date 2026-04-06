export default function SliderInput({ label, min, max, value, onChange }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div
      className="rounded-xl flex flex-col justify-between"
      style={{
        background: 'rgba(57,255,20,0.04)',
        border: '1px solid rgba(57,255,20,0.09)',
        padding: '12px 14px 4px 14px',
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400 leading-tight">{label}</span>
        <span className="text-lg font-mono font-bold ml-2 shrink-0" style={{ color: '#39ff14' }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #39ff14 ${pct}%, rgba(57,255,20,0.12) ${pct}%)`,
        }}
      />
      <div className="flex justify-between" style={{ marginTop: '6px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
