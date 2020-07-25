<template>
  <section class="container">
    <div>
      <h2>Artikel bearbeiten ({{ articleId }})</h2>
      <article-form
        :article="article"
        @formSubmitted="saveArticle"
      />
    </div>
  </section>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

import ArticleForm from '~/components/ArticleForm'

export default {
  components: {
    ArticleForm
  },

  validate({params}) {
    return /^\d+$/.test(params.id);
  },

  asyncData({app, store, params}) {
    if ($nuxt.isOnline) {
      return app.$axios.$get('/v2/articles/' + params.id)
        .then((result) => {
          return {article: result}
        });
    } else {
      let articles = store.state.articles.filter((article) => {
        return (article.id == params.id);
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
        best_before: data.best_before,
        stock: data.stock
      };

      const url = `/v2/articles/${this.articleId}`;
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
