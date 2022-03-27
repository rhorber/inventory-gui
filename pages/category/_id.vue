<script>
import { mapGetters, mapState } from 'vuex'

import PageArticles from '~/components/PageArticles'

export default {
  components: {
    PageArticles
  },

  validate({params}) {
    return /^\d+$/.test(params.id);
  },

  data() {
    return {
      categoryId: this.$route.params.id,
      hideStockZero: false
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
        (article) => {
          if (article.category !== this.selectedCategory.id) {
            return false;
          }

          if (this.hideStockZero === false) {
            return true;
          }

          if (article.hasOwnProperty('lots') === false) {
            return false;
          }

          let stock = article.lots.reduce(
            (value, lot) => (parseInt(lot.stock, 10) + value),
            0
          );

          return stock > 0;
        }
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

<template>
  <page-articles
    v-model="hideStockZero"
    :page-title="pageTitle"
    :articles="sortedArticles"
    :add-article-button-link="'/article/add?category=' + categoryId"
  />
</template>
