<script lang="ts">
import Vue from 'vue'
import { mapState } from 'pinia'

import ArticlesPage from '~/components/ArticlesPage.vue'
import { useRootStore } from '~/stores/root'
import { Article, Lot } from '~/types/entities'

export default Vue.extend({
  components: {
    ArticlesPage
  },

  data: function () {
    return {
      hideStockZero: false
    }
  },

  computed: {
    ...mapState(useRootStore, ['articles', 'categoriesMap']),
    filteredArticles(): Article[] {
      if (this.articles === null) {
        return []
      }

      if (this.hideStockZero === false) {
        return this.articles
      }

      return this.articles.filter(
        (article: Article): boolean => {
          if (Object.prototype.hasOwnProperty.call(article, 'lots') === false) {
            return false
          }

          const stock = article.lots.reduce(
            (value: number, lot: Lot): number => (lot.stock + value),
            0
          )

          return stock > 0
        }
      )
    },
    sortedArticles(): Article[] {
      return [...this.filteredArticles].sort(
        (article1: Article, article2: Article): number => {
          if (article1.category === article2.category) {
            return ((article1.position ?? 0) - (article2.position ?? 0))
          } else {
            const category1 = this.categoriesMap[article1.category]
            const category2 = this.categoriesMap[article2.category]

            return ((category1.position ?? 0) - (category2.position ?? 0))
          }
        }
      )
    }
  }
})
</script>

<template>
  <ArticlesPage
    v-model="hideStockZero"
    page-title="Alle Artikel"
    :articles="sortedArticles"
    add-article-button-link="/article/add"
  />
</template>
