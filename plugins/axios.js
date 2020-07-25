export default function ({$axios, redirect, store}) {
  $axios.onRequest(function (config) {
    config.headers.common['Authorization'] = `Bearer ${store.state.accessToken}`;
  });

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status, 10);
    if (code === 401) {
      redirect('/login');
    }
  });
}
