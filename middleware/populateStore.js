function populateInventory(axios, store) {
  return axios.$get('/v1/inventory')
    .then((result) => {
      store.commit('setItems', result.items);

      return store.dispatch('fetchCategories');
    });
}

export default function ({app, store}) {
  if (store.state.accessToken === null) {
    return store.dispatch('loadAccessToken')
      .then((_result) => {
        return populateInventory(app.$axios, store);
      });
  }

  let promises = [];

  if (store.state.items === null) {
    promises.push(populateInventory(app.$axios, store));
  }
  if (store.state.categories === null) {
    promises.push(store.dispatch('fetchCategories'));
  }

  return Promise.all(promises);
}
