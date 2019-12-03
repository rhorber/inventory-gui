<template>
  <div>
    <h2>{{ pageTitle }}</h2>
    <div>
      <nuxt-link to="/article/add">
        <b-button
          variant="primary"
          class="mt-2 mb-3"
        >
          Artikel erstellen
        </b-button>
      </nuxt-link>
    </div>
    <article-table
      :articles="sortedArticles"
    />
    <div>
      <nuxt-link to="/article/add">
        <b-button
          variant="primary"
          class="mb-2"
        >
          Artikel erstellen
        </b-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import ArticleTable from '~/components/ArticleTable'

export default {
  components: {
    ArticleTable
  },

  validate({params}) {
    return /^\d+$/.test(params.id);
  },

  data() {
    return {
      categoryId: this.$route.params.id
    };
  },

  computed: {
    ...mapState(['articles']),
    ...mapGetters(['categoriesMap']),
    selectedCategory() {
      return this.categoriesMap[this.categoryId];
    },
    pageTitle() {
      return 'Kategorie: ' + this.selectedCategory.name;
    },
    filteredArticles() {
      return this.articles.filter(
        (article) => (article.category === this.selectedCategory.id)
      );
    },
    sortedArticles() {
      return [...this.filteredArticles].sort(
        (article1, article2) => (article1.position - article2.position)
      );
    }
  }
}
</script>
