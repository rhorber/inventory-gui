export const state = () => ({
  accessToken: null
});

export const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
  }
};

export const actions = {
  loadAccessToken({commit}) {
    const accessToken = window.localStorage.getItem('accessToken');
    commit('setAccessToken', accessToken);
    return Promise.resolve(accessToken);
  },
  saveAccessToken({commit}, accessToken) {
    window.localStorage.setItem('accessToken', accessToken);
    commit('setAccessToken', accessToken);
    return Promise.resolve();
  }
};
