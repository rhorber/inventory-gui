import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      accessToken: null
    },
    mutations: {
      setAccessToken(state, accessToken) {
        state.accessToken = accessToken;
      }
    },
    actions: {
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
    }
  })
};

export default createStore
