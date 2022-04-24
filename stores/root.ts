import { defineStore } from 'pinia'

import { Article, Category, Lot } from '~/types/entities'
import { CategoryMap, RootState, SyncItemParameter, SyncItemStorage } from '~/types/store'
import { ArticlesResponse, CategoriesResponse, InventoriesResponse } from '~/types/api'

const sortCategories = (category1: Category, category2: Category): number => {
  const positionA = category1.position ?? 0
  const positionB = category2.position ?? 0

  // Put categories without a position at the top.
  return (positionA - positionB)
}

export const useRootStore = defineStore('root', {
  state: function (): RootState {
    return {
      accessToken: null,
      articles: null,
      categories: null,
      isInventoryActive: null,
      isSyncPending: null,
      isSyncing: false
    }
  },
  getters: {
    // Object with categoryId as key and category as value.
    categoriesMap(state: RootState): CategoryMap {
      const map: CategoryMap = {}
      state.categories?.forEach((category: Category): void => {
        if (category.id !== undefined) {
          map[category.id] = category
        }
      })
      return map
    }
  },
  actions: {
    // Mutations (setters; synchronous operations, preferably on one state property)
    setAccessToken(accessToken: string | null): void {
      this.accessToken = accessToken
    },
    setArticles(articles: Article[]): void {
      this.articles = articles
    },
    replaceArticle(article: Article): void {
      if (this.articles === null) {
        return
      }
      this.articles = [
        ...this.articles.filter((a: Article): boolean => a.id !== article.id),
        article
      ]
    },
    addArticle(article: Article): void {
      if (this.articles === null) {
        this.articles = []
      }
      this.articles.push(article)
    },
    resetArticles(): void {
      this.articles = null
    },
    replaceLot(lot: Lot): void {
      const article = this.articles?.find((a: Article): boolean => a.id === lot.article)

      if (article !== undefined) {
        const lotIndex = article.lots.findIndex((l: Lot): boolean => l.id === lot.id)
        if (lotIndex !== -1) {
          article.lots.splice(lotIndex, 1, lot)
        }
      }
    },
    setCategories(categories: Category[]): void {
      this.categories = categories.sort(sortCategories)
    },
    replaceCategory(category: Category): void {
      if (this.categories === null) {
        return
      }
      this.categories = [
        ...this.categories.filter((c: Category): boolean => c.id !== category.id),
        category
      ]
      this.categories.sort(sortCategories)
    },
    resetCategories(): void {
      this.categories = null
    },
    setIsInventoryActive(isInventoryActive: boolean): void {
      this.isInventoryActive = isInventoryActive
    },
    setIsSyncPending(isSyncPending: boolean): void {
      this.isSyncPending = isSyncPending
    },
    setIsSyncing(isSyncing: boolean): void {
      this.isSyncing = isSyncing
    },
    // Actions (asynchronous operations and/or multiple mutations)
    loadAccessToken(): Promise<string | null> {
      const accessToken = window.localStorage.getItem('accessToken')
      this.setAccessToken(accessToken)
      return Promise.resolve(accessToken)
    },
    loadIsSyncPending(): Promise<boolean> {
      const lastIndex = window.localStorage.getItem('syncQueue.lastIndex')
      const isPending = lastIndex !== null
      this.setIsSyncPending(isPending)
      return Promise.resolve(isPending)
    },
    saveAccessToken(accessToken: string): Promise<void> {
      window.localStorage.setItem('accessToken', accessToken)
      this.setAccessToken(accessToken)
      return Promise.resolve()
    },
    fetchArticles(): Promise<void> {
      return this.$nuxt.$axios.$get<ArticlesResponse>('/v3/articles')
        .then((result: ArticlesResponse): void => {
          this.setArticles(result.articles)
        })
    },
    fetchCategories(): Promise<void> {
      return this.$nuxt.$axios.$get<CategoriesResponse>('/v3/categories')
        .then((result: CategoriesResponse): void => {
          this.setCategories(result.categories)
        })
    },
    fetchIsInventoryActive(): Promise<void> {
      return this.$nuxt.$axios.$get<InventoriesResponse>('/v3/inventories')
        .then((result: InventoriesResponse): void => {
          const active = (result.status === 'active')
          this.setIsInventoryActive(active)
        })
    },
    saveIsInventoryActive(isInventoryActive: boolean): Promise<void> {
      this.setIsInventoryActive(isInventoryActive)
      return this.fetchArticles()
    },
    getSyncQueue(): Promise<SyncItemStorage[]> {
      const syncQueueLastIndex = window.localStorage.getItem('syncQueue.lastIndex')
      if (syncQueueLastIndex === null) {
        return Promise.resolve([])
      }

      const lastIndexParsed = Number.parseInt(syncQueueLastIndex, 10)
      const queue: SyncItemStorage[] = []
      let item
      let parsed

      for (let index = 0; index <= lastIndexParsed; index++) {
        item = window.localStorage.getItem(`syncQueue.${index}`)
        if (item !== null) {
          parsed = JSON.parse(item)
          queue.push(parsed)
        }
      }

      return Promise.resolve(queue)
    },
    addToSyncQueue({ method, url, payload }: SyncItemParameter): Promise<void> {
      const currentLastIndex = window.localStorage.getItem('syncQueue.lastIndex')
      const timestamp = Math.floor(Date.now() / 1000)
      const content = JSON.stringify({ method, url, payload, timestamp })
      let newLastIndex

      if (currentLastIndex === null) {
        newLastIndex = 0
      } else {
        newLastIndex = Number.parseInt(currentLastIndex, 10) + 1
      }

      window.localStorage.setItem(`syncQueue.${newLastIndex}`, content)
      window.localStorage.setItem('syncQueue.lastIndex', newLastIndex.toString())
      this.setIsSyncPending(true)
      return Promise.resolve()
    },
    resetSyncQueue(): Promise<void> {
      const syncQueueLastIndex = window.localStorage.getItem('syncQueue.lastIndex')
      if (syncQueueLastIndex === null) {
        return Promise.resolve()
      }

      const lastIndexParsed = Number.parseInt(syncQueueLastIndex, 10)
      for (let index = 0; index <= lastIndexParsed; index++) {
        window.localStorage.removeItem(`syncQueue.${index}`)
      }
      window.localStorage.removeItem('syncQueue.lastIndex')

      this.setIsSyncPending(false)
      return Promise.resolve()
    }
  }
})
