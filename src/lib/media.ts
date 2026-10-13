export type MediaSource = 'youtube' | 'drive' | 'file'

export function detectSource(url: string): MediaSource {
  const value = url.trim()
  if (/youtu\.be\//i.test(value) || /youtube\.com/i.test(value)) return 'youtube'
  if (/drive\.google\.com/i.test(value) || /docs\.google\.com/i.test(value)) {
    return 'drive'
  }
  return 'file'
}

export function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] ?? null
    }
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/')[2] ?? null
    }
    if (parsed.pathname.startsWith('/shorts/')) {
      return parsed.pathname.split('/')[2] ?? null
    }
    if (parsed.pathname.startsWith('/live/')) {
      return parsed.pathname.split('/')[2] ?? null
    }
    return parsed.searchParams.get('v')
  } catch {
    const match = url.match(/(?:v=|\/)([A-Za-z0-9_-]{11})(?:[?&]|$)/)
    return match?.[1] ?? null
  }
}

export function driveId(url: string): string | null {
  const fileMatch = url.match(/\/file\/d\/([^/]+)/)
  if (fileMatch?.[1]) return fileMatch[1]
  try {
    const parsed = new URL(url)
    return parsed.searchParams.get('id')
  } catch {
    return null
  }
}

export function embedUrl(url: string): string | null {
  const source = detectSource(url)
  if (source === 'youtube') {
    const id = youtubeId(url)
    return id ? `https://www.youtube.com/embed/${id}` : null
  }
  if (source === 'drive') {
    const id = driveId(url)
    return id ? `https://drive.google.com/file/d/${id}/preview` : null
  }
  return url.startsWith('http') || url.startsWith('/') ? url : null
}

export function sourceLabel(source: MediaSource): string {
  if (source === 'youtube') return 'YouTube'
  if (source === 'drive') return 'Google Drive'
  return 'Tài liệu'
}
