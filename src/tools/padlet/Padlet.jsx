import { useState, useEffect } from 'react'
import {
  collection, doc, setDoc, addDoc, getDoc, onSnapshot,
  serverTimestamp, deleteDoc
} from 'firebase/firestore'
import { db } from '../../lib/firebase'

const CARD_COLORS = [
  'bg-yellow-100 border-yellow-300',
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-pink-100 border-pink-300',
  'bg-purple-100 border-purple-300',
  'bg-orange-100 border-orange-300',
]

function genCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase()
}

/* ════════════════════════════════════════
   GV — Tạo bảng
════════════════════════════════════════ */
function CreateBoard({ onCreate }) {
  const [prompt, setPrompt] = useState('')

  const handleCreate = async () => {
    if (!prompt.trim()) return
    const code = genCode()
    await setDoc(doc(db, 'padlet', code), {
      prompt: prompt.trim(),
      active: true,
      createdAt: serverTimestamp(),
    })
    onCreate(code)
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Padlet số</h1>
        <p className="text-sm text-gray-500">GV đặt câu hỏi → HS post sticky note → hiện realtime trên màn chiếu</p>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500">Câu hỏi / Prompt</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Bạn nghĩ AI sẽ thay đổi nghề nghiệp của bạn như thế nào?"
          rows={3}
          className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none"
        />
      </div>
      <button
        onClick={handleCreate}
        disabled={!prompt.trim()}
        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-40 transition-colors"
      >
        Mở bảng →
      </button>
    </div>
  )
}

/* ════════════════════════════════════════
   Bảng live (dùng cho cả GV chiếu + HS xem)
════════════════════════════════════════ */
function Board({ code, boardData, cards, isTeacher, onClose }) {
  const joinUrl = `${window.location.origin}/khaitri-ai/padlet/${code}`

  const handleDelete = async (cardId) => {
    if (!isTeacher) return
    await deleteDoc(doc(db, 'padlet', code, 'cards', cardId))
  }

  const handleClose = async () => {
    await setDoc(doc(db, 'padlet', code), { active: false }, { merge: true })
    onClose()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-gray-800">{boardData.prompt}</p>
            <p className="text-xs text-gray-400 mt-1">
              Mã: <span className="font-mono font-bold text-primary-600">{code}</span>
              {' · '}{cards.length} câu trả lời
            </p>
          </div>
          {isTeacher && (
            <button onClick={handleClose} className="text-xs text-gray-400 hover:text-red-500 flex-shrink-0">Đóng</button>
          )}
        </div>
        {isTeacher && (
          <p className="text-xs text-gray-400 mt-2 break-all">HS vào: <span className="text-primary-600">{joinUrl}</span></p>
        )}
      </div>

      {/* Cards masonry-ish grid */}
      {cards.length === 0 ? (
        <div className="text-center py-12 text-gray-300">
          <p className="text-4xl mb-2">📌</p>
          <p>Chờ học sinh post...</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 gap-3 space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`break-inside-avoid border rounded-xl p-3 relative group ${CARD_COLORS[card.colorIdx % CARD_COLORS.length]}`}
            >
              <p className="text-xs font-bold text-gray-500 mb-1">{card.name}</p>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{card.content}</p>
              {isTeacher && (
                <button
                  onClick={() => handleDelete(card.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-sm transition-opacity"
                >×</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════
   HS — Tham gia + post
════════════════════════════════════════ */
function StudentPost({ code: initCode }) {
  const [code,     setCode]     = useState(initCode || '')
  const [board,    setBoard]    = useState(null)
  const [cards,    setCards]    = useState([])
  const [name,     setName]     = useState('')
  const [content,  setContent]  = useState('')
  const [colorIdx, setColorIdx] = useState(() => Math.floor(Math.random() * CARD_COLORS.length))
  const [posted,   setPosted]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const join = async () => {
    if (!code.trim()) return
    setLoading(true); setError('')
    try {
      const snap = await getDoc(doc(db, 'padlet', code.toUpperCase()))
      if (!snap.exists() || !snap.data().active) {
        setError('Mã không tồn tại hoặc bảng đã đóng')
        setLoading(false); return
      }
      setBoard({ id: snap.id, ...snap.data() })
    } catch { setError('Lỗi kết nối') }
    setLoading(false)
  }

  useEffect(() => {
    if (!board) return
    const unsub = onSnapshot(collection(db, 'padlet', board.id, 'cards'), snap => {
      setCards(snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.ts?.seconds || 0) - (b.ts?.seconds || 0)))
    })
    return unsub
  }, [board])

  const submit = async () => {
    if (!name.trim() || !content.trim()) return
    await addDoc(collection(db, 'padlet', board.id, 'cards'), {
      name: name.trim(), content: content.trim(),
      colorIdx, ts: serverTimestamp(),
    })
    setPosted(true)
  }

  if (!board) return (
    <div className="max-w-sm mx-auto space-y-4 pt-8">
      <h1 className="text-xl font-bold text-center text-gray-800">Tham gia Padlet</h1>
      <input
        value={code} onChange={e => setCode(e.target.value.toUpperCase())}
        onKeyDown={e => e.key === 'Enter' && join()}
        placeholder="Nhập mã bảng"
        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold tracking-widest focus:outline-none focus:border-primary-400"
        maxLength={5}
      />
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button onClick={join} disabled={loading || !code.trim()} className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl disabled:opacity-40">
        {loading ? 'Đang tìm...' : 'Vào →'}
      </button>
    </div>
  )

  if (posted) return (
    <div className="max-w-sm mx-auto space-y-4">
      <div className="text-center py-6">
        <p className="text-4xl mb-2">📌</p>
        <p className="font-bold text-green-600">Đã đăng!</p>
      </div>
      <Board code={board.id} boardData={board} cards={cards} isTeacher={false} onClose={() => {}} />
      <button
        onClick={() => { setContent(''); setPosted(false); setColorIdx(Math.floor(Math.random() * CARD_COLORS.length)) }}
        className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm"
      >
        Đăng thêm
      </button>
    </div>
  )

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-3">
        <p className="text-sm font-semibold text-gray-800">{board.prompt}</p>
      </div>
      <input
        value={name} onChange={e => setName(e.target.value)}
        placeholder="Tên của bạn"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
      />
      <div>
        <div className="flex gap-1.5 mb-2">
          {CARD_COLORS.map((cls, i) => (
            <button
              key={i} onClick={() => setColorIdx(i)}
              className={`w-6 h-6 rounded-full border-2 ${cls.split(' ')[0].replace('bg-', 'bg-').replace('100', '300')} ${colorIdx === i ? 'border-gray-600 scale-110' : 'border-transparent'} transition-transform`}
            />
          ))}
        </div>
        <textarea
          value={content} onChange={e => setContent(e.target.value)}
          placeholder="Câu trả lời của bạn..."
          rows={4}
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none ${CARD_COLORS[colorIdx]}`}
        />
      </div>
      <button
        onClick={submit}
        disabled={!name.trim() || !content.trim()}
        className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl disabled:opacity-40 transition-opacity"
      >
        Đăng lên bảng 📌
      </button>
    </div>
  )
}

/* ════════════════════════════════════════
   Main
════════════════════════════════════════ */
export default function Padlet({ studentCode }) {
  const [mode,  setMode]  = useState(null)
  const [code,  setCode]  = useState(null)
  const [board, setBoard] = useState(null)
  const [cards, setCards] = useState([])

  useEffect(() => {
    if (!code) return
    const unsub = onSnapshot(collection(db, 'padlet', code, 'cards'), snap => {
      setCards(snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.ts?.seconds || 0) - (b.ts?.seconds || 0)))
    })
    return unsub
  }, [code])

  if (studentCode) return <StudentPost code={studentCode} />

  if (!mode) return (
    <div className="max-w-sm mx-auto pt-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Padlet số</h1>
      <button onClick={() => setMode('teacher')} className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl text-lg hover:bg-primary-700">
        Giáo viên — Mở bảng
      </button>
      <button onClick={() => setMode('student')} className="w-full py-4 bg-white border-2 border-primary-300 text-primary-700 font-bold rounded-xl text-lg hover:border-primary-500">
        Học sinh — Tham gia
      </button>
    </div>
  )

  if (mode === 'student') return <StudentPost code="" />

  if (mode === 'teacher' && !code) return (
    <CreateBoard onCreate={async (c) => {
      setCode(c)
      const snap = await getDoc(doc(db, 'padlet', c))
      setBoard({ id: snap.id, ...snap.data() })
    }} />
  )

  if (mode === 'teacher' && code && board) return (
    <Board
      code={code} boardData={board} cards={cards} isTeacher={true}
      onClose={() => { setCode(null); setBoard(null); setMode(null) }}
    />
  )

  return <p className="text-center text-gray-400 py-8">Đang kết nối...</p>
}
