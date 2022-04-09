import { Article, Category } from '~/types/entities'

export type EmptyResponse = ''

export type CategoriesResponse = {
  categories: Category[]
}

export type ArticlesResponse = {
  articles: Article[]
}

export type InventoriesResponse = {
  status: 'active' | 'inactive'
}
