const OPTIONS = ['Low', 'Medium', 'High']

export default function DropdownInput({ label, value, onChange }) {
  return (
    <div
      className="rounded-xl flex flex-col justify-between"
      style={{
        background: 'rgba(57,255,20,0.04)',
        border: '1px solid rgba(57,255,20,0.09)',
        padding: '12px 14px 10px 14px',
      }}
    >
      <span className="text-sm text-gray-400 block" style={{ marginBottom: '10px' }}>{label}</span>
      <div
        className="relative w-full rounded-lg overflow-hidden"
        style={{ border: '1px solid rgba(57,255,20,0.18)', background: 'rgba(10,18,10,0.95)' }}
      >
        <select
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full py-2 text-sm font-semibold cursor-pointer outline-none appearance-none"
          style={{ background: 'transparent', color: '#39ff14', paddingLeft: '10px', paddingRight: '28px' }}
        >
          {OPTIONS.map((opt, i) => (
            <option key={i} value={i} style={{ background: '#0d0f0d' }}>
              {opt}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs"
          style={{ color: 'rgba(57,255,20,0.5)' }}
        >▾</span>
      </div>
    </div>
  )
}
