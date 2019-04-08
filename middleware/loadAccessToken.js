export default function ({store}) {
  if (store.state.accessToken === null) {
    return store.dispatch('loadAccessToken');
  }
}
