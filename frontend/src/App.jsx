import { useState, useEffect, useRef } from 'react'
import SliderInput from './components/SliderInput'
import DropdownInput from './components/DropdownInput'
import ModelCard from './components/ModelCard'
import FuzzyGauge from './components/FuzzyGauge'
import RuleDisplay from './components/RuleDisplay'
import Blobs from './components/Blobs'
import { runAllModels, preloadModels } from './utils/inference'
import { computeFuzzyScore, findActiveRule } from './utils/fuzzy'

const FEATURES = [
  'Attendance', 'Hours_Studied', 'Previous_Scores', 'Tutoring_Sessions',
  'Sleep_Hours', 'Parental_Involvement', 'Access_to_Resources',
  'Physical_Activity', 'Peer_Influence', 'Family_Income',
  'Parental_Education_Level', 'Distance_from_Home',
]

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

function Card({ title, subtitle, children, style = {}, gap = 'gap-3' }) {
  return (
    <div className="glass rounded-2xl flex flex-col" style={style}>
      <div style={{ padding: '18px 22px 12px 22px' }}>
        <span className="text-base font-semibold uppercase tracking-widest" style={{ color: '#39ff14' }}>
          {title}
        </span>
        {subtitle && (
          <span className="text-sm ml-2 font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}> — {subtitle}</span>
        )}
      </div>
      <div style={{ padding: '0 22px 20px 22px' }} className={`flex flex-col flex-1 min-h-0 ${gap}`}>
        {children}
      </div>
    </div>
  )
}

function App() {
  const [values, setValues]         = useState(defaultValues)
  const [results, setResults]       = useState(null)
  const [fuzzyScore, setFuzzyScore] = useState(null)
  const [activeRule, setActiveRule] = useState(null)
  const [ready, setReady]           = useState(false)
  const fuzzyParams  = useRef(null)
  const rulesData    = useRef(null)

  // Load static JSON files and preload ONNX sessions in parallel
  useEffect(() => {
    preloadModels()
    const base = import.meta.env.BASE_URL
    Promise.all([
      fetch(`${base}fuzzy_params.json`).then(r => r.json()),
      fetch(`${base}rules.json`).then(r => r.json()),
    ]).then(([fp, rules]) => {
      fuzzyParams.current = fp
      rulesData.current   = rules
      setReady(true)
    })
  }, [])

  // Run inference whenever values change (and data is loaded)
  useEffect(() => {
    if (!ready) return
    const fp    = fuzzyParams.current
    const rules = rulesData.current

    const features = FEATURES.map(f => values[f] ?? 0)
    runAllModels(features).then(r => { if (r) setResults(r) }).catch(err => console.error('[inference]', err))

    if (fp) setFuzzyScore(computeFuzzyScore(values.Attendance, values.Hours_Studied, fp))
    if (rules) setActiveRule(findActiveRule(values, rules))

  }, [values, ready])

  const set = (key, val) => setValues(prev => ({ ...prev, [key]: val }))

  return (
    <>
    <Blobs />
    <div className="h-screen overflow-hidden flex flex-col" style={{ padding: '18px 18px 100px 18px', position: 'relative', zIndex: 1 }}>

      {/* Header card */}
      <div className="glass rounded-2xl shrink-0" style={{ marginTop: '70px', padding: '10px 26px' }}>
        <h1 className="text-3xl font-bold leading-none" style={{ color: '#39ff14' }}>
          GradeScope <span className="text-2xl font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>— Student Performance Predictor</span>
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 min-h-0 grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>

        {/* Left column */}
        <div className="flex flex-col gap-3 min-h-0 justify-center">
          <Card title="Academic" subtitle="numeric performance factors">
            <div className="grid grid-cols-3 gap-3">
              {SLIDERS.map(s => (
                <SliderInput key={s.key} label={s.label} min={s.min} max={s.max}
                  value={values[s.key]} onChange={val => set(s.key, val)} />
              ))}
            </div>
          </Card>
          <Card title="Background" subtitle="socioeconomic factors">
            <div className="grid grid-cols-3 gap-3">
              {DROPDOWNS.map(d => (
                <DropdownInput key={d.key} label={d.label}
                  value={values[d.key]} onChange={val => set(d.key, val)} />
              ))}
            </div>
          </Card>
        </div>

        {/* Right column — Prediction */}
        <div className="flex flex-col min-h-0 justify-center">
          <Card title="Prediction" subtitle="model results" gap="gap-2">
            <div className="grid grid-cols-2 gap-3">
              <ModelCard model="random_forest"  result={results?.random_forest} />
              <ModelCard model="svm"            result={results?.svm} />
              <ModelCard model="knn"            result={results?.knn} />
              <ModelCard model="neural_network" result={results?.neural_network} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FuzzyGauge score={fuzzyScore} />
              <RuleDisplay rule={activeRule} />
            </div>
          </Card>
        </div>

      </div>
    </div>
    </>
  )
}

export default App
