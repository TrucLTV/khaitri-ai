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

/* ── Stats card ── */
function StatCard({ n, label, icon }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-xl px-5 py-3 text-center">
      <div className="text-3xl font-black">{n}</div>
      <div className="text-blue-100 text-xs mt-0.5">{label}</div>
    </div>
  )
}

export default function Home() {
  const { metadata, giai_doan, tuan } = useCurriculum()

  const tuanByGD = {}
  for (const t of tuan) {
    if (!tuanByGD[t.giai_doan]) tuanByGD[t.giai_doan] = []
    tuanByGD[t.giai_doan].push(t)
  }

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <div className="rounded-2xl overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)' }}>
        <div className="px-7 pt-7 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">KhaiTriAI</h1>
              <p className="text-blue-200 text-sm mt-1">{metadata.truong}</p>
              <p className="text-blue-300 text-xs mt-0.5">{metadata.mon} · {metadata.khoi} · {metadata.nam_hoc}</p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.698-1.384 2.698H4.182c-1.414 0-2.384-1.698-1.384-2.698L4.8 15.3" />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { n: '21', label: 'tuần học' },
              { n: '42', label: 'tiết thực dạy' },
              { n: '4',  label: 'giai đoạn' },
              { n: '17', label: 'tài liệu HS' },
            ].map(s => <StatCard key={s.label} {...s} />)}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex border-t border-white/10">
          {giai_doan.map((gd, i) => {
            const colors = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500']
            const count  = tuanByGD[gd.id]?.length || 0
            const total  = tuan.length
            return (
              <div key={gd.id} className={`${colors[i]} h-1.5 transition-all`}
                style={{ width: `${(count / total) * 100}%` }} />
            )
          })}
        </div>
      </div>

      {/* ── Chú thích ── */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 px-1">
        {giai_doan.map((gd, i) => {
          const colors = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500']
          return (
            <span key={gd.id} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${colors[i]}`} />
              {gd.ten}
            </span>
          )
        })}
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
