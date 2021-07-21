<template>
  <!-- TODO: Put content into a component, is nearly the same as index -->
  <div>
    <p class="is-size-3">
      {{ pageTitle }}
    </p>
    <div class="columns py-4">
      <div class="column">
        <b-button
          type="is-info"
          tag="nuxt-link"
          :to="'/article/add?category=' + categoryId"
        >
          Artikel erstellen
        </b-button>
      </div>
      <b-field class="column is-narrow">
        <b-checkbox
          v-model="hideStockZero"
          type="is-info"
        >
          Artikel ohne Bestand ausblenden
        </b-checkbox>
      </b-field>
    </div>
    <article-table
      :articles="sortedArticles"
    />
    <div class="py-4">
      <b-button
        type="is-info"
        tag="nuxt-link"
        :to="'/article/add?category=' + categoryId"
      >
        Artikel erstellen
      </b-button>
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
