<template>
  <div>
    <h2>Alle Artikel</h2>
    <div class="container-fluid">
      <div class="row justify-content-between align-items-center">
        <div class="column">
          <nuxt-link to="/article/add">
            <b-button
              variant="primary"
              class="mt-2 mb-3"
            >
              Artikel erstellen
            </b-button>
          </nuxt-link>
        </div>
        <div class="column">
          <b-form-checkbox
            v-model="hideStockZero"
            name="hide-stock-zero"
          >
            Artikel ohne Bestand ausblenden
          </b-form-checkbox>
        </div>
      </div>
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

  data() {
    return {
      hideStockZero: false
    };
  },

  computed: {
    ...mapState(['articles']),
    ...mapGetters(['categoriesMap']),
    filteredArticles() {
      return this.articles.filter(
        (article) => (this.hideStockZero === false || article.stock > 0)
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
