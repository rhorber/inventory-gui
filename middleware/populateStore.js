export default async function ({store}) {
  let promises = [];

  if (store.state.accessToken === null) {
    await store.dispatch('loadAccessToken');
  }

  if (store.state.articles === null) {
    promises.push(store.dispatch('fetchArticles'));
  }
  if (store.state.categories === null) {
    promises.push(store.dispatch('fetchCategories'));
  }

  return Promise.all(promises);
}
