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
import { mapMutations } from 'vuex'

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
        best_before: '',
        stock: 0
      }
    };
  },

  methods: {
    ...mapMutations(['resetArticles']),
    addArticle(data) {
      // TODO: Can that be combined with the saveArticle method in the edit page?
      const article = {
        category: 1,
        name: data.name,
        size: data.size,
        unit: data.unit,
        best_before: data.best_before,
        stock: data.stock
      };

      this.$axios.$post('/v2/articles', article)
        .then(() => {
          this.resetArticles();
          this.$router.push({path: '/'});
        })
        .catch(console.error);
    }
  }
}
</script>
