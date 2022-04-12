<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Context } from '@nuxt/types'

import ArticlesPage from '~/components/ArticlesPage.vue'
import { Article, Category, Lot } from '~/types/entities'

export default Vue.extend({
  components: {
    ArticlesPage
  },

  validate: function ({ params }: Context): boolean {
    return /^\d+$/.test(params.id)
  },

  data: function () {
    return {
      categoryId: this.$route.params.id,
      hideStockZero: false
    }
  },

  computed: {
    ...mapState(['articles']),
    ...mapGetters(['categoriesMap']),
    selectedCategory(): Category {
      return this.categoriesMap[this.categoryId]
    },
    pageTitle(): string {
      return 'Kategorie: ' + this.selectedCategory.name
    },
    filteredArticles(): Article[] {
      return this.articles.filter(
        (article: Article): boolean => {
          if (article.category !== this.selectedCategory.id) {
            return false
          }

          if (this.hideStockZero === false) {
            return true
          }

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
        (article1: Article, article2: Article): number => ((article1.position || 0) - (article2.position || 0))
      )
    }
  }
})
</script>

<template>
  <ArticlesPage
    v-model="hideStockZero"
    :page-title="pageTitle"
    :articles="sortedArticles"
    :add-article-button-link="'/article/add?category=' + categoryId"
  />
</template>
