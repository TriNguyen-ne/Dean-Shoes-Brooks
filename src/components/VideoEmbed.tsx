import { detectSource, embedUrl } from '../lib/media'
import type { ResourceKind } from '../types'

type Props = {
  url: string
  kind: ResourceKind
  title: string
}

export function VideoEmbed({ url, kind, title }: Props) {
  const source = detectSource(url)
  const src = embedUrl(url)
  const canEmbedVideo = Boolean(src) && kind === 'VIDEO' && (source === 'youtube' || source === 'drive')
  const localPdf =
    kind === 'FILE' &&
    source === 'file' &&
    !url.startsWith('http') &&
    url.toLowerCase().endsWith('.pdf')

  if (source === 'drive' && url.includes('THAY_ID_DRIVE')) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-line bg-card px-6 text-center text-sm text-muted">
        Đây là bài mẫu. Vào Quản trị, dán link Google Drive thật (chia sẻ “Anyone
        with the link”) để nhúng video không quảng cáo.
      </div>
    )
  }

  if (canEmbedVideo && src) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-black shadow-sm">
        <iframe
          title={title}
          src={src}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  if (localPdf && src) {
    const href = `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`
    return (
      <iframe
        title={title}
        src={href}
        className="h-[70vh] w-full rounded-2xl border border-line bg-card"
      />
    )
  }

  const href = url.startsWith('http')
    ? url
    : `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`

  return (
    <div className="rounded-2xl border border-line bg-card p-8 text-center">
      <p className="mb-4 text-sm text-muted">Tài liệu mở bằng liên kết.</p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex rounded-full bg-accent px-5 py-2 text-sm font-medium text-white no-underline hover:bg-accent-dark"
      >
        Mở tài liệu
      </a>
    </div>
  )
}
