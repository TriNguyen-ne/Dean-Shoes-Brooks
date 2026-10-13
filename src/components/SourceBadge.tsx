import { detectSource, sourceLabel } from '../lib/media'

const styles: Record<string, string> = {
  youtube: 'bg-red-50 text-youtube',
  drive: 'bg-blue-50 text-drive',
  file: 'bg-stone-100 text-muted',
}

export function SourceBadge({ url }: { url: string }) {
  const source = detectSource(url)
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[source]}`}
    >
      {sourceLabel(source)}
    </span>
  )
}
