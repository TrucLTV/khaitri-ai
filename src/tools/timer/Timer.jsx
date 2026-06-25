import { useState, useEffect, useRef, useCallback } from 'react'

const PRESETS = [
  { label: '3 phút',  seconds: 180 },
  { label: '5 phút',  seconds: 300 },
  { label: '10 phút', seconds: 600 },
  { label: '15 phút', seconds: 900 },
  { label: '20 phút', seconds: 1200 },
]

function pad(n) { return String(n).padStart(2, '0') }

function fmt(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${pad(m)}:${pad(sec)}`
}

function pct(remaining, total) {
  if (!total) return 0
  return ((total - remaining) / total) * 100
}

export default function Timer() {
  const [total,     setTotal]     = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [running,   setRunning]   = useState(false)
  const [finished,  setFinished]  = useState(false)
  const intervalRef = useRef(null)
  const audioRef    = useRef(null)

  const reset = useCallback((secs) => {
    clearInterval(intervalRef.current)
    setTotal(secs)
    setRemaining(secs)
    setRunning(false)
    setFinished(false)
  }, [])

  const togglePlay = () => {
    if (finished) { reset(total); return }
    setRunning(r => !r)
  }

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return }

    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          setFinished(true)
          audioRef.current?.play().catch(() => {})
          return 0
        }
        return r - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [running])

  const progress = pct(remaining, total)
  const isWarning = remaining <= 60 && remaining > 0
  const circleSize = 260
  const r = 110
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - progress / 100)

  const ringColor = finished
    ? '#ef4444'
    : isWarning
    ? '#f59e0b'
    : '#3b82f6'

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 select-none">
      {/* Beep audio (short tone via AudioContext — no file needed) */}
      <audio ref={audioRef} />

      <h1 className="text-xl font-bold text-gray-700">Timer màn chiếu</h1>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map(p => (
          <button
            key={p.seconds}
            onClick={() => reset(p.seconds)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              total === p.seconds && !running && !finished
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Circle */}
      <div className="relative" style={{ width: circleSize, height: circleSize }}>
        <svg width={circleSize} height={circleSize} className="-rotate-90">
          <circle
            cx={circleSize / 2} cy={circleSize / 2} r={r}
            fill="none" stroke="#e5e7eb" strokeWidth="12"
          />
          <circle
            cx={circleSize / 2} cy={circleSize / 2} r={r}
            fill="none" stroke={ringColor} strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-6xl font-mono font-bold tabular-nums transition-colors ${
              finished ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-gray-800'
            }`}
          >
            {fmt(remaining)}
          </span>
          {finished && (
            <span className="text-sm font-semibold text-red-500 mt-1 animate-pulse">
              Hết giờ!
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={togglePlay}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-colors ${
            finished
              ? 'bg-gray-500 hover:bg-gray-600'
              : running
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {finished ? '↺' : running ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => reset(total)}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl shadow transition-colors"
        >
          ↺
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Nhấn preset để đặt thời gian · ▶ Bắt đầu · ⏸ Tạm dừng · ↺ Reset
      </p>
    </div>
  )
}
