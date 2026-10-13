import type { Catalog } from '../types'

export async function loadCatalog(): Promise<Catalog> {
  const response = await fetch(`${import.meta.env.BASE_URL}content/catalog.json`)
  if (!response.ok) {
    throw new Error('Không tải được danh mục tài liệu.')
  }
  return response.json() as Promise<Catalog>
}
