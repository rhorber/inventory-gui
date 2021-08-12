export default async function ({store}) {
  let promises = [];

  if (store.state.accessToken === null) {
    await store.dispatch('loadAccessToken');
  }

  if (store.state.isSyncPending === null) {
    await store.dispatch('loadIsSyncPending');
  }

  if (store.state.articles === null) {
    promises.push(store.dispatch('fetchArticles'));
  }
  if (store.state.categories === null) {
    promises.push(store.dispatch('fetchCategories'));
  }
  if (store.state.isInventoryActive === null) {
    promises.push(store.dispatch('fetchIsInventoryActive'));
  }

  return Promise.all(promises);
}
