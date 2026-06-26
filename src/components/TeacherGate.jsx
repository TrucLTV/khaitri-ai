import { useAuth } from '../context/AuthContext'

export default function TeacherGate({ children }) {
  const { user, loading, login } = useAuth()

  if (user === undefined) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return (
    <div className="max-w-sm mx-auto pt-16 text-center space-y-5">
      <p className="text-5xl">🔐</p>
      <h2 className="text-xl font-bold text-gray-800">Dành cho Giáo viên</h2>
      <p className="text-sm text-gray-500">Đăng nhập Google để tạo poll / padlet / xem thống kê</p>
      <button
        onClick={login}
        disabled={loading}
        className="flex items-center gap-3 mx-auto px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-sm transition-all font-medium text-gray-700 disabled:opacity-50"
      >
        <GoogleIcon />
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
      </button>
      <p className="text-xs text-gray-400">Học sinh không cần đăng nhập để tham gia</p>
    </div>
  )

  return children
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
