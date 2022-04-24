<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'pinia'
import { Context } from '@nuxt/types'

import AppLayoutForm from '~/components/AppLayoutForm.vue'
import ArticleForm from '~/components/ArticleForm.vue'
import { useRootStore } from '~/stores/root'
import { Article } from '~/types/entities'
import { EmptyResponse } from '~/types/api'

type AsyncData = {
  article: Article
}

export default Vue.extend({
  components: {
    ArticleForm,
    AppLayoutForm
  },

  validate: function ({ params }: Context): boolean {
    return /^\d+$/.test(params.id)
  },

  asyncData: function ({ app, store, params }: Context): AsyncData | Promise<AsyncData> {
    const articleId = parseInt(params.id, 10)

    if (window.$nuxt.isOnline) {
      return app.$axios.$get<Article>(`/v3/articles/${articleId}`)
        .then((result: Article): AsyncData => {
          return { article: result }
        })
    } else {
      const articles = store.state.articles.filter((article: Article): boolean => {
        return (article.id === articleId)
      })
      const article = Object.assign({}, articles[0])
      return { article }
    }
  },

  data: function () {
    return {
      articleId: this.$route.params.id
    }
  },

  methods: {
    ...mapActions(useRootStore, ['addToSyncQueue', 'replaceArticle', 'resetArticles']),
    saveArticle(data: Article): void {
      // TODO: Can that be combined with the addArticle method in the add page?
      const article: Article = {
        category: data.category,
        name: data.name,
        size: data.size,
        unit: data.unit,
        lots: data.lots,
        gtins: data.gtins
      }

      const url = `/v3/articles/${this.articleId}`
      const path = `/category/${data.category}/#article-${this.articleId}`

      if (this.$nuxt.isOnline) {
        this.$axios.$put<EmptyResponse>(url, article)
          .then((): void => {
            this.resetArticles()
            this.$router.push({ path })
          })
          .catch(console.error)
      } else {
        this.addToSyncQueue({ method: 'put', url: url, payload: article })
        article.id = data.id
        article.position = data.position
        this.replaceArticle(article)
        this.$router.push({ path })
      }
    }
  }
})
</script>

<template>
  <AppLayoutForm
    :page-title="`Artikel bearbeiten (${articleId})`"
  >
    <ArticleForm
      :article="article"
      @formSubmitted="saveArticle"
    />
  </AppLayoutForm>
</template>
