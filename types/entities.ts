export type Lot = {
  id?: number
  article?: number
  best_before: string
  stock: number
  position: number
  timestamp?: number
}

export type Article = {
  id?: number
  category: number
  name: string
  size: number
  unit: string
  inventoried?: -1 | 0 | 1
  position?: number
  timestamp?: number
  lots: Lot[]
  gtins: string[]
}

export type Category = {
  id?: number
  name: string
  position?: number
  timestamp?: number
}

export type ArticleProperty = Omit<Article, 'size'> & {
  size: number | string
}
