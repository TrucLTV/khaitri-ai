import { useParams, Link } from 'react-router-dom'
import { useTuan } from '../hooks/useCurriculum'

const LOAI_LABEL = {
  bai_hoc:  { label: 'Bài học',       cls: 'bg-blue-50 text-blue-700 border border-blue-200'     },
  toan_cn:  { label: 'Toán cầu nối',  cls: 'bg-orange-50 text-orange-700 border border-orange-200' },
  kiem_tra: { label: 'Kiểm tra',      cls: 'bg-amber-50 text-amber-700 border border-amber-200'   },
}

function InfoBlock({ label, value, icon }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
        {icon && <span>{icon}</span>}
        {label}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{value || '—'}</p>
    </div>
  )
}

function TietCard({ tiet, accentColor }) {
  const badge = LOAI_LABEL[tiet.loai] || LOAI_LABEL.bai_hoc

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
            style={{ backgroundColor: accentColor }}
          >
            T{tiet.so_tiet}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Tiết {tiet.so_tiet}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="p-5 space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5">Nội dung</p>
          <p className="text-sm text-gray-800 leading-relaxed font-medium">{tiet.noi_dung}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoBlock label="Phương pháp" value={tiet.phuong_phap} icon="⚙️" />
          <InfoBlock label="Sản phẩm"    value={tiet.san_pham}    icon="📦" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoBlock label="GV chuẩn bị" value={tiet.cong_cu?.gv} icon="👩‍🏫" />
          <InfoBlock label="HS cần có"   value={tiet.cong_cu?.hs} icon="🎒" />
        </div>

        {tiet.nang_luc_so?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tiet.nang_luc_so.map(nls => (
              <span key={nls}
                className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full font-mono">
                {nls}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function LessonDetail() {
  const { id } = useParams()
  const tuan   = useTuan(id)

  if (!tuan) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-5xl mb-3">🔍</p>
      <p className="text-lg font-semibold text-gray-500">Không tìm thấy tuần {id}</p>
      <Link to="/" className="text-blue-600 text-sm mt-4 inline-block hover:underline">
        ← Về trang chủ
      </Link>
    </div>
  )

  const gd      = tuan.giai_doan_info
  const prevWeek = tuan.so_tuan > 1  ? tuan.so_tuan - 1 : null
  const nextWeek = tuan.so_tuan < 21 ? tuan.so_tuan + 1 : null
  const accent   = gd?.mau || '#3b82f6'

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-blue-600 hover:underline">Trang chủ</Link>
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-500">{gd?.ten}</span>
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-800 font-medium">Tuần {tuan.so_tuan}</span>
      </nav>

      {/* Header card */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <div className="h-1.5" style={{ backgroundColor: accent }} />
        <div className="bg-white px-6 py-5 flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0"
            style={{ backgroundColor: accent }}
          >
            {tuan.so_tuan}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: accent }}>
                {gd?.id}
              </span>
              <span className="text-xs text-gray-400">
                Tiết {tuan.tiet[0]}–{tuan.tiet[1]}
                {tuan.so_bai ? ` · Bài ${tuan.so_bai}` : ''}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-snug">{tuan.ten_bai}</h1>
          </div>
        </div>
      </div>

      {/* Tiết cards */}
      <div className="space-y-4">
        {tuan.tiet_detail.map(tiet => (
          <TietCard key={tiet.so_tiet} tiet={tiet} accentColor={accent} />
        ))}
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        {prevWeek ? (
          <Link to={`/lesson/${prevWeek}`}
            className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Tuần {prevWeek}
          </Link>
        ) : <span />}
        {nextWeek && (
          <Link to={`/lesson/${nextWeek}`}
            className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
            Tuần {nextWeek}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}
