import { Context, Middleware } from '@nuxt/types'

import { useRootStore } from '~/stores/root'

const populateStore: Middleware = async function ({ $pinia }: Context): Promise<void> {
  const store = useRootStore($pinia)
  const promises: Promise<void>[] = []

  if (store.accessToken === null) {
    await store.loadAccessToken()
  }

  if (store.isSyncPending === null) {
    await store.loadIsSyncPending()
  }

  if (store.articles === null) {
    promises.push(store.fetchArticles())
  }
  if (store.categories === null) {
    promises.push(store.fetchCategories())
  }
  if (store.isInventoryActive === null) {
    promises.push(store.fetchIsInventoryActive())
  }

  return Promise.all(promises)
    .then((_: void[]): void => {
      // Return nothing, to match the signature of `Middleware`.
    })
}

export default populateStore
