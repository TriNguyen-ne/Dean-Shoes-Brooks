import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SourceBadge } from '../components/SourceBadge'
import { loadCatalog } from '../lib/content'
import type { Catalog } from '../types'

export function HomePage() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('all')

  useEffect(() => {
    loadCatalog()
      .then(setCatalog)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu')
      })
  }, [])

  const filtered = useMemo(() => {
    if (!catalog) return []
    const q = query.trim().toLowerCase()
    return catalog.resources
      .filter((item) => categoryId === 'all' || item.categoryId === categoryId)
      .filter(
        (item) =>
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [catalog, categoryId, query])

  if (error) {
    return <p className="text-youtube">{error}</p>
  }

  if (!catalog) {
    return <p className="text-muted">Đang tải thư viện…</p>
  }

  const categoryName = (id: string) =>
    catalog.categories.find((c) => c.id === id)?.name ?? id

  return (
    <div>
      <div className="mb-8">
        <h1 className="m-0 text-3xl font-semibold tracking-tight">Thư viện</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Video YouTube hoặc Google Drive được nhúng ngay trên trang. Tài liệu mở
          bằng liên kết.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên hoặc mô tả…"
          className="w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm outline-none ring-accent focus:ring-2 sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId('all')}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              categoryId === 'all'
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-card text-muted'
            }`}
          >
            Tất cả
          </button>
          {catalog.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                categoryId === category.id
                  ? 'border-accent bg-accent text-white'
                  : 'border-line bg-card text-muted'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-card p-8 text-center text-muted">
          Không có bài nào khớp.
        </p>
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
          {filtered.map((item) => (
            <li key={item.id}>
              <Link
                to={`/resources/${item.id}`}
                className="block h-full rounded-2xl border border-line bg-card p-5 text-ink no-underline shadow-sm transition hover:border-accent"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <SourceBadge url={item.url} />
                  <span className="text-xs text-muted">
                    {categoryName(item.categoryId)}
                  </span>
                </div>
                <h2 className="m-0 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
