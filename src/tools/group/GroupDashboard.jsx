import { useState, useEffect } from 'react'
import { collection, doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import TeacherGate from '../../components/TeacherGate'

const TUAN_GD3 = [
  { so: 12, ten: 'Design Thinking & Hình thành dự án', tiet: '23–24' },
  { so: 13, ten: 'Thu thập & Làm sạch dữ liệu',        tiet: '25–26' },
  { so: 14, ten: 'Huấn luyện mô hình lần 1',           tiet: '27–28' },
  { so: 15, ten: 'Cải thiện & Khảo sát người dùng',    tiet: '29–30' },
  { so: 16, ten: 'Hoàn thiện sản phẩm & Tài liệu',     tiet: '31–32' },
  { so: 17, ten: 'Luyện thuyết trình',                  tiet: '33–34' },
  { so: 18, ten: 'Demo Day & Bảo vệ',                   tiet: '35–36' },
]

const STATUS_CFG = {
  chua:    { label: 'Chưa bắt đầu', cls: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-300'  },
  dang:    { label: 'Đang làm',     cls: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'  },
  xong:    { label: 'Hoàn thành',   cls: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  blocked: { label: 'Bị kẹt',       cls: 'bg-red-100 text-red-600',     dot: 'bg-red-500'   },
}

/* ── Teacher view ── */
function TeacherView({ groups }) {
  if (groups.length === 0) return (
    <div className="text-center py-12 text-gray-300">
      <p className="text-4xl mb-2">👥</p>
      <p>Chờ nhóm đăng ký...</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {groups.map(g => {
        const lastUpdate = g.tuan_hien_tai
          ? TUAN_GD3.find(t => t.so === g.tuan_hien_tai)
          : null
        const sc = STATUS_CFG[g.trang_thai] || STATUS_CFG.chua

        return (
          <div key={g.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                  <h3 className="font-bold text-gray-800">{g.ten_nhom}</h3>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{g.thanh_vien}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${sc.cls}`}>{sc.label}</span>
            </div>

            {lastUpdate && (
              <p className="text-xs text-gray-500 mb-2">
                Tuần {lastUpdate.so}: <span className="font-medium">{lastUpdate.ten}</span>
              </p>
            )}

            {g.ghi_chu && (
              <div className={`text-xs rounded-lg p-2.5 ${g.trang_thai === 'blocked' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
                {g.ghi_chu}
              </div>
            )}

            {/* Progress bar GĐ3 */}
            <div className="mt-3 flex gap-1">
              {TUAN_GD3.map(t => (
                <div
                  key={t.so}
                  className={`flex-1 h-2 rounded-full ${
                    g.tuan_hien_tai >= t.so
                      ? g.trang_thai === 'xong' && t.so === g.tuan_hien_tai
                        ? 'bg-green-400'
                        : 'bg-primary-400'
                      : 'bg-gray-100'
                  }`}
                  title={`Tuần ${t.so}: ${t.ten}`}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Student group form ── */
function GroupForm() {
  const [tenNhom,   setTenNhom]   = useState('')
  const [thanhVien, setThanhVien] = useState('')
  const [tuanHT,    setTuanHT]    = useState(12)
  const [trangThai, setTrangThai] = useState('dang')
  const [ghiChu,    setGhiChu]    = useState('')
  const [saved,     setSaved]     = useState(false)

  const submit = async () => {
    if (!tenNhom.trim()) return
    const id = tenNhom.trim().toLowerCase().replace(/\s+/g, '-')
    await setDoc(doc(db, 'groups', id), {
      ten_nhom: tenNhom.trim(),
      thanh_vien: thanhVien.trim(),
      tuan_hien_tai: tuanHT,
      trang_thai: trangThai,
      ghi_chu: ghiChu.trim(),
      updatedAt: serverTimestamp(),
    }, { merge: true })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h2 className="font-bold text-gray-800">Cập nhật tiến độ nhóm</h2>

      <input value={tenNhom} onChange={e => setTenNhom(e.target.value)}
        placeholder="Tên nhóm (VD: Nhóm Rác thải)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
      />
      <input value={thanhVien} onChange={e => setThanhVien(e.target.value)}
        placeholder="Thành viên (VD: An, Bình, Chi, Dũng)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
      />

      <div>
        <label className="text-xs text-gray-500 font-medium">Đang ở tuần nào?</label>
        <select value={tuanHT} onChange={e => setTuanHT(Number(e.target.value))}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
        >
          {TUAN_GD3.map(t => (
            <option key={t.so} value={t.so}>Tuần {t.so} — {t.ten}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500 font-medium">Trạng thái</label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {Object.entries(STATUS_CFG).map(([k, v]) => (
            <label key={k} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${trangThai === k ? 'border-primary-400 bg-primary-50' : 'border-gray-200'}`}>
              <input type="radio" name="status" checked={trangThai === k} onChange={() => setTrangThai(k)} className="accent-primary-600" />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.cls}`}>{v.label}</span>
            </label>
          ))}
        </div>
      </div>

      <textarea value={ghiChu} onChange={e => setGhiChu(e.target.value)}
        placeholder={trangThai === 'blocked' ? 'Mô tả vấn đề đang gặp...' : 'Ghi chú tiến độ (tuỳ chọn)'}
        rows={2}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 resize-none"
      />

      <button onClick={submit} disabled={!tenNhom.trim()}
        className={`w-full py-3 font-bold rounded-xl text-white transition-all ${saved ? 'bg-green-500' : 'bg-primary-600 hover:bg-primary-700 disabled:opacity-40'}`}
      >
        {saved ? '✓ Đã lưu!' : 'Cập nhật tiến độ'}
      </button>
    </div>
  )
}

/* ── Teacher dashboard (protected) ── */
function TeacherDashboard({ onBack }) {
  const [groups, setGroups] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), snap => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => a.ten_nhom.localeCompare(b.ten_nhom)))
    })
    return unsub
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard GĐ3</h1>
          <p className="text-xs text-gray-400">{groups.length} nhóm · cập nhật realtime</p>
        </div>
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600">← Quay lại</button>
      </div>
      <TeacherView groups={groups} />
    </div>
  )
}

/* ── Main ── */
export default function GroupDashboard() {
  const [mode, setMode] = useState(null)

  if (!mode) return (
    <div className="max-w-sm mx-auto pt-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">GĐ3 — Theo dõi nhóm</h1>
      <button onClick={() => setMode('teacher')} className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl text-lg hover:bg-primary-700">
        Giáo viên — Xem tất cả nhóm
      </button>
      <button onClick={() => setMode('student')} className="w-full py-4 bg-white border-2 border-primary-300 text-primary-700 font-bold rounded-xl text-lg hover:border-primary-500">
        Học sinh — Cập nhật tiến độ
      </button>
    </div>
  )

  if (mode === 'student') return (
    <div className="space-y-4">
      <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-gray-600">← Quay lại</button>
      <GroupForm />
    </div>
  )

  return (
    <TeacherGate>
      <TeacherDashboard onBack={() => setMode(null)} />
    </TeacherGate>
  )
}
