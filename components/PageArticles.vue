<template>
  <div>
    <p class="is-size-3">
      {{ pageTitle }}
    </p>
    <div class="columns py-4">
      <div class="column">
        <b-button
          type="is-info"
          tag="nuxt-link"
          :to="addArticleButtonLink"
        >
          Artikel erstellen
        </b-button>
      </div>
      <b-field class="column is-narrow">
        <b-checkbox
          type="is-info"
          :value="value"
          @input="onInput"
        >
          Artikel ohne Bestand ausblenden
        </b-checkbox>
      </b-field>
    </div>
    <article-table
      :articles="articles"
    />
    <div class="py-4">
      <b-button
        type="is-info"
        tag="nuxt-link"
        :to="addArticleButtonLink"
      >
        Artikel erstellen
      </b-button>
    </div>
  </div>
</template>

<script>
import ArticleTable from '~/components/ArticleTable'

export default {
  name: 'PageArticles',
  components: {
    ArticleTable
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
