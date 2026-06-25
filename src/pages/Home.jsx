import { Link } from 'react-router-dom'
import { useCurriculum } from '../hooks/useCurriculum'

const LOAI_BADGE = {
  toan_cn: { label: 'Toán CN', cls: 'bg-orange-100 text-orange-700' },
  kiem_tra: { label: 'Kiểm tra', cls: 'bg-yellow-100 text-yellow-700' },
  bai_hoc: null,
}

function WeekCard({ tuan }) {
  const gd = tuan.giai_doan_info
  const badge = LOAI_BADGE[tuan.tiet_detail[0]?.loai]
  const isKT = tuan.giai_doan === 'KT1' || tuan.giai_doan === 'KT2'

  return (
    <Link
      to={`/lesson/${tuan.so_tuan}`}
      className={`block rounded-xl border p-4 hover:shadow-md transition-shadow bg-white group ${
        isKT ? 'border-yellow-300' : 'border-gray-200 hover:border-primary-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: gd?.mau || '#6b7280' }}
          >
            {tuan.so_tuan}
          </span>
          <div>
            <p className="text-xs text-gray-400">
              Tiết {tuan.tiet[0]}–{tuan.tiet[1]}
              {tuan.so_bai ? ` · Bài ${tuan.so_bai}` : ''}
            </p>
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 leading-snug">
              {tuan.ten_bai}
            </h3>
          </div>
        </div>
        {badge && (
          <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </div>
    </Link>
  )
}

function PhaseSection({ gd, tuanList }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: gd.mau }}
        />
        <h2 className="font-bold text-gray-700">{gd.ten}</h2>
        <span className="text-xs text-gray-400">
          Tuần {gd.tuan_tu}–{gd.tuan_den} · Tiết {gd.tiet_tu}–{gd.tiet_den}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tuanList.map(t => <WeekCard key={t.so_tuan} tuan={t} />)}
      </div>
    </section>
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
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">KhaiTriAI</h1>
        <p className="text-primary-100 text-sm mb-4">{metadata.truong}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            ['21', 'tuần'],
            ['42', 'tiết thực dạy'],
            ['19', 'bài học'],
            ['2', 'kiểm tra'],
          ].map(([n, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold">{n}</div>
              <div className="text-primary-200 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phases */}
      {giai_doan.map(gd => (
        <PhaseSection
          key={gd.id}
          gd={gd}
          tuanList={tuanByGD[gd.id] || []}
        />
      ))}
    </div>
  )
}
