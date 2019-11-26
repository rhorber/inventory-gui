function loadAndSetInventory(axios, store) {
  return axios.$get('/v1/inventory')
    .then((result) => {
      store.commit('setItems', result.items);
    });
}

export default function ({app, store}) {
  if (store.state.accessToken === null) {
    return store.dispatch('loadAccessToken')
      .then((_result) => {
        return loadAndSetInventory(app.$axios, store);
      });
  }

  if (store.state.items === null) {
    return loadAndSetInventory(app.$axios, store);
  }
}
