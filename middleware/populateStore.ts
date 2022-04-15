import { Context, Middleware } from '@nuxt/types'

const populateStore: Middleware = async function ({ store }: Context): Promise<void> {
  const promises: Promise<void>[] = []

  if (store.state.accessToken === null) {
    await store.dispatch('loadAccessToken')
  }

  if (store.state.isSyncPending === null) {
    await store.dispatch('loadIsSyncPending')
  }

  if (store.state.articles === null) {
    promises.push(store.dispatch('fetchArticles'))
  }
  if (store.state.categories === null) {
    promises.push(store.dispatch('fetchCategories'))
  }
  if (store.state.isInventoryActive === null) {
    promises.push(store.dispatch('fetchIsInventoryActive'))
  }

  return Promise.all(promises)
    .then((_: void[]): void => {
      // Return nothing, to match the signature of `Middleware`.
    })
}

export default populateStore
