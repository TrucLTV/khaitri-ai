import { useState } from 'react'
import resources from '../data/resources.json'

const GD_INFO = {
  GD1: { ten: 'GĐ1 — Khám phá', mau: '#3b82f6' },
  GD2: { ten: 'GĐ2 — Máy học',  mau: '#10b981' },
  GD3: { ten: 'GĐ3 — Dự án',    mau: '#8b5cf6' },
  GD4: { ten: 'GĐ4 — Kết nối',  mau: '#ec4899' },
}

const LOAI_BADGE = {
  toan_cn: { label: 'Toán CN', cls: 'bg-orange-100 text-orange-700' },
  bai_hoc: { label: 'Bài học', cls: 'bg-blue-100 text-blue-700'    },
}

const FILTERS = ['Tất cả', 'GD1', 'GD2', 'GD3', 'GD4']

const BASE = 'https://trucltv.github.io/khaitri-ai/docs/'

/* ── Modal xem tài liệu ── */
function DocModal({ r, onClose }) {
  const fileUrl  = BASE + r.file
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60" onClick={onClose}>
      <div
        className="flex-1 flex flex-col max-w-4xl w-full mx-auto my-6 bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{r.ten}</p>
            <p className="text-xs text-gray-400">Tiết {r.tiet} · {GD_INFO[r.giai_doan]?.ten}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <a
              href={`/khaitri-ai/docs/${r.file}`}
              download
              className="flex items-center gap-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Tải về
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* iframe */}
        <div className="flex-1 relative">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-0"
            title={r.ten}
            allow="autoplay"
          />
          {/* Fallback hint ở dưới cùng nếu Google Docs Viewer không load */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-100 px-4 py-2 text-xs text-gray-400 text-center">
            Không hiển thị? →{' '}
            <a href={`/khaitri-ai/docs/${r.file}`} download className="text-primary-600 underline">
              Tải file về
            </a>{' '}
            hoặc thử lại sau vài giây.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Card tài liệu ── */
function ResourceCard({ r, onView }) {
  const gd    = GD_INFO[r.giai_doan]
  const badge = LOAI_BADGE[r.loai] || LOAI_BADGE.bai_hoc

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: gd?.mau }}>
            T{r.tiet}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1">{r.ten}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{r.mo_ta}</p>
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onView(r)}
          className="flex-1 flex items-center justify-center gap-1.5 border border-primary-300 text-primary-700 hover:bg-primary-50 text-xs font-medium py-2 px-3 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Xem
        </button>
        <a
          href={`/khaitri-ai/docs/${r.file}`}
          download
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Tải về
        </a>
      </div>
    </div>
  )
}

/* ── Main ── */
export default function Resources() {
  const [filter,  setFilter]  = useState('Tất cả')
  const [viewing, setViewing] = useState(null)

  const filtered = filter === 'Tất cả'
    ? resources
    : resources.filter(r => r.giai_doan === filter)

  const grouped = {}
  for (const r of filtered) {
    if (!grouped[r.giai_doan]) grouped[r.giai_doan] = []
    grouped[r.giai_doan].push(r)
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Kho tư liệu</h1>
          <p className="text-sm text-gray-500">
            {resources.length} tài liệu học tập · Xem trực tiếp hoặc tải về
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {f === 'Tất cả' ? f : GD_INFO[f]?.ten}
            </button>
          ))}
        </div>

        {/* Cards grouped by phase */}
        {Object.entries(grouped).map(([gdId, list]) => (
          <section key={gdId}>
            <h2 className="text-sm font-bold mb-3 flex items-center gap-2"
              style={{ color: GD_INFO[gdId]?.mau }}>
              <span className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: GD_INFO[gdId]?.mau }} />
              {GD_INFO[gdId]?.ten}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map(r => (
                <ResourceCard key={r.id} r={r} onView={setViewing} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {viewing && <DocModal r={viewing} onClose={() => setViewing(null)} />}
    </>
  )
}
