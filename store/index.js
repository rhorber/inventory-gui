// Initial state
const state = function () {
  return {
    accessToken: null
  };
};

// Getters
const getters = {};

// Mutations (setters; synchronous operations, preferably on one state property)
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
  }
};

// Actions (asynchronous operations and/or multiple mutations)
const actions = {
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

export default {
  state,
  getters,
  mutations,
  actions
};
