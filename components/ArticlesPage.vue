<script lang="ts">
import Vue, { PropType } from 'vue'

import AppLayoutList from '~/components/AppLayoutList.vue'
import ArticleTable from '~/components/ArticleTable.vue'
import { Article } from '~/types/entities'

export default Vue.extend({
  name: 'ArticlesPage',
  components: {
    ArticleTable,
    AppLayoutList
  },
  props: {
    pageTitle: {
      type: String,
      required: true
    },
    articles: {
      type: Array as PropType<Article[]>,
      required: true
    },
    addArticleButtonLink: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onInput(value: InputEvent): void {
      this.$emit('input', value)
    }
  }
})
</script>

<template>
  <AppLayoutList
    :page-title="pageTitle"
  >
    <template #header>
      <div class="columns">
        <div class="column">
          <b-button
            type="is-primary"
            tag="nuxt-link"
            :to="addArticleButtonLink"
          >
            Artikel erstellen
          </b-button>
        </div>
        <b-field class="column is-narrow">
          <b-checkbox
            type="is-primary"
            :value="value"
            @input="onInput"
          >
            Artikel ohne Bestand ausblenden
          </b-checkbox>
        </b-field>
      </div>
    </template>

    <template #default>
      <ArticleTable
        :articles="articles"
      />
    </template>

    <template #footer>
      <b-button
        type="is-primary"
        tag="nuxt-link"
        :to="addArticleButtonLink"
      >
        Artikel erstellen
      </b-button>
    </template>
  </AppLayoutList>
</template>
