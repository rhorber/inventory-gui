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

  mounted() {
    if (Object.prototype.hasOwnProperty.call(this.$route.query, 'category')) {
      this.emptyArticle.category = this.$route.query.category;
    }
  },

  methods: {
    ...mapMutations(['resetArticles']),
    addArticle(data) {
      // TODO: Can that be combined with the saveArticle method in the edit page?
      const article = {
        category: data.category,
        name: data.name,
        size: data.size,
        unit: data.unit,
        best_before: data.best_before,
        stock: data.stock
      };

      this.$axios.$post('/v2/articles', article)
        .then(() => {
          let path = `/category/${data.category}`;

          this.resetArticles();
          this.$router.push({path: path});
        })
        .catch(console.error);
    }
  }
}
</script>
