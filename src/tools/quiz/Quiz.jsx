import { useState, useMemo } from 'react'
import allQuestions from '../../data/quiz.json'

const MODES = [
  { id: 'GD1', label: 'GĐ1 — Khám phá', color: '#3b82f6', desc: '20 câu · AI cơ bản, Dữ liệu, Bias, An toàn số' },
  { id: 'GD2', label: 'GĐ2 — Máy học',  color: '#10b981', desc: '20 câu · ML, Thống kê, Teachable Machine' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ── Start screen ── */
function StartScreen({ onStart }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Quiz offline</h1>
        <p className="text-sm text-gray-500">Ôn tập kiến thức · Không cần internet</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => onStart(m.id)}
            className="text-left p-5 rounded-xl border-2 hover:shadow-md transition-shadow group"
            style={{ borderColor: m.color }}
          >
            <div className="text-lg font-bold mb-1" style={{ color: m.color }}>{m.label}</div>
            <div className="text-xs text-gray-500">{m.desc}</div>
            <div
              className="mt-4 text-xs font-semibold text-white px-3 py-1.5 rounded-full inline-block"
              style={{ backgroundColor: m.color }}
            >
              Bắt đầu →
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Question screen ── */
function QuestionScreen({ questions, current, answer, onAnswer, onNext, total }) {
  const q = questions[current]
  const isLast = current === questions.length - 1
  const answered = answer !== null

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">{current + 1} / {questions.length}</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="font-semibold text-gray-800 leading-relaxed">{q.cau_hoi}</p>
      </div>

      {/* Choices */}
      <div className="space-y-2">
        {q.lua_chon.map((choice, i) => {
          let cls = 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
          if (answered) {
            if (i === q.dap_an) cls = 'border-green-400 bg-green-50 text-green-800'
            else if (i === answer && answer !== q.dap_an) cls = 'border-red-300 bg-red-50 text-red-700'
            else cls = 'border-gray-100 bg-gray-50 text-gray-400'
          }

          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => onAnswer(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${cls} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="font-bold mr-2">{['A','B','C','D'][i]}.</span>
              {choice}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className={`rounded-xl p-4 text-sm ${answer === q.dap_an ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          <p className="font-semibold mb-1">{answer === q.dap_an ? '✓ Chính xác!' : '✗ Chưa đúng'}</p>
          <p className="text-gray-700">{q.giai_thich}</p>
        </div>
      )}

      {answered && (
        <button
          onClick={onNext}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
        >
          {isLast ? 'Xem kết quả' : 'Câu tiếp theo →'}
        </button>
      )}
    </div>
  )
}

/* ── Result screen ── */
function ResultScreen({ questions, answers, mode, onRestart, onBack }) {
  const score = answers.filter((a, i) => a === questions[i].dap_an).length
  const pct = Math.round((score / questions.length) * 100)
  const [showReview, setShowReview] = useState(false)

  const feedback =
    pct >= 90 ? { text: 'Xuất sắc!', cls: 'text-green-600' } :
    pct >= 70 ? { text: 'Tốt!',      cls: 'text-blue-600'  } :
    pct >= 50 ? { text: 'Khá!',      cls: 'text-amber-600' } :
               { text: 'Cần ôn thêm', cls: 'text-red-500'  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-3">
        <p className={`text-4xl font-bold ${feedback.cls}`}>{feedback.text}</p>
        <p className="text-5xl font-mono font-bold text-gray-800">{score}<span className="text-2xl text-gray-400">/{questions.length}</span></p>
        <p className="text-sm text-gray-500">Độ chính xác: {pct}%</p>
        <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
          <div className="bg-primary-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onRestart} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors">
          Làm lại
        </button>
        <button onClick={onBack} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors">
          Đổi bộ đề
        </button>
      </div>

      <button
        onClick={() => setShowReview(r => !r)}
        className="w-full text-sm text-primary-600 hover:underline"
      >
        {showReview ? 'Ẩn review' : 'Xem lại câu sai →'}
      </button>

      {showReview && (
        <div className="space-y-3">
          {questions.map((q, i) => {
            const correct = answers[i] === q.dap_an
            if (correct) return null
            return (
              <div key={q.id} className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
                <p className="font-semibold text-gray-800 mb-2">Câu {i + 1}: {q.cau_hoi}</p>
                <p className="text-red-600 mb-1">✗ Bạn chọn: {q.lua_chon[answers[i]]}</p>
                <p className="text-green-700 mb-2">✓ Đáp án: {q.lua_chon[q.dap_an]}</p>
                <p className="text-gray-600 italic">{q.giai_thich}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Main ── */
export default function Quiz() {
  const [mode,    setMode]    = useState(null)   // 'GD1' | 'GD2'
  const [current, setCurrent] = useState(0)
  const [answer,  setAnswer]  = useState(null)
  const [answers, setAnswers] = useState([])
  const [done,    setDone]    = useState(false)

  const questions = useMemo(() => {
    if (!mode) return []
    return shuffle(allQuestions[mode])
  }, [mode])

  const start = (m) => {
    setMode(m); setCurrent(0); setAnswer(null); setAnswers([]); setDone(false)
  }

  const handleAnswer = (i) => {
    if (answer !== null) return
    setAnswer(i)
  }

  const handleNext = () => {
    const newAnswers = [...answers, answer]
    if (current + 1 >= questions.length) {
      setAnswers(newAnswers); setDone(true)
    } else {
      setAnswers(newAnswers); setCurrent(c => c + 1); setAnswer(null)
    }
  }

  if (!mode) return <StartScreen onStart={start} />

  if (done) return (
    <ResultScreen
      questions={questions}
      answers={answers}
      mode={mode}
      onRestart={() => start(mode)}
      onBack={() => setMode(null)}
    />
  )

  return (
    <QuestionScreen
      questions={questions}
      current={current}
      answer={answer}
      onAnswer={handleAnswer}
      onNext={handleNext}
      total={questions.length}
    />
  )
}
