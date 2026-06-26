import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import TeacherGate from '../../components/TeacherGate'
import allQuestions from '../../data/quiz.json'

const ALL_Q = { ...allQuestions }

function StatsContent() {
  const [results, setResults] = useState([])
  const [mode,    setMode]    = useState('GD1')

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'quiz_results'), snap => {
      setResults(snap.docs.map(d => d.data()))
    })
    return unsub
  }, [])

  const filtered    = results.filter(r => r.mode === mode)
  const allWrongIds = filtered.flatMap(r => r.wrong_ids || [])

  const questions   = ALL_Q[mode] || []
  const wrongCounts = questions.map(q => ({
    q,
    count: allWrongIds.filter(id => id === q.id).length,
    total: filtered.length,
  })).sort((a, b) => b.count - a.count)

  const avgScore = filtered.length
    ? (filtered.reduce((s, r) => s + r.score, 0) / filtered.length).toFixed(1)
    : '-'

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Quiz Stats — GV</h1>
        <p className="text-sm text-gray-500">Thống kê câu học sinh hay sai nhất · cập nhật realtime</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2">
        {['GD1', 'GD2'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              mode === m ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m === 'GD1' ? 'GĐ1 — Khám phá' : 'GĐ2 — Máy học'}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Lượt làm',     value: filtered.length },
          { label: 'Điểm TB',      value: `${avgScore}/20` },
          { label: 'Câu sai (lượt)', value: allWrongIds.length },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary-600">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Wrong question heatmap */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-300">
          <p className="text-4xl mb-2">📊</p>
          <p>Chưa có học sinh nào làm quiz online</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-600">Câu hay sai nhất</h2>
          {wrongCounts.filter(x => x.count > 0).slice(0, 10).map(({ q, count, total }) => {
            const pct = total ? Math.round((count / total) * 100) : 0
            const danger = pct >= 50
            return (
              <div key={q.id} className={`rounded-xl border p-3 ${danger ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex justify-between items-start gap-3 mb-2">
                  <p className="text-sm font-medium text-gray-800 leading-snug">{q.cau_hoi}</p>
                  <span className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full ${danger ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {count}/{total} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${danger ? 'bg-red-400' : 'bg-amber-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-green-700 mt-1.5">✓ {q.lua_chon[q.dap_an]}</p>
              </div>
            )
          })}
          {wrongCounts.filter(x => x.count === 0).length === wrongCounts.length && (
            <p className="text-center text-sm text-green-600 py-4">Chưa có câu nào bị sai! 🎉</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function QuizStats() {
  return (
    <TeacherGate>
      <StatsContent />
    </TeacherGate>
  )
}
