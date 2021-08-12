<template>
  <BaseLayoutForm
    :page-title="`Artikel bearbeiten (${articleId})`"
  >
    <article-form
      :article="article"
      @formSubmitted="saveArticle"
    />
  </BaseLayoutForm>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

import BaseLayoutForm from '~/components/BaseLayoutForm'
import ArticleForm from '~/components/ArticleForm'

export default {
  components: {
    ArticleForm,
    BaseLayoutForm,
  },

  validate({params}) {
    return /^\d+$/.test(params.id);
  },

  asyncData({app, store, params}) {
    const articleId = parseInt(params.id, 10);

    if ($nuxt.isOnline) {
      return app.$axios.$get(`/v3/articles/${articleId}`)
        .then((result) => {
          return {article: result}
        });
    } else {
      let articles = store.state.articles.filter((article) => {
        return (article.id === articleId);
      });
      let article = Object.assign({}, articles[0]);
      return {article: article};
    }
  },

  data() {
    return {
      articleId: this.$route.params.id
    };
  },

  methods: {
    ...mapMutations(['resetArticles', 'replaceArticle']),
    ...mapActions(['addToSyncQueue']),
    saveArticle(data) {
      // TODO: Can that be combined with the addArticle method in the add page?
      const article = {
        category: data.category,
        name: data.name,
        size: data.size,
        unit: data.unit,
        lots: data.lots
      };

      const url = `/v3/articles/${this.articleId}`;
      const path = `/category/${data.category}`;

      if ($nuxt.isOnline) {
        this.$axios.$put(url, article)
          .then(() => {
            this.resetArticles();
            this.$router.push({path: path});
          })
          .catch(console.error);
      } else {
        this.addToSyncQueue({method: 'put', url: url, payload: article});
        article.id = this.articleId;
        article.position = this.article.position;
        this.replaceArticle(article);
        this.$router.push({path: path});
      }
    }
  }
}
</script>
