<template>
  <!-- TODO: Put content into a component, is nearly the same as category page -->
  <div>
    <p class="is-size-3">Alle Artikel</p>
    <div class="is-flex is-justify-content-space-between is-align-items-center py-4">
      <b-button
        type="is-info"
        tag="nuxt-link"
        to="/article/add"
      >
        Artikel erstellen
      </b-button>
      <b-field>
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
        to="/article/add"
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

  data() {
    return {
      hideStockZero: false
    };
  },

  computed: {
    ...mapState(['articles']),
    ...mapGetters(['categoriesMap']),
    filteredArticles() {
      if (this.hideStockZero === false) {
        return this.articles;
      }

      return this.articles.filter(
        (article) => {
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
        (article1, article2) => {
          if (article1.category === article2.category) {
            return (article1.position - article2.position)
          } else {
            let category1 = this.categoriesMap[article1.category];
            let category2 = this.categoriesMap[article2.category];

            return (category1.position - category2.position);
          }
        }
      );
    }
  }
}
</script>
