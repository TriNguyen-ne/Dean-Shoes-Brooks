import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (user) {
    return <Navigate to={from} replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      const ok = await login(username, password)
      if (!ok) {
        setError('Sai tên đăng nhập hoặc mật khẩu.')
        return
      }
      navigate(from, { replace: true })
    } catch {
      setError('Không đăng nhập được. Thử lại sau.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className="flex min-h-svh items-center justify-center bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("${import.meta.env.BASE_URL}images/login-image.jpg")`,
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-line bg-card/95 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 flex justify-center">
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="Dean Shoes"
            className="h-auto w-32 drop-shadow-lg"
          />
        </div>
        <h1 className="m-0 text-2xl font-semibold tracking-tight">Đăng nhập</h1>
        <p className="mt-2 mb-6 text-sm text-muted">
          LMS nội bộ — cần tài khoản member để xem tài liệu.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Tên đăng nhập
            <input
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border border-line bg-paper px-3 py-2.5 outline-none ring-accent focus:ring-2"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Mật khẩu
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-line bg-paper px-3 py-2.5 outline-none ring-accent focus:ring-2"
              required
            />
          </label>
          {error ? <p className="m-0 text-sm text-youtube">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {pending ? 'Đang đăng nhập…' : 'Vào thư viện'}
          </button>
        </form>
      </div>
    </div>
  )
}
