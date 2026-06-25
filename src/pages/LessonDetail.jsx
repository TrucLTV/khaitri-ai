import { useParams, Link } from 'react-router-dom'
import { useTuan } from '../hooks/useCurriculum'

const LOAI_LABEL = {
  bai_hoc: { label: 'Bài học', cls: 'bg-blue-100 text-blue-700' },
  toan_cn: { label: 'Toán cầu nối', cls: 'bg-orange-100 text-orange-700' },
  kiem_tra: { label: 'Kiểm tra', cls: 'bg-yellow-100 text-yellow-700' },
}

function TietCard({ tiet }) {
  const badge = LOAI_LABEL[tiet.loai] || LOAI_LABEL.bai_hoc

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-200">T{tiet.so_tiet}</span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Nội dung</p>
        <p className="text-sm text-gray-700 leading-relaxed">{tiet.noi_dung}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Phương pháp</p>
          <p className="text-sm text-gray-600">{tiet.phuong_phap}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Sản phẩm</p>
          <p className="text-sm text-gray-600 font-medium">{tiet.san_pham}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">GV chuẩn bị</p>
          <p className="text-sm text-gray-600">{tiet.cong_cu.gv}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">HS cần có</p>
          <p className="text-sm text-gray-600">{tiet.cong_cu.hs}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 pt-2">
        {tiet.nang_luc_so.map(nls => (
          <span key={nls} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {nls}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function LessonDetail() {
  const { id } = useParams()
  const tuan = useTuan(id)

  if (!tuan) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-2">404</p>
        <p>Không tìm thấy tuần {id}</p>
        <Link to="/" className="text-primary-600 text-sm mt-4 inline-block hover:underline">
          Về trang chủ
        </Link>
      </div>
    )
  }

  const gd = tuan.giai_doan_info
  const prevWeek = tuan.so_tuan > 1 ? tuan.so_tuan - 1 : null
  const nextWeek = tuan.so_tuan < 21 ? tuan.so_tuan + 1 : null

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-600">Tuần {tuan.so_tuan}</span>
      </div>

      {/* Header */}
      <div
        className="rounded-2xl p-5 text-white"
        style={{ background: `linear-gradient(135deg, ${gd?.mau || '#6b7280'}dd, ${gd?.mau || '#6b7280'})` }}
      >
        <p className="text-sm opacity-75 mb-1">
          {gd?.ten} · Tuần {tuan.so_tuan} · Tiết {tuan.tiet[0]}–{tuan.tiet[1]}
          {tuan.so_bai ? ` · Bài ${tuan.so_bai}` : ''}
        </p>
        <h1 className="text-xl font-bold leading-snug">{tuan.ten_bai}</h1>
      </div>

      {/* Tiết cards */}
      <div className="space-y-4">
        {tuan.tiet_detail.map(tiet => (
          <TietCard key={tiet.so_tiet} tiet={tiet} />
        ))}
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        {prevWeek ? (
          <Link
            to={`/lesson/${prevWeek}`}
            className="text-sm text-primary-600 hover:underline"
          >
            ← Tuần {prevWeek}
          </Link>
        ) : <span />}
        {nextWeek && (
          <Link
            to={`/lesson/${nextWeek}`}
            className="text-sm text-primary-600 hover:underline"
          >
            Tuần {nextWeek} →
          </Link>
        )}
      </div>
    </div>
  )
}
