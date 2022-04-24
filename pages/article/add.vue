<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'pinia'

import AppLayoutForm from '~/components/AppLayoutForm.vue'
import ArticleForm from '~/components/ArticleForm.vue'
import { useRootStore } from '~/stores/root'
import { Article } from '~/types/entities'
import { EmptyResponse } from '~/types/api'

export default Vue.extend({
  components: {
    ArticleForm,
    AppLayoutForm
  },

  data: function () {
    const emptyArticle = {
      category: 0,
      name: '',
      size: '',
      unit: '',
      lots: [],
      gtins: []
    }

    if (Object.prototype.hasOwnProperty.call(this.$route.query, 'category')) {
      const category = this.$route.query.category
      if (typeof category === 'string') {
        emptyArticle.category = Number.parseInt(category, 10)
      }
    }

    return {
      emptyArticle
    }
  },

  methods: {
    ...mapActions(useRootStore, {
      addToStore: 'addArticle',
      addToSyncQueue: 'addToSyncQueue',
      resetArticles: 'resetArticles'
    }),
    addArticle(data: Article): void {
      // TODO: Can that be combined with the saveArticle method in the edit page?
      const article: Article = {
        category: data.category,
        name: data.name,
        size: data.size,
        unit: data.unit,
        lots: data.lots,
        gtins: data.gtins
      }

      const url = '/v3/articles'
      const path = `/category/${data.category}/#bottom`

      if (this.$nuxt.isOnline) {
        this.$axios.$post<EmptyResponse>(url, article)
          .then((): void => {
            this.resetArticles()
            this.$router.push({ path })
          })
          .catch(console.error)
      } else {
        this.addToSyncQueue({ method: 'post', url: url, payload: article })
        this.addToStore(article)
        this.$router.push({ path })
      }
    }
  }
})
</script>

<template>
  <AppLayoutForm
    page-title="Artikel erstellen"
  >
    <ArticleForm
      :article="emptyArticle"
      @formSubmitted="addArticle"
    />
  </AppLayoutForm>
</template>
