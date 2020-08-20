<template>
  <b-table
    :fields="articlesTableFields"
    :items="articles"
    striped
    hover
  >
    <template
      slot="cell(name)"
      slot-scope="data"
    >
      {{ data.item.name }}
      <br class="d-inline d-md-none">
      <span
        v-if="hasBestBefore(data.item)"
        class="d-inline d-lg-none"
      >
        ({{ data.item.lots[0].best_before }})
      </span>
    </template>
    <template
      slot="cell(size)"
      slot-scope="data"
    >
      <span v-if="data.item.unit !== 'N/A'">
        {{ data.item.size + '&nbsp;' + data.item.unit }}
      </span>
    </template>
    <template
      slot="cell(lots)"
      slot-scope="articleData"
    >
      <b-table
        :fields="lotsTableFields"
        :items="articleData.item.lots"
        sort-by="position"
        small
        thead-class="d-none"
        striped
        hover
      >
        <template
          slot="cell(best_before)"
          slot-scope="lotData"
        >
          <span class="text-nowrap">
            {{ lotData.item.best_before }}
          </span>
        </template>
        <template
          slot="cell(stock)"
          slot-scope="lotData"
        >
          <b-button
            v-if="$nuxt.isOnline"
            variant="outline-secondary"
            @click="decreaseStock(lotData.item)"
          >
            <i class="fa fa-minus" />
          </b-button>
          <span class="amount">{{ lotData.value }}</span>
          <b-button
            v-if="$nuxt.isOnline"
            variant="outline-secondary"
            @click="increaseStock(lotData.item)"
          >
            <i class="fa fa-plus" />
          </b-button>
        </template>
      </b-table>
    </template>
    <template
      slot="cell(sorting)"
      slot-scope="data"
    >
      <b-button
        v-if="$nuxt.isOnline"
        :class="{ invisible: data.index === highestArticleIndex }"
        variant="outline-secondary"
        @click="moveDown(data.item)"
      >
        <i class="fa fa-angle-down" />
      </b-button>
      <b-button
        v-if="$nuxt.isOnline && data.index > 0"
        variant="outline-secondary"
        @click="moveUp(data.item)"
      >
        <i class="fa fa-angle-up" />
      </b-button>
    </template>
    <template
      slot="cell(actions)"
      slot-scope="data"
    >
      <nuxt-link :to="'/article/edit/' + data.item.id">
        <b-button variant="primary">
          <i class="fa fa-edit" />
        </b-button>
      </nuxt-link>
      <b-button
        variant="danger"
        @click="resetArticle(data.item)"
      >
        <i class="fa fa-trash-o" />
      </b-button>
    </template>
  </b-table>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  props: {
    articles: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      articlesTableFields: [
        {key: 'name', label: 'Name'},
        {key: 'size', label: 'Grösse'},
        {key: 'lots', label: 'Charge(n)'},
        {key: 'sorting', label: '', class: ['d-none', 'd-sm-table-cell']},
        {key: 'actions', label: 'Aktionen'},
      ],
      lotsTableFields: [
        {key: 'best_before', label: 'MHD', class: ['d-none', 'd-lg-table-cell']},
        {key: 'stock', label: 'Anzahl', tdAttr: {style: 'width: 140px'}},
      ]
    };
  },

  computed: {
    highestArticleIndex() {
      return (this.articles.length - 1);
    }
  },

  methods: {
    ...mapMutations(['replaceArticle', 'replaceLot']),
    ...mapActions(['addToSyncQueue']),
    hasBestBefore(article) {
      return (article.hasOwnProperty('lots')
        && article.lots.length > 0
        && article.lots[0].best_before !== null
      );
    },
    decreaseStock(lot) {
      this.$axios.$put(`/v3/lots/${lot.id}/decrement`)
        .then(this.replaceLot)
        .catch(console.error);
    },
    increaseStock(lot) {
      this.$axios.$put(`/v3/lots/${lot.id}/increment`)
        .then(this.replaceLot)
        .catch(console.error);
    },
    moveDown(article) {
      this.$axios.$put(`/v3/articles/${article.id}/move-down`)
        .then((result) => {
          this.replaceArticles(result.articles);
        })
        .catch(console.error);
    },
    moveUp(article) {
      this.$axios.$put(`/v3/articles/${article.id}/move-up`)
        .then((result) => {
          this.replaceArticles(result.articles);
        })
        .catch(console.error);
    },
    resetArticle(article) {
      const url = `/v3/articles/${article.id}/reset`;
      if ($nuxt.isOnline) {
        this.$axios.$put(url)
          .then(this.replaceArticle)
          .catch(console.error);
      } else {
        this.addToSyncQueue({method: 'put', url: url, payload: {}});
        let newArticle = Object.assign({}, article);
        newArticle.stock = 0;
        newArticle.best_before = '';
        this.replaceArticle(newArticle);
      }
    },
    replaceArticles(articles) {
      articles.forEach(this.replaceArticle);
    }
  }
}
</script>

<style scoped>
.amount {
  display: inline-block;
  min-width: 2.5rem;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
