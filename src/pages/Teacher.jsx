import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCurriculum } from '../hooks/useCurriculum'

const STORAGE_KEY = 'khaitri_checklist'

function loadChecklist() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  catch { return {} }
}

function useChecklist() {
  const [done, setDone] = useState(loadChecklist)

  const toggle = (soTuan) => {
    setDone(prev => {
      const next = { ...prev, [soTuan]: !prev[soTuan] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setDone({})
  }

  return { done, toggle, reset }
}

const GD_LABEL = {
  GD1: 'GĐ1 — Khám phá',
  GD2: 'GĐ2 — Máy học',
  KT1: 'KT Định kỳ 1',
  GD3: 'GĐ3 — Dự án AI',
  GD4: 'GĐ4 — Kết nối',
  KT2: 'KT Định kỳ 2',
}

const GD_COLOR = {
  GD1: '#3b82f6', GD2: '#10b981', KT1: '#f59e0b',
  GD3: '#8b5cf6', GD4: '#ec4899', KT2: '#f59e0b',
}

export default function Teacher() {
  const { tuan } = useCurriculum()
  const { done, toggle, reset } = useChecklist()

  const totalDone = Object.values(done).filter(Boolean).length
  const pct = Math.round((totalDone / 21) * 100)

  const tuanByGD = {}
  for (const t of tuan) {
    if (!tuanByGD[t.giai_doan]) tuanByGD[t.giai_doan] = []
    tuanByGD[t.giai_doan].push(t)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard Giáo viên</h1>
        <p className="text-sm text-gray-500">Theo dõi tiến độ giảng dạy theo tuần</p>
      </div>

      {/* Progress bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Tiến độ: {totalDone} / 21 tuần
          </span>
          <span className="text-sm font-bold text-primary-600">{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-primary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {totalDone > 0 && (
          <button
            onClick={() => { if (confirm('Reset toàn bộ checklist?')) reset() }}
            className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Reset checklist
          </button>
        )}
      </div>

      {/* Tools shortcut */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { to: '/timer',  icon: '⏱', label: 'Timer',  cls: 'bg-blue-50 border-blue-200 text-blue-700'   },
          { to: '/quiz',   icon: '❓', label: 'Quiz',   cls: 'bg-green-50 border-green-200 text-green-700' },
          { to: '/rubric', icon: '📋', label: 'Rubric', cls: 'bg-purple-50 border-purple-200 text-purple-700' },
        ].map(({ to, icon, label, cls }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center gap-1 border rounded-xl py-4 font-medium text-sm hover:shadow-sm transition-shadow ${cls}`}
          >
            <span className="text-2xl">{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* Week checklist */}
      <div className="space-y-5">
        {Object.entries(tuanByGD).map(([gdId, list]) => (
          <section key={gdId}>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"
              style={{ color: GD_COLOR[gdId] }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GD_COLOR[gdId] }} />
              {GD_LABEL[gdId]}
            </h2>
            <div className="space-y-1.5">
              {list.map(t => {
                const isDone = !!done[t.so_tuan]
                const isKT = t.giai_doan === 'KT1' || t.giai_doan === 'KT2'

                return (
                  <label
                    key={t.so_tuan}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isDone
                        ? 'bg-green-50 border-green-200'
                        : isKT
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggle(t.so_tuan)}
                      className="w-4 h-4 accent-green-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          T{t.so_tuan} · Tiết {t.tiet[0]}–{t.tiet[1]}
                        </span>
                        {isDone && (
                          <span className="text-xs text-green-600 font-medium">✓ Đã dạy</span>
                        )}
                      </div>
                      <p className={`text-sm font-medium truncate ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {t.ten_bai}
                      </p>
                    </div>
                    <Link
                      to={`/lesson/${t.so_tuan}`}
                      onClick={e => e.stopPropagation()}
                      className="flex-shrink-0 text-xs text-primary-500 hover:text-primary-700"
                    >
                      Xem →
                    </Link>
                  </label>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
