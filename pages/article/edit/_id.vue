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
import { mapMutations } from 'vuex'

import ArticleForm from '~/components/ArticleForm'

export default {
  components: {
    ArticleForm
  },
  validate({params}) {
    return /^\d+$/.test(params.id);
  },
  asyncData({app, params}) {
    return app.$axios.$get('/v2/articles/' + params.id)
      .then((result) => {
        return {article: result}
      });
  },
  data() {
    return {
      articleId: this.$route.params.id
    };
  },
  methods: {
    ...mapMutations(['resetArticles']),
    saveArticle(data) {
      // TODO: Can that be combined with the addArticle method in the add page?
      const article = {
        category: 1,
        name: data.name,
        size: data.size,
        unit: data.unit,
        best_before: data.best_before,
        stock: data.stock
      };

      this.$axios.$put('/v2/articles/' + this.articleId, article)
        .then(() => {
          this.resetArticles();
          this.$router.push({path: '/'});
        })
        .catch(console.error);
    }
  }
}
</script>
