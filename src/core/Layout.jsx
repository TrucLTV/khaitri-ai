import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/',          label: 'Trang chủ' },
  { to: '/resources', label: 'Tư liệu'   },
  { to: '/teacher',   label: 'Giáo viên' },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-primary-700 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            KhaiTriAI
          </Link>
          <nav className="flex gap-4 text-sm font-medium">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`hover:text-primary-100 transition-colors ${
                  pathname === to ? 'underline underline-offset-4' : ''
                }`}
              >
                {label}
              </Link>
            ))}
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
