// Initial state
const state = function () {
  return {
    accessToken: null,
    items: null,
    categories: null
  };
};

// Getters
const getters = {};

// Mutations (setters; synchronous operations, preferably on one state property)
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
  },
  setItems(state, items) {
    state.items = items;
  },
  mutateItem(state, {itemId, consumer}) {
    const item = state.items.find((i) => i.id === itemId);
    consumer(item, state.items);
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
  replaceCategory(state, category) {
    state.categories = [
      ...state.categories.filter((c) => c.id !== category.id),
      category
    ];
  },
  resetCategories(state) {
    state.categories = null;
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
  },
  fetchCategories({commit}) {
    return this.$axios.$get('/v2/categories')
      .then((result) => {
        commit('setCategories', result.categories);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
