import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex'

import { Article, Category, Lot } from '~/types/entities'
import { CategoryMap, RootState, SyncItemParameter, SyncItemStorage } from '~/types/store'
import { ArticlesResponse, CategoriesResponse, InventoriesResponse } from '~/types/api'

// Initial state
const state = function (): RootState {
  return {
    accessToken: null,
    articles: null,
    categories: null,
    isInventoryActive: null,
    isSyncPending: null,
    isSyncing: false
  }
}

// Getters
const getters: GetterTree<RootState, RootState> = {
  // Object with categoryId as key and category as value.
  categoriesMap(state: RootState): CategoryMap {
    const map: CategoryMap = {}
    state.categories?.forEach((category: Category): void => {
      map[category.id] = category
    })
    return map
  }
}

// Mutations (setters; synchronous operations, preferably on one state property)
const mutations: MutationTree<RootState> = {
  setAccessToken(state: RootState, accessToken: string | null): void {
    state.accessToken = accessToken
  },
  setArticles(state: RootState, articles: Article[]): void {
    state.articles = articles
  },
  replaceArticle(state: RootState, article: Article): void {
    if (state.articles === null) {
      return
    }
    state.articles = [
      ...state.articles.filter((a: Article): boolean => a.id !== article.id),
      article
    ]
  },
  addArticle(state: RootState, article: Article): void {
    if (state.articles === null) {
      state.articles = []
    }
    state.articles.push(article)
  },
  resetArticles(state: RootState): void {
    state.articles = null
  },
  replaceLot(state: RootState, lot: Lot): void {
    const article = state.articles?.find((a: Article): boolean => a.id === lot.article)

    if (article !== undefined) {
      const lotIndex = article.lots.findIndex((l: Lot): boolean => l.id === lot.id)
      if (lotIndex !== -1) {
        article.lots.splice(lotIndex, 1, lot)
      }
    }
  },
  setCategories(state: RootState, categories: Category[]): void {
    state.categories = categories.sort(
      (category1: Category, category2: Category): number => (category1.position - category2.position)
    )
  },
  replaceCategory(state: RootState, category: Category): void {
    if (state.categories === null) {
      return
    }
    state.categories = [
      ...state.categories.filter((c: Category): boolean => c.id !== category.id),
      category
    ]
    state.categories.sort(
      (category1: Category, category2: Category): number => (category1.position - category2.position)
    )
  },
  resetCategories(state: RootState): void {
    state.categories = null
  },
  setIsInventoryActive(state: RootState, isInventoryActive: boolean): void {
    state.isInventoryActive = isInventoryActive
  },
  setIsSyncPending(state: RootState, isSyncPending: boolean): void {
    state.isSyncPending = isSyncPending
  },
  setIsSyncing(state: RootState, isSyncing: boolean): void {
    state.isSyncing = isSyncing
  }
}

// Actions (asynchronous operations and/or multiple mutations)
const actions: ActionTree<RootState, RootState> = {
  loadAccessToken({ commit }: ActionContext<RootState, RootState>): Promise<string | null> {
    const accessToken = window.localStorage.getItem('accessToken')
    commit('setAccessToken', accessToken)
    return Promise.resolve(accessToken)
  },
  loadIsSyncPending({ commit }: ActionContext<RootState, RootState>): Promise<boolean> {
    const lastIndex = window.localStorage.getItem('syncQueue.lastIndex')
    const isPending = lastIndex !== null
    commit('setIsSyncPending', isPending)
    return Promise.resolve(isPending)
  },
  saveAccessToken({ commit }: ActionContext<RootState, RootState>, accessToken: string): Promise<void> {
    window.localStorage.setItem('accessToken', accessToken)
    commit('setAccessToken', accessToken)
    return Promise.resolve()
  },
  fetchArticles({ commit }: ActionContext<RootState, RootState>): Promise<void> {
    return this.$axios.$get<ArticlesResponse>('/v3/articles')
      .then((result: ArticlesResponse): void => {
        commit('setArticles', result.articles)
      })
  },
  fetchCategories({ commit }: ActionContext<RootState, RootState>): Promise<void> {
    return this.$axios.$get<CategoriesResponse>('/v3/categories')
      .then((result: CategoriesResponse): void => {
        commit('setCategories', result.categories)
      })
  },
  fetchIsInventoryActive({ commit }: ActionContext<RootState, RootState>): Promise<void> {
    return this.$axios.$get<InventoriesResponse>('/v3/inventories')
      .then((result: InventoriesResponse): void => {
        const active = (result.status === 'active')
        commit('setIsInventoryActive', active)
      })
  },
  saveIsInventoryActive(
    { commit, dispatch }: ActionContext<RootState, RootState>,
    isInventoryActive: boolean
  ): Promise<void> {
    commit('setIsInventoryActive', isInventoryActive)
    return dispatch('fetchArticles')
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
  addToSyncQueue(
    { commit }: ActionContext<RootState, RootState>,
    { method, url, payload }: SyncItemParameter
  ): Promise<void> {
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
    commit('setIsSyncPending', true)
    return Promise.resolve()
  },
  resetSyncQueue({ commit }: ActionContext<RootState, RootState>): Promise<void> {
    const syncQueueLastIndex = window.localStorage.getItem('syncQueue.lastIndex')
    if (syncQueueLastIndex === null) {
      return Promise.resolve()
    }

    const lastIndexParsed = Number.parseInt(syncQueueLastIndex, 10)
    for (let index = 0; index <= lastIndexParsed; index++) {
      window.localStorage.removeItem(`syncQueue.${index}`)
    }
    window.localStorage.removeItem('syncQueue.lastIndex')

    commit('setIsSyncPending', false)
    return Promise.resolve()
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
