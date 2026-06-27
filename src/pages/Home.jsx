import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCurriculum } from '../hooks/useCurriculum'

const LOAI_BADGE = {
  toan_cn:  { label: 'Toán CN',   cls: 'bg-orange-50 text-orange-600 border border-orange-200' },
  kiem_tra: { label: 'Kiểm tra',  cls: 'bg-amber-50 text-amber-600 border border-amber-200'   },
}

/* ── Hàng tuần trong accordion ── */
function WeekRow({ tuan }) {
  const badge = LOAI_BADGE[tuan.tiet_detail[0]?.loai]
  const isKT  = tuan.giai_doan === 'KT1' || tuan.giai_doan === 'KT2'

  return (
    <Link
      to={`/lesson/${tuan.so_tuan}`}
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-blue-50 transition-colors group border-b border-gray-100 last:border-0"
    >
      {/* Số tuần */}
      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
        isKT ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {tuan.so_tuan}
      </span>

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 truncate leading-snug">
          {tuan.ten_bai}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Tiết {tuan.tiet[0]}–{tuan.tiet[1]}
          {tuan.so_bai ? ` · Bài ${tuan.so_bai}` : ''}
        </p>
      </div>

      {/* Badge */}
      {badge && (
        <span className={`flex-shrink-0 text-xs px-2.5 py-0.5 rounded-full font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      )}

      {/* Arrow */}
      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

/* ── Accordion giai đoạn ── */
function PhaseAccordion({ gd, tuanList, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)

  const colorMap = {
    '#3b82f6': { bg: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700',  bar: 'bg-blue-600'   },
    '#10b981': { bg: 'bg-emerald-600', light: 'bg-emerald-50',border: 'border-emerald-200',text: 'text-emerald-700',bar: 'bg-emerald-600'},
    '#8b5cf6': { bg: 'bg-violet-600',  light: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', bar: 'bg-violet-600'  },
    '#ec4899': { bg: 'bg-pink-600',    light: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-700',   bar: 'bg-pink-600'   },
  }
  const c = colorMap[gd.mau] || colorMap['#3b82f6']

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${
          open ? c.light : 'bg-white hover:bg-gray-50'
        }`}
      >
        {/* Colored pill */}
        <span className={`flex-shrink-0 ${c.bg} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {gd.id}
        </span>

        <div className="flex-1 min-w-0">
          <p className={`font-bold text-base ${open ? c.text : 'text-gray-800'}`}>{gd.ten}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Tuần {gd.tuan_tu}–{gd.tuan_den} · Tiết {gd.tiet_tu}–{gd.tiet_den} · {tuanList.length} tuần
          </p>
        </div>

        {/* Progress dots */}
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
          {tuanList.map(t => (
            <div key={t.so_tuan} className={`w-1.5 h-1.5 rounded-full ${c.bar} opacity-70`} />
          ))}
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${open ? c.text + ' rotate-180' : 'text-gray-400'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {open && (
        <div className={`border-t ${c.border} bg-white`}>
          {tuanList.map(t => <WeekRow key={t.so_tuan} tuan={t} />)}
        </div>
      )}
    </div>
  )
}

const PHASE_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899']
const STAT_CFG = [
  { n: '21', label: 'Tuần học',      bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
  { n: '42', label: 'Tiết thực dạy', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  { n: '4',  label: 'Giai đoạn',     bg: 'bg-violet-50', text: 'text-violet-600',  border: 'border-violet-100',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
  { n: '17', label: 'Tài liệu HS',   bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
]

export default function Home() {
  const { metadata, giai_doan, tuan } = useCurriculum()

  const tuanByGD = {}
  for (const t of tuan) {
    if (!tuanByGD[t.giai_doan]) tuanByGD[t.giai_doan] = []
    tuanByGD[t.giai_doan].push(t)
  }

  return (
    <div className="space-y-5">
      {/* ── Hero ── */}
      <div className="rounded-2xl overflow-hidden shadow-md"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)' }}>
        <div className="px-8 py-7">
          {/* Badge năm học */}
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {metadata.nam_hoc}
          </span>

          <h1 className="text-4xl font-black text-white tracking-tight leading-none">
            KhaiTriAI
          </h1>
          <p className="text-blue-200 font-medium mt-2">{metadata.mon} · {metadata.khoi}</p>
          <p className="text-blue-300/80 text-sm mt-0.5">{metadata.truong}</p>
        </div>

        {/* Thanh giai đoạn */}
        <div className="px-8 pb-5">
          <div className="flex items-center gap-1 mb-2">
            {giai_doan.map((gd, i) => {
              const count = tuanByGD[gd.id]?.length || 0
              const total = tuan.length
              return (
                <div key={gd.id} className="flex items-center gap-1"
                  style={{ width: `${(count / total) * 100}%` }}>
                  <div className="h-2 rounded-full w-full opacity-90"
                    style={{ backgroundColor: PHASE_COLORS[i] }} />
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {giai_doan.map((gd, i) => (
              <span key={gd.id} className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PHASE_COLORS[i] }} />
                {gd.ten}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAT_CFG.map(s => (
          <div key={s.label}
            className={`${s.bg} border ${s.border} rounded-xl px-4 py-4 flex items-center gap-3`}>
            <div className={`flex-shrink-0 w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
              <svg className={`w-5 h-5 ${s.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                {s.icon}
              </svg>
            </div>
            <div>
              <p className={`text-2xl font-black ${s.text} leading-none`}>{s.n}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Accordions ── */}
      <div className="space-y-3">
        {giai_doan.map((gd, i) => (
          <PhaseAccordion
            key={gd.id}
            gd={gd}
            tuanList={tuanByGD[gd.id] || []}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  )
}
