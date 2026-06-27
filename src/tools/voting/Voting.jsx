import { useState, useEffect } from 'react'
import {
  collection, doc, setDoc, onSnapshot,
  serverTimestamp, getDocs
} from 'firebase/firestore'
import QRCode from 'react-qr-code'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import TeacherGate from '../../components/TeacherGate'

/* ── helpers ── */
function genCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase()
}

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']

/* ════════════════════════════════════════
   GV — Tạo poll
════════════════════════════════════════ */
function CreatePoll({ onCreate, user }) {
  const [question, setQuestion] = useState('')
  const [options,  setOptions]  = useState(['', ''])

  const addOption = () => options.length < 6 && setOptions(o => [...o, ''])
  const setOpt    = (i, v) => setOptions(o => o.map((x, j) => j === i ? v : x))
  const removeOpt = (i) => options.length > 2 && setOptions(o => o.filter((_, j) => j !== i))
  const valid = question.trim() && options.every(o => o.trim()) && options.length >= 2

  const handleCreate = async () => {
    if (!valid) return
    const code = genCode()
    await setDoc(doc(db, 'sessions', code), {
      type: 'vote', question: question.trim(),
      options: options.map(o => o.trim()),
      active: true,
      ownerUid: user?.uid || 'pin-auth', ownerName: user?.displayName || 'Giáo viên',
      createdAt: serverTimestamp(),
    })
    onCreate(code)
  }

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Voting realtime</h1>
        <p className="text-sm text-gray-500">Tạo poll → HS quét QR / nhập mã → vote → kết quả live</p>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500">Câu hỏi</label>
        <textarea value={question} onChange={e => setQuestion(e.target.value)}
          placeholder="AI có thể thay thế hoàn toàn con người không?" rows={2}
          className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500">Lựa chọn ({options.length}/6)</label>
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: COLORS[i] }}>
              {String.fromCharCode(65 + i)}
            </span>
            <input value={opt} onChange={e => setOpt(i, e.target.value)}
              placeholder={`Lựa chọn ${String.fromCharCode(65 + i)}`}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
            {options.length > 2 && (
              <button onClick={() => removeOpt(i)} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <button onClick={addOption} className="text-xs text-primary-600 hover:underline">+ Thêm lựa chọn</button>
        )}
      </div>
      <button onClick={handleCreate} disabled={!valid}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-colors ${valid ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
        Tạo poll →
      </button>
    </div>
  )
}

/* ════════════════════════════════════════
   GV — Live results + QR
════════════════════════════════════════ */
function LiveResults({ code, session, votes, onClose }) {
  const total    = votes.length
  const counts   = session.options.map((_, i) => votes.filter(v => v.choice === i).length)
  const max      = Math.max(...counts, 1)
  const joinUrl  = `${window.location.origin}/khaitri-ai/vote/${code}`
  const [showQR, setShowQR] = useState(true)

  const handleClose = async () => {
    await setDoc(doc(db, 'sessions', code), { active: false }, { merge: true })
    onClose()
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            Mã: <span className="font-mono font-bold text-primary-600 text-lg">{code}</span>
          </p>
          <h2 className="font-bold text-gray-800 leading-snug">{session.question}</h2>
        </div>
        <span className="flex-shrink-0 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
          {total} phiếu
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-5">
        {/* Left — bars */}
        <div className="space-y-3">
          {session.options.map((opt, i) => {
            const pct = total ? Math.round((counts[i] / total) * 100) : 0
            return (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">
                    <span className="font-bold mr-1" style={{ color: COLORS[i] }}>{String.fromCharCode(65 + i)}.</span>{opt}
                  </span>
                  <span className="font-bold text-gray-600">{counts[i]} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div className="h-8 rounded-full transition-all duration-700"
                    style={{ width: `${(counts[i] / max) * 100}%`, backgroundColor: COLORS[i], minWidth: counts[i] > 0 ? '2rem' : 0 }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Right — QR */}
        <div className="flex flex-col items-center gap-2">
          <button onClick={() => setShowQR(s => !s)} className="text-xs text-gray-400 hover:text-primary-600">
            {showQR ? 'Ẩn QR' : 'Hiện QR'}
          </button>
          {showQR && (
            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <QRCode value={joinUrl} size={140} />
              <p className="text-center text-xs text-gray-400 mt-2 font-mono font-bold">{code}</p>
            </div>
          )}
          <p className="text-xs text-gray-400 text-center break-all max-w-[160px]">{joinUrl}</p>
        </div>
      </div>

      <button onClick={handleClose}
        className="w-full py-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-medium rounded-xl text-sm transition-colors">
        Đóng poll
      </button>
    </div>
  )
}

/* ════════════════════════════════════════
   HS — Vote screen
════════════════════════════════════════ */
function VoteScreen({ code: initCode }) {
  const [code,      setCode]      = useState(initCode || '')
  const [session,   setSession]   = useState(null)
  const [chosen,    setChosen]    = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [name,      setName]      = useState(() => localStorage.getItem('hs_name') || '')

  useEffect(() => { if (initCode) join(initCode) }, []) // eslint-disable-line

  const join = async (c) => {
    const key = (c || code).trim().toUpperCase()
    if (!key) return
    setLoading(true); setError('')
    try {
      const snap = await getDocs(collection(db, 'sessions'))
      const s = snap.docs.find(d => d.id === key)
      if (!s || !s.data().active) {
        setError('Mã không tồn tại hoặc poll đã đóng')
        setLoading(false); return
      }
      setSession({ id: s.id, ...s.data() })
    } catch { setError('Lỗi kết nối') }
    setLoading(false)
  }

  const submit = async () => {
    if (chosen === null || !name.trim()) return
    localStorage.setItem('hs_name', name.trim())
    const voteId = name.trim().replace(/\s+/g, '_') + '_' + Date.now()
    await setDoc(doc(db, 'sessions', session.id, 'votes', voteId), {
      choice: chosen, name: name.trim(), ts: serverTimestamp()
    })
    setSubmitted(true)
  }

  if (!session) return (
    <div className="max-w-sm mx-auto space-y-4 pt-8">
      <h1 className="text-xl font-bold text-center text-gray-800">Tham gia Vote</h1>
      <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
        onKeyDown={e => e.key === 'Enter' && join()}
        placeholder="Nhập mã (VD: AB3XY)"
        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold tracking-widest focus:outline-none focus:border-primary-400"
        maxLength={5} />
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button onClick={() => join()} disabled={loading || !code.trim()}
        className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl disabled:opacity-40">
        {loading ? 'Đang tìm...' : 'Vào →'}
      </button>
    </div>
  )

  if (submitted) return (
    <div className="max-w-sm mx-auto text-center pt-16 space-y-3">
      <p className="text-5xl">✓</p>
      <p className="text-xl font-bold text-green-600">Đã ghi nhận!</p>
      <p className="text-sm text-gray-500">Bạn chọn: <span className="font-bold" style={{ color: COLORS[chosen] }}>{session.options[chosen]}</span></p>
    </div>
  )

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
        <h2 className="font-bold text-gray-800 leading-snug">{session.question}</h2>
      </div>
      <input value={name} onChange={e => setName(e.target.value)}
        placeholder="Tên của bạn"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
      <div className="space-y-2">
        {session.options.map((opt, i) => (
          <button key={i} onClick={() => setChosen(i)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
              chosen === i ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-gray-200 hover:border-gray-300'
            }`}>
            <span className="font-bold mr-2" style={{ color: COLORS[i] }}>{String.fromCharCode(65 + i)}.</span>{opt}
          </button>
        ))}
      </div>
      <button onClick={submit} disabled={chosen === null || !name.trim()}
        className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl disabled:opacity-40 transition-opacity">
        Gửi vote
      </button>
    </div>
  )
}

/* ════════════════════════════════════════
   GV Teacher panel (protected)
════════════════════════════════════════ */
function TeacherPanel() {
  const { user }  = useAuth()
  const [code,    setCode]    = useState(null)
  const [session, setSession] = useState(null)
  const [votes,   setVotes]   = useState([])

  useEffect(() => {
    if (!code) return
    const u1 = onSnapshot(doc(db, 'sessions', code), s => { if (s.exists()) setSession(s.data()) })
    const u2 = onSnapshot(collection(db, 'sessions', code, 'votes'), s => setVotes(s.docs.map(d => d.data())))
    return () => { u1(); u2() }
  }, [code])

  if (!code) return <CreatePoll onCreate={setCode} user={user} />
  if (code && session) return (
    <LiveResults code={code} session={session} votes={votes}
      onClose={() => { setCode(null); setSession(null) }} />
  )
  return <p className="text-center text-gray-400 py-8">Đang kết nối...</p>
}

/* ════════════════════════════════════════
   Main
════════════════════════════════════════ */
export default function Voting({ studentCode }) {
  const [mode, setMode] = useState(studentCode ? 'student' : null)

  if (studentCode || mode === 'student') return <VoteScreen code={studentCode || ''} />

  if (mode === 'teacher') return (
    <TeacherGate>
      <TeacherPanel />
    </TeacherGate>
  )

  return (
    <div className="max-w-sm mx-auto pt-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Voting realtime</h1>
      <button onClick={() => setMode('teacher')}
        className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl text-lg hover:bg-primary-700">
        Giáo viên — Tạo poll
      </button>
      <button onClick={() => setMode('student')}
        className="w-full py-4 bg-white border-2 border-primary-300 text-primary-700 font-bold rounded-xl text-lg hover:border-primary-500">
        Học sinh — Tham gia
      </button>
    </div>
  )
}
