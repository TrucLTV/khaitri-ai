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
      <header className="bg-primary-700 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">KhaiTriAI</Link>

          <nav className="flex gap-4 text-sm font-medium items-center">
            {mainLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`hover:text-primary-100 transition-colors ${pathname === to ? 'underline underline-offset-4' : ''}`}>
                {label}
              </Link>
            ))}

            {/* Công cụ dropdown */}
            <div className="relative" ref={toolRef}>
              <button onClick={() => setToolOpen(o => !o)}
                className={`flex items-center gap-1 hover:text-primary-100 transition-colors ${toolActive ? 'underline underline-offset-4' : ''}`}>
                Công cụ
                <svg className={`w-3 h-3 transition-transform ${toolOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {toolOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {toolLinks.map(({ to, label }) => (
                    <Link key={to} to={to} onClick={() => setToolOpen(false)}
                      className={`block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors ${pathname === to ? 'font-semibold text-primary-600' : ''}`}>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* GV auth */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button onClick={() => setUserOpen(o => !o)} className="flex items-center gap-2">
                  {user.photoURL
                    ? <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border-2 border-white/40" />
                    : <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{user.displayName?.[0]}</div>
                  }
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <p className="px-4 py-1 text-xs text-gray-400 truncate">{user.displayName}</p>
                    <p className="px-4 pb-2 text-xs text-gray-400 truncate">{user.email}</p>
                    <hr className="border-gray-100" />
                    <button onClick={() => { logout(); setUserOpen(false) }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={login} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                GV đăng nhập
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-100 border-t text-center text-xs text-gray-400 py-3">
        KhaiTriAI — Dạy học AI lớp 10 · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
