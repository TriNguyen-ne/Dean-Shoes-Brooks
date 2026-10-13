export type ResourceKind = 'VIDEO' | 'FILE'

export type Category = {
  id: string
  name: string
}

export type Resource = {
  id: string
  title: string
  description: string
  categoryId: string
  kind: ResourceKind
  url: string
  createdAt: string
}

export type Catalog = {
  categories: Category[]
  resources: Resource[]
}
