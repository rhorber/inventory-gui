// Initial state
const state = function () {
  return {
    accessToken: null,
    articles: null,
    categories: null
  };
};

// Getters
const getters = {
  // Object with categoryId as key and category as value.
  categoriesMap(state) {
    let map = {};
    state.categories.forEach((category) => {
      map[category.id] = category;
    });
    return map;
  }
};

// Mutations (setters; synchronous operations, preferably on one state property)
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
  },
  setArticles(state, articles) {
    state.articles = articles;
  },
  replaceArticle(state, article) {
    state.articles = [
      ...state.articles.filter((a) => a.id !== article.id),
      article
    ];
  },
  resetArticles(state) {
    state.articles = null;
  },
  setCategories(state, categories) {
    state.categories = categories.sort(
      (category1, category2) => (category1.position - category2.position)
    );
  },
  replaceCategory(state, category) {
    state.categories = [
      ...state.categories.filter((c) => c.id !== category.id),
      category
    ];
    state.categories.sort(
      (category1, category2) => (category1.position - category2.position)
    );
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
  fetchArticles({commit}) {
    return this.$axios.$get('/v2/articles')
      .then((result) => {
        commit('setArticles', result.articles);
      });
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
