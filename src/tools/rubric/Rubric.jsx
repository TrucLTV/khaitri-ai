import { useState } from 'react'

const RUBRICS = {
  du_an: {
    ten: 'Chấm Dự án AI',
    mo_ta: 'Kiểm tra Định kỳ 2 — Thuyết trình nhóm trước hội đồng',
    tieu_chi: [
      {
        id: 'van_de',
        ten: 'Vấn đề rõ ràng',
        diem_max: 2,
        mo_ta: 'Xác định được vấn đề thực tế, có lý do chọn AI để giải quyết',
        muc: [
          { diem: 2, mo_ta: 'Vấn đề rõ, thực tế, có dữ liệu chứng minh sự cần thiết' },
          { diem: 1, mo_ta: 'Vấn đề đề cập được nhưng còn mơ hồ hoặc chưa thuyết phục' },
          { diem: 0, mo_ta: 'Không xác định được vấn đề cụ thể' },
        ],
      },
      {
        id: 'du_lieu',
        ten: 'Dữ liệu đủ và chất lượng',
        diem_max: 2,
        mo_ta: 'Số lượng, đa dạng, đã làm sạch, không có lỗi nhãn rõ ràng',
        muc: [
          { diem: 2, mo_ta: '≥50 mẫu/nhóm, đa dạng góc độ/ánh sáng, đã kiểm tra chất lượng' },
          { diem: 1, mo_ta: 'Đủ số lượng nhưng thiếu đa dạng hoặc còn một số lỗi nhãn' },
          { diem: 0, mo_ta: 'Dữ liệu quá ít hoặc chất lượng kém, ảnh hưởng nghiêm trọng đến mô hình' },
        ],
      },
      {
        id: 'mo_hinh',
        ten: 'Mô hình hoạt động',
        diem_max: 3,
        mo_ta: 'Demo trực tiếp, nhận diện đúng ≥70%, có phân tích lỗi',
        muc: [
          { diem: 3, mo_ta: 'Demo thành công, ≥70% chính xác, phân tích được điểm mạnh/yếu' },
          { diem: 2, mo_ta: 'Demo hoạt động, 50–70% chính xác, có nhận xét cơ bản' },
          { diem: 1, mo_ta: 'Mô hình hoạt động nhưng kém chính xác (<50%), ít phân tích' },
          { diem: 0, mo_ta: 'Mô hình không hoạt động hoặc không demo được' },
        ],
      },
      {
        id: 'trinh_bay',
        ten: 'Trình bày mạch lạc',
        diem_max: 3,
        mo_ta: 'Cấu trúc rõ, phân công đều, trả lời Q&A tự tin',
        muc: [
          { diem: 3, mo_ta: 'Cấu trúc rõ ràng, mọi thành viên tham gia, Q&A tự tin và chính xác' },
          { diem: 2, mo_ta: 'Trình bày được nhưng còn đọc slide hoặc phân công chưa đều' },
          { diem: 1, mo_ta: 'Thiếu mạch lạc, khó theo dõi, Q&A lúng túng' },
          { diem: 0, mo_ta: 'Không trình bày được hoặc bỏ các phần quan trọng' },
        ],
      },
    ],
  },
  thuyet_trinh: {
    ten: 'Chấm Thuyết trình (Peer Review)',
    mo_ta: 'Đánh giá chéo giữa các nhóm — Tiết 33',
    tieu_chi: [
      {
        id: 'van_de_ro',
        ten: 'Vấn đề có rõ không?',
        diem_max: 3,
        mo_ta: 'Người nghe hiểu được nhóm giải quyết vấn đề gì và tại sao quan trọng',
        muc: [
          { diem: 3, mo_ta: 'Hoàn toàn rõ ràng, có ví dụ thực tế, người nghe hiểu ngay' },
          { diem: 2, mo_ta: 'Rõ nhưng cần giải thích thêm' },
          { diem: 1, mo_ta: 'Mơ hồ, khó hiểu vấn đề là gì' },
          { diem: 0, mo_ta: 'Không rõ vấn đề' },
        ],
      },
      {
        id: 'du_lieu_thuyet_trinh',
        ten: 'Dữ liệu & Quá trình',
        diem_max: 2,
        mo_ta: 'Có mô tả cách thu thập, làm sạch và cải thiện dữ liệu',
        muc: [
          { diem: 2, mo_ta: 'Giải thích rõ quy trình dữ liệu, nêu được khó khăn và cách xử lý' },
          { diem: 1, mo_ta: 'Đề cập đến dữ liệu nhưng chưa đầy đủ' },
          { diem: 0, mo_ta: 'Bỏ qua phần dữ liệu' },
        ],
      },
      {
        id: 'mo_hinh_demo',
        ten: 'Mô hình demo được',
        diem_max: 3,
        mo_ta: 'Demo trực tiếp, mô hình nhận diện được, có giải thích kết quả',
        muc: [
          { diem: 3, mo_ta: 'Demo thành công, giải thích kết quả rõ ràng' },
          { diem: 2, mo_ta: 'Demo được nhưng không giải thích hoặc kết quả không ổn định' },
          { diem: 1, mo_ta: 'Demo thất bại nhưng có giải thích lý do' },
          { diem: 0, mo_ta: 'Không demo' },
        ],
      },
      {
        id: 'bai_hoc',
        ten: 'Bài học & Cải tiến',
        diem_max: 2,
        mo_ta: 'Nêu được điều học được, điều muốn cải thiện nếu có thêm thời gian',
        muc: [
          { diem: 2, mo_ta: 'Phản ánh sâu sắc, đề xuất cải tiến cụ thể và khả thi' },
          { diem: 1, mo_ta: 'Có đề cập nhưng chung chung' },
          { diem: 0, mo_ta: 'Không đề cập đến bài học' },
        ],
      },
    ],
  },
}

function RubricForm({ rubric, nhom, onNhomChange }) {
  const [scores, setScores] = useState(() =>
    Object.fromEntries(rubric.tieu_chi.map(tc => [tc.id, null]))
  )

  const total = Object.values(scores).reduce((s, v) => s + (v ?? 0), 0)
  const maxTotal = rubric.tieu_chi.reduce((s, tc) => s + tc.diem_max, 0)
  const allAnswered = Object.values(scores).every(v => v !== null)

  const setScore = (id, diem) => setScores(prev => ({ ...prev, [id]: diem }))

  const reset = () => setScores(Object.fromEntries(rubric.tieu_chi.map(tc => [tc.id, null])))

  return (
    <div className="space-y-5">
      {/* Tên nhóm */}
      <div>
        <label className="text-xs text-gray-500 font-medium">Tên nhóm được chấm</label>
        <input
          value={nhom}
          onChange={e => onNhomChange(e.target.value)}
          placeholder="Nhóm 1 / Nhóm Rác thải..."
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
        />
      </div>

      {/* Tiêu chí */}
      {rubric.tieu_chi.map(tc => (
        <div key={tc.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{tc.ten}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{tc.mo_ta}</p>
            </div>
            <span className="text-xs font-bold text-primary-600 whitespace-nowrap">
              {scores[tc.id] !== null ? `${scores[tc.id]}` : '–'}/{tc.diem_max} đ
            </span>
          </div>

          <div className="space-y-1.5">
            {tc.muc.map(m => (
              <label
                key={m.diem}
                className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  scores[tc.id] === m.diem
                    ? 'bg-primary-50 border-primary-300'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={tc.id}
                  checked={scores[tc.id] === m.diem}
                  onChange={() => setScore(tc.id, m.diem)}
                  className="mt-0.5 accent-primary-600 flex-shrink-0"
                />
                <span className="text-xs text-gray-700">
                  <span className="font-bold text-primary-700">{m.diem} đ</span> — {m.mo_ta}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Tổng điểm */}
      {allAnswered && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">Tổng điểm</p>
          <p className="text-5xl font-bold text-primary-700">{total}</p>
          <p className="text-sm text-gray-500">/ {maxTotal} điểm</p>
          {nhom && (
            <p className="mt-2 text-sm font-semibold text-gray-700">{nhom}</p>
          )}
          <button
            onClick={() => { if (confirm('Reset phiếu chấm này?')) reset() }}
            className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}

export default function Rubric() {
  const [selected, setSelected] = useState(null)
  const [nhom, setNhom] = useState('')

  if (!selected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Rubric chấm điểm</h1>
          <p className="text-sm text-gray-500">Chọn loại rubric để bắt đầu</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(RUBRICS).map(([key, rb]) => (
            <button
              key={key}
              onClick={() => { setSelected(key); setNhom('') }}
              className="text-left p-5 rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:shadow-md transition-all"
            >
              <div className="font-bold text-primary-700 mb-1">{rb.ten}</div>
              <div className="text-xs text-gray-500 mb-3">{rb.mo_ta}</div>
              <div className="text-xs text-gray-400">
                {rb.tieu_chi.length} tiêu chí · {rb.tieu_chi.reduce((s, tc) => s + tc.diem_max, 0)} điểm tối đa
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const rubric = RUBRICS[selected]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← Chọn lại
        </button>
        <div>
          <h1 className="font-bold text-gray-800">{rubric.ten}</h1>
          <p className="text-xs text-gray-400">{rubric.mo_ta}</p>
        </div>
      </div>

      <RubricForm
        key={selected}
        rubric={rubric}
        nhom={nhom}
        onNhomChange={setNhom}
      />
    </div>
  )
}
