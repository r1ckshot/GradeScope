import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback, memo } from 'react'

let uid = 0

const SEA_SURFACE = 90  // bottom sea: bottom:-20 + height:110

function newBlob() {
  const size = 60 + Math.random() * 55  // 60–115 px
  return {
    id:       uid++,
    left:     3 + Math.random() * 91,
    size,
    bottom:   Math.round(SEA_SURFACE - size),
    duration: 10 + Math.random() * 7,
    drift:    (Math.random() - 0.5) * 90,
  }
}

// Memoized so it never re-renders when blobs state changes
const SeaShapes = memo(function SeaShapes() {
  return (
    <>
      {/* ── Top sea — receives bubbles ── */}
      <div className="sea-top" style={{
        position: 'absolute',
        top: -20,
        left: 0,
        width: '100%',
        height: 90,
        background: '#39ff14',
        transformOrigin: 'center top',
      }} />

      {/* ── Bottom sea — quiet breathing ── */}
      <div className="sea-bottom" style={{
        position: 'absolute',
        bottom: -20,
        left: 0,
        width: '100%',
        height: 110,
        background: '#39ff14',
        transformOrigin: 'center bottom',
      }} />
    </>
  )
})

const Blobs = forwardRef(function Blobs(_, ref) {
  const [blobs, setBlobs] = useState(() => [newBlob(), newBlob(), newBlob()])

  const removeBlob = useCallback((id) => {
    setBlobs(prev => prev.filter(x => x.id !== id))
  }, [])

  const addBlob = useCallback(() => {
    setBlobs(prev => [...prev, newBlob()])
  }, [])

  useImperativeHandle(ref, () => ({ pulse: () => {} }))

  useEffect(() => {
    let t = setInterval(addBlob, 2800)
    const onVisibility = () => {
      clearInterval(t)
      if (document.visibilityState === 'visible') t = setInterval(addBlob, 2800)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onVisibility) }
  }, [addBlob])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      background: '#0d0f0d',
      filter: 'blur(22px) contrast(11)',
    }}>

      <SeaShapes />

      {/* ── Bubbles rising from sea ── */}
      {blobs.map(b => (
        <div key={b.id} onAnimationEnd={() => removeBlob(b.id)} style={{
          position: 'absolute',
          bottom: b.bottom,
          left: `${b.left}%`,
          width:  b.size,
          height: b.size,
          borderRadius: '50%',
          background: '#39ff14',
          animation: `lavaRise ${b.duration}s ease-in-out forwards`,
          '--drift': `${b.drift}px`,
        }} />
      ))}

    </div>
  )
})

export default Blobs
