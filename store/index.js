// Initial state
const state = function () {
  return {
    accessToken: null,
    articles: null,
    categories: null,
    isSyncPending: null,
    isSyncing: false
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
    state.articles = articles.map((article) => {
      article.id = parseInt(article.id, 10);
      return article;
    });
  },
  replaceArticle(state, article) {
    article.id = parseInt(article.id, 10);
    state.articles = [
      ...state.articles.filter((a) => a.id !== article.id),
      article
    ];
  },
  addArticle(state, article) {
    article.id = parseInt(article.id, 10);
    state.articles.push(article);
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
  },
  setIsSyncPending(state, isSyncPending) {
    state.isSyncPending = isSyncPending;
  },
  setIsSyncing(state, isSyncing) {
    state.isSyncing = isSyncing;
  }
};

// Actions (asynchronous operations and/or multiple mutations)
const actions = {
  loadAccessToken({commit}) {
    const accessToken = window.localStorage.getItem('accessToken');
    commit('setAccessToken', accessToken);
    return Promise.resolve(accessToken);
  },
  loadIsSyncPending({commit}) {
    const lastIndex = window.localStorage.getItem('syncQueue.lastIndex');
    const isPending = lastIndex !== null;
    commit('setIsSyncPending', isPending);
    return Promise.resolve(isPending);
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
  },
  getSyncQueue() {
    const lastIndex = window.localStorage.getItem('syncQueue.lastIndex');
    let queue = [];
    let item;
    let parsesd;

    for (let index = 0; index <= lastIndex; index++) {
      item = window.localStorage.getItem(`syncQueue.${index}`);
      parsesd = JSON.parse(item);
      queue.push(parsesd);
    }

    return Promise.resolve(queue);
  },
  addToSyncQueue({commit}, {method, url, payload}) {
    const currentLastIndex = window.localStorage.getItem('syncQueue.lastIndex');
    const timestamp = Date.now();
    const content = JSON.stringify({method, url, payload, timestamp});
    let newLastIndex;

    if (currentLastIndex === null) {
      newLastIndex = 0;
    } else {
      newLastIndex = parseInt(currentLastIndex, 10) + 1;
    }

    window.localStorage.setItem(`syncQueue.${newLastIndex}`, content);
    window.localStorage.setItem('syncQueue.lastIndex', newLastIndex.toString());
    commit('setIsSyncPending', true);
    return Promise.resolve();
  },
  resetSyncQueue({commit}) {
    const lastIndex = window.localStorage.getItem('syncQueue.lastIndex');

    for (let index = 0; index <= lastIndex; index++) {
      window.localStorage.removeItem(`syncQueue.${index}`);
    }
    window.localStorage.removeItem('syncQueue.lastIndex')

    commit('setIsSyncPending', false);
    return Promise.resolve();
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
