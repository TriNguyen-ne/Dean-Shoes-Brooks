import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SourceBadge } from '../components/SourceBadge'
import { VideoEmbed } from '../components/VideoEmbed'
import { loadCatalog } from '../lib/content'
import { detectSource, sourceLabel } from '../lib/media'
import type { Catalog, Resource } from '../types'

export function ResourcePage() {
  const { id } = useParams()
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCatalog()
      .then(setCatalog)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu')
      })
  }, [])

  if (error) return <p className="text-youtube">{error}</p>
  if (!catalog) return <p className="text-muted">Đang tải…</p>

  const resource: Resource | undefined = catalog.resources.find((item) => item.id === id)
  if (!resource) {
    return (
      <div>
        <p>Không tìm thấy bài này.</p>
        <Link to="/">Về thư viện</Link>
      </div>
    )
  }

  const category =
    catalog.categories.find((item) => item.id === resource.categoryId)?.name ??
    resource.categoryId
  const source = detectSource(resource.url)
  const openLabel =
    source === 'file' ? 'Mở tài liệu' : `Mở trên ${sourceLabel(source)}`

  return (
    <article>
      <Link to="/" className="text-sm text-accent no-underline hover:underline">
        ← Thư viện
      </Link>
      <div className="mt-4 mb-2 flex flex-wrap items-center gap-2">
        <SourceBadge url={resource.url} />
        <span className="text-xs text-muted">{category}</span>
      </div>
      <h1 className="m-0 text-3xl font-semibold tracking-tight">{resource.title}</h1>
      <p className="mt-3 mb-6 max-w-3xl text-muted">{resource.description}</p>
      <VideoEmbed url={resource.url} kind={resource.kind} title={resource.title} />
      <p className="mt-4">
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted"
        >
          {openLabel}
        </a>
      </p>
    </article>
  )
}
