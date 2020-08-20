<template>
  <section class="container">
    <div>
      <h2>Artikel erstellen</h2>
      <article-form
        :article="emptyArticle"
        @formSubmitted="addArticle"
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

  data() {
    return {
      emptyArticle: {
        category: 0,
        name: '',
        size: '',
        unit: '',
        lots: []
      }
    };
  },

  mounted() {
    if (Object.prototype.hasOwnProperty.call(this.$route.query, 'category')) {
      this.emptyArticle.category = this.$route.query.category;
    }
  },

  methods: {
    ...mapMutations({resetArticles: 'resetArticles', addToStore: 'addArticle'}),
    ...mapActions(['addToSyncQueue']),
    addArticle(data) {
      // TODO: Can that be combined with the saveArticle method in the edit page?
      const article = {
        category: data.category,
        name: data.name,
        size: data.size,
        unit: data.unit,
        lots: data.lots
      };

      const url = '/v3/articles';
      const path = `/category/${data.category}`;

      if ($nuxt.isOnline) {
        this.$axios.$post(url, article)
          .then(() => {
            this.resetArticles();
            this.$router.push({path: path});
          })
          .catch(console.error);
      } else {
        this.addToSyncQueue({method: 'post', url: url, payload: article});
        this.addToStore(article);
        this.$router.push({path: path});
      }
    }
  }
}
</script>
