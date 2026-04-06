import { useState } from 'react'
import SliderInput from './components/SliderInput'
import DropdownInput from './components/DropdownInput'

const SLIDERS = [
  { key: 'Attendance',        label: 'Attendance (%)',    min: 60, max: 100, mean: 80 },
  { key: 'Hours_Studied',     label: 'Hours Studied',     min: 1,  max: 44,  mean: 20 },
  { key: 'Previous_Scores',   label: 'Previous Scores',   min: 50, max: 100, mean: 75 },
  { key: 'Tutoring_Sessions', label: 'Tutoring Sessions', min: 0,  max: 8,   mean: 2  },
  { key: 'Sleep_Hours',       label: 'Sleep Hours',       min: 4,  max: 10,  mean: 7  },
  { key: 'Physical_Activity', label: 'Physical Activity', min: 0,  max: 6,   mean: 3  },
]

const DROPDOWNS = [
  { key: 'Parental_Involvement',     label: 'Parental Involvement' },
  { key: 'Access_to_Resources',      label: 'Access to Resources'  },
  { key: 'Peer_Influence',           label: 'Peer Influence'       },
  { key: 'Family_Income',            label: 'Family Income'        },
  { key: 'Parental_Education_Level', label: 'Parental Education'   },
  { key: 'Distance_from_Home',       label: 'Distance from Home'   },
]

const defaultValues = () => {
  const v = {}
  SLIDERS.forEach(s => { v[s.key] = s.mean })
  DROPDOWNS.forEach(d => { v[d.key] = 1 })
  return v
}

function Card({ title, subtitle, children, style = {} }) {
  return (
    <div className="glass rounded-2xl flex flex-col" style={style}>
      <div style={{ padding: '16px 18px 10px 18px' }}>
        <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#39ff14' }}>
          {title}
        </span>
        {subtitle && (
          <span className="text-sm ml-2 font-normal" style={{ color: 'rgba(255,255,255,0.3)' }}> — {subtitle}</span>
        )}
      </div>
      <div style={{ padding: '0 18px 16px 18px' }} className="flex flex-col flex-1 min-h-0">
        {children}
      </div>
    </div>
  )
}

function App() {
  const [values, setValues] = useState(defaultValues)
  const set = (key, val) => setValues(prev => ({ ...prev, [key]: val }))

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ padding: '18px 24px 80px 24px' }}>

      {/* Header */}
      <div className="shrink-0" style={{ marginBottom: '16px' }}>
        <h1 className="text-3xl font-bold leading-none" style={{ color: '#39ff14' }}>
          GradeScope <span className="text-2xl font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>— Student Performance Predictor</span>
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 min-h-0 grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>

        {/* Left column */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* Academic */}
          <Card title="Academic" subtitle="numeric performance factors" style={{ flex: 3 }}>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {SLIDERS.map(s => (
                <SliderInput
                  key={s.key}
                  label={s.label}
                  min={s.min}
                  max={s.max}
                  value={values[s.key]}
                  onChange={val => set(s.key, val)}
                />
              ))}
            </div>
          </Card>

          {/* Background */}
          <Card title="Background" subtitle="socioeconomic factors" style={{ flex: 2 }}>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {DROPDOWNS.map(d => (
                <DropdownInput
                  key={d.key}
                  label={d.label}
                  value={values[d.key]}
                  onChange={val => set(d.key, val)}
                />
              ))}
            </div>
          </Card>

        </div>

        {/* Right column — Prediction */}
        <Card title="Prediction" style={{}}>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.25)' }}>Results will appear here...</p>
        </Card>

      </div>
    </div>
  )
}

export default App
