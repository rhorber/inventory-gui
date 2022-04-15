import { Article, Category } from '~/types/entities'

export type EmptyResponse = ''

export type CategoriesResponse = {
  categories: Category[]
}

export type CategoryMoveResponse = {
  categories: [Category, Category]
}

export type ArticlesResponse = {
  articles: Article[]
}

export type ArticlesMoveResponse = {
  articles: [Article, Article]
}

export type InventoriesResponse = {
  status: 'active' | 'inactive'
}

type GtinQueryResponseExisting = {
  type: 'existing'
  articleId: number
}

type GtinQueryResponseFound = {
  type: 'found'
  name: string
  quantity: string
}

type GtinQueryResponseNotFound = {
  type: 'notFound'
}

type GtinQueryResponseError = {
  type: 'error'
  error: string
}

export type GtinQueryResponse =
  GtinQueryResponseExisting
  | GtinQueryResponseFound
  | GtinQueryResponseNotFound
  | GtinQueryResponseError
