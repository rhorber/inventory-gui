<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'pinia'

import AppLayoutForm from '~/components/AppLayoutForm.vue'
import ArticleForm from '~/components/ArticleForm.vue'
import GtinScanner from '~/components/GtinScanner.vue'
import { useRootStore } from '~/stores/root'
import { Article, ArticleProperty } from '~/types/entities'
import { EmptyResponse, GtinQueryResponse } from '~/types/api'

type Data = {
  pageTitle: string
  gtin: string
  scanner: boolean
  loading: boolean
  notFound: boolean
  error: string
  article: ArticleProperty | undefined
}

export default Vue.extend({
  name: 'Gtin',

  components: {
    ArticleForm,
    AppLayoutForm,
    GtinScanner
  },

  data: function (): Data {
    return {
      pageTitle: 'GTIN eingeben',
      gtin: '',
      scanner: false,
      loading: false,
      notFound: false,
      error: '',
      article: undefined
    }
  },

  methods: {
    ...mapActions(useRootStore, {
      addToStore: 'addArticle',
      addToSyncQueue: 'addToSyncQueue',
      resetArticles: 'resetArticles'
    }),
    openScanner(): void {
      this.scanner = true
    },
    onScanCancel(): void {
      this.scanner = false
    },
    onScanSuccess(decodedText: string): void {
      this.scanner = false
      this.gtin = decodedText
    },
    back(): void {
      this.$router.go(-1)
    },
    send(event: MouseEvent): void {
      event.preventDefault()

      this.loading = true
      this.notFound = false
      this.error = ''
      this.gtin = this.gtin.trim()

      this.$axios.$get<GtinQueryResponse>('/v3/gtin/' + this.gtin)
        .then((response: GtinQueryResponse): void => {
          this.handleResponse(response)
          this.loading = false
        })
        .catch((error): void => {
          console.error(error)
          this.error = error
          this.loading = false
        })
    },
    handleResponse(response: GtinQueryResponse): void {
      switch (response.type) {
        case 'existing':
          this.$router.push(`/article/edit/${response.articleId}`)
          return

        case 'found':
          this.pageTitle = 'GTIN eingeben: Artikel erstellen'
          this.article = {
            category: -1,
            name: response.name,
            size: response.quantity,
            unit: '',
            lots: [],
            gtins: [this.gtin]
          } as ArticleProperty
          return

        case 'notFound':
          this.notFound = true
          return

        case 'error':
          this.error = response.error
          return
      }
    },
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
    :page-title="pageTitle"
  >
    <b-message
      v-if="notFound"
      type="is-info"
    >
      Es wurde kein Artikel mit dieser GTIN gefunden.
    </b-message>

    <b-message
      v-if="error !== ''"
      type="is-danger"
    >
      Bei der Abfrage trat folgender Fehler auf:<br>
      {{ error }}
    </b-message>

    <form v-if="article === undefined">
      <b-field
        label="GTIN (EAN) *"
        class="mb-4"
      >
        <p class="control">
          <b-button
            icon-left="fullscreen"
            @click="openScanner"
          />
        </p>
        <b-input
          v-model="gtin"
          type="text"
          required
          expanded
        />
      </b-field>

      <b-button
        type="is-danger"
        outlined
        @click="back()"
      >
        Abbrechen
      </b-button>
      <b-button
        type="is-primary"
        native-type="submit"
        :loading="loading"
        @click="send($event)"
      >
        Senden
      </b-button>
    </form>

    <GtinScanner
      :is-active="scanner"
      @onScanCancel="onScanCancel"
      @onScanSuccess="onScanSuccess"
    />

    <ArticleForm
      v-if="article !== undefined"
      :article="article"
      @formSubmitted="addArticle"
    />
  </AppLayoutForm>
</template>
