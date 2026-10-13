const SESSION_KEY = 'lms_session'

export type AuthUser = {
  username: string
  role: string
}

type UserRecord = AuthUser & {
  passwordSha256: string
}

type UsersFile = {
  users: UserRecord[]
}

async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function loadUsers(): Promise<UserRecord[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}content/users.json`)
  if (!response.ok) throw new Error('Không tải được danh sách tài khoản.')
  const data = (await response.json()) as UsersFile
  return data.users
}

export async function verifyLogin(
  username: string,
  password: string,
): Promise<AuthUser | null> {
  const users = await loadUsers()
  const hash = await sha256(password)
  const found = users.find(
    (user) =>
      user.username.toLowerCase() === username.trim().toLowerCase() &&
      user.passwordSha256 === hash,
  )
  if (!found) return null
  return { username: found.username, role: found.role }
}

export function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function writeSession(user: AuthUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
