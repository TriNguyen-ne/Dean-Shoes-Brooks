import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const adminHref = `${import.meta.env.BASE_URL}admin/index.html`

export function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-svh">
      <header className="border-b border-line bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="Dean Shoes"
              className="h-12 w-auto"
            />
            <span className="hidden text-sm text-muted sm:inline">
              Tài liệu & video hướng dẫn
            </span>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 no-underline ${
                  isActive ? 'bg-accent text-white' : 'text-muted hover:text-ink'
                }`
              }
            >
              Thư viện
            </NavLink>
            <a
              href={adminHref}
              className="rounded-full px-3 py-1.5 text-muted no-underline hover:text-ink"
            >
              Quản trị
            </a>
            <span className="hidden text-sm text-muted sm:inline">
              {user?.username}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-line px-3 py-1.5 text-muted hover:text-ink"
            >
              Đăng xuất
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-5xl px-4 pb-10 text-center text-xs text-muted">
        Tài khoản member để xem. Thêm bài qua Quản trị (GitHub / CMS).
      </footer>
    </div>
  )
}
