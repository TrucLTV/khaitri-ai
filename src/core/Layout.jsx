import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const mainLinks = [
  { to: '/',          label: 'Trang chủ' },
  { to: '/resources', label: 'Tư liệu'   },
  { to: '/teacher',   label: 'Giáo viên' },
]

const toolLinks = [
  { to: '/timer',      label: 'Đồng hồ'        },
  { to: '/quiz',       label: 'Quiz'            },
  { to: '/rubric',     label: 'Rubric'          },
  { to: '/voting',     label: 'Voting live'     },
  { to: '/padlet',     label: 'Padlet số'       },
  { to: '/groups',     label: 'GĐ3 Dashboard'   },
  { to: '/quiz-stats', label: 'Quiz Stats (GV)' },
]

export default function Layout({ children }) {
  const { pathname }           = useLocation()
  const { user, login, logout } = useAuth()
  const [toolOpen, setToolOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const toolRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (toolRef.current && !toolRef.current.contains(e.target)) setToolOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toolActive = toolLinks.some(l => pathname === l.to)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="text-white shadow-md" style={{ background: 'linear-gradient(90deg, #1e40af 0%, #2563eb 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-lg font-black tracking-tight">KhaiTriAI</span>
          </Link>

          <nav className="flex gap-1 text-sm font-medium items-center">
            {mainLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === to
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}>
                {label}
              </Link>
            ))}

            {/* Công cụ dropdown */}
            <div className="relative" ref={toolRef}>
              <button onClick={() => setToolOpen(o => !o)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  toolActive
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}>
                Công cụ
                <svg className={`w-3.5 h-3.5 transition-transform ${toolOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {toolOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-gray-700 rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                  {toolLinks.map(({ to, label }) => (
                    <Link key={to} to={to} onClick={() => setToolOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                        pathname === to ? 'font-semibold text-blue-600 bg-blue-50' : ''
                      }`}>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* GV auth */}
            {user ? (
              <div className="relative ml-1" ref={userRef}>
                <button onClick={() => setUserOpen(o => !o)}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-2 py-1.5 rounded-lg transition-colors">
                  {user.photoURL
                    ? <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                    : <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">{user.displayName?.[0]}</div>
                  }
                  <span className="text-xs text-white/90 max-w-20 truncate hidden sm:block">{user.displayName?.split(' ').pop()}</span>
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-gray-700 rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <p className="px-4 py-1 text-xs font-semibold text-gray-600 truncate">{user.displayName}</p>
                    <p className="px-4 pb-2 text-xs text-gray-400 truncate">{user.email}</p>
                    <hr className="border-gray-100 mb-1" />
                    <button onClick={() => { logout(); setUserOpen(false) }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={login}
                className="ml-1 text-xs bg-white text-blue-700 hover:bg-blue-50 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                GV đăng nhập
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 text-center text-xs text-gray-400 py-4 bg-white">
        <span className="font-semibold text-blue-600">KhaiTriAI</span>
        {' '}· Chương trình Tin học 10 — THPT Nguyễn Khuyến · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
