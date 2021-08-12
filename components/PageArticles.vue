<template>
  <BaseLayoutList
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
      <article-table
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
  </BaseLayoutList>
</template>

<script>
import BaseLayoutList from '~/components/BaseLayoutList'
import ArticleTable from '~/components/ArticleTable'

export default {
  name: 'PageArticles',
  components: {
    ArticleTable,
    BaseLayoutList,
  },
  props: {
    pageTitle: {
      type: String,
      required: true,
    },
    articles: {
      type: Array,
      required: true
    },
    addArticleButtonLink: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped>

</style>
