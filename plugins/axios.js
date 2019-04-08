export default function ({$axios, redirect, store}) {
  $axios.onRequest(function (config) {
    config.headers.common['Authorization'] = `Bearer ${store.state.accessToken}`;
  });

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    if (code === 401) {
      redirect('/login');
    }
  });
}
