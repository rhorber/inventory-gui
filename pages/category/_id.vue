<template>
  <div>
    <h2>{{ pageTitle }}</h2>
    <div class="container-fluid">
      <div class="row justify-content-between align-items-center">
        <div class="column">
          <nuxt-link :to="'/article/add?category=' + categoryId">
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
      <nuxt-link :to="'/article/add?category=' + categoryId">
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
          return (this.hideStockZero === false || article.stock > 0);
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
