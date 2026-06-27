import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const PIN_KEY    = 'gv_pin_ok'
const VALID_PIN  = import.meta.env.VITE_TEACHER_PIN || 'KhaiTri2025'

function isPinValid() {
  return sessionStorage.getItem(PIN_KEY) === 'true'
}

export default function TeacherGate({ children }) {
  const { user, login } = useAuth()
  const [pinInput,   setPinInput]  = useState('')
  const [pinOk,      setPinOk]     = useState(isPinValid)
  const [pinError,   setPinError]  = useState(false)
  const [tab,        setTab]       = useState('pin')
  const [gLoading,   setGLoading]  = useState(false)

  // Still detecting Google auth state
  if (user === undefined) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Granted — either Google or PIN
  if (user || pinOk) return children

  const checkPin = () => {
    if (pinInput.trim() === VALID_PIN) {
      sessionStorage.setItem(PIN_KEY, 'true')
      setPinOk(true)
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 1500)
    }
  }

  const handleGoogle = async () => {
    setGLoading(true)
    await login()
    setGLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto pt-12 space-y-6">
      <div className="text-center">
        <p className="text-4xl mb-2">🔐</p>
        <h2 className="text-xl font-bold text-gray-800">Khu vực Giáo viên</h2>
        <p className="text-sm text-gray-400 mt-1">Học sinh không cần đăng nhập để tham gia</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button onClick={() => setTab('pin')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === 'pin' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>
          Nhập PIN
        </button>
        <button onClick={() => setTab('google')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === 'google' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>
          Google
        </button>
      </div>

      {tab === 'pin' && (
        <div className="space-y-3">
          <input
            type="password"
            value={pinInput}
            onChange={e => { setPinInput(e.target.value); setPinError(false) }}
            onKeyDown={e => e.key === 'Enter' && checkPin()}
            placeholder="Nhập mã PIN giáo viên"
            className={`w-full border-2 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest focus:outline-none transition-colors ${
              pinError ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-primary-400'
            }`}
          />
          {pinError && <p className="text-red-500 text-sm text-center">PIN không đúng</p>}
          <button onClick={checkPin} disabled={!pinInput.trim()}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-40 transition-colors">
            Xác nhận →
          </button>
          <p className="text-xs text-gray-400 text-center">PIN mặc định: <span className="font-mono">KhaiTri2025</span></p>
        </div>
      )}

      {tab === 'google' && (
        <div className="space-y-3">
          <button onClick={handleGoogle} disabled={gLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-sm transition-all font-medium text-gray-700 disabled:opacity-50">
            <GoogleIcon />
            {gLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
          </button>
          <p className="text-xs text-gray-400 text-center">
            Yêu cầu bật Google Auth trong Firebase Console
          </p>
        </div>
      )}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
