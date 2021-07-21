<template>
  <b-table
    :data="articles"
    striped
    hoverable
    sort-icon="chevron-bottom"
  >

    <b-table-column
      v-slot="data"
      field="name"
      label="Name"
    >
      {{ data.row.name }}
      <span
        v-if="hasBestBefore(data.row)"
        class="is-hidden-desktop"
      >
        ({{ data.row.lots[0].best_before }})
      </span>
    </b-table-column>

    <b-table-column
      v-slot="data"
      field="size"
      label="Grösse"
    >
      <span v-if="data.row.unit !== 'N/A'">
        {{ data.row.size + '&nbsp;' + data.row.unit }}
      </span>
    </b-table-column>

    <b-table-column
      v-slot="articleData"
      field="lots"
      label="Charge(n)"
    >
      <b-table
        v-if="hasLots(articleData.row)"
        :data="articleData.row.lots"
        :default-sort="['position', 'asc']"
        striped
        hoverable
        narrowed
      >
        <b-table-column
          v-slot="lotData"
          field="best_before"
          :th-attrs="hiddenAttrs"
          :td-attrs="bestBeforeColumnAttrs"
        >
          {{ lotData.row.best_before }}
        </b-table-column>
        <b-table-column
          v-slot="lotData"
          field="stock"
          :th-attrs="hiddenAttrs"
          :td-attrs="stockColumnAttrs"
        >
          <b-button
            v-if="$nuxt.isOnline"
            type="is-dark"
            outlined
            icon-right="minus"
            @click="decreaseStock(lotData.row)"
          />
          <span class="amount">{{ lotData.row.stock }}</span>
          <b-button
            v-if="$nuxt.isOnline"
            type="is-dark"
            outlined
            icon-right="plus"
            @click="increaseStock(lotData.row)"
          />
        </b-table-column>
      </b-table>
    </b-table-column>

    <b-table-column
      v-slot="data"
      custom-key="sorting"
      :td-attrs="sortingColumnAttrs"
    >
      <div>
        <b-button
          v-if="$nuxt.isOnline"
          :class="{ 'is-invisible': data.index === highestArticleIndex }"
          type="is-dark"
          outlined
          icon-right="chevron-bottom"
          @click="moveDown(data.row)"
        />
        <b-button
          v-if="$nuxt.isOnline"
          :class="{ 'is-invisible': data.index === 0 }"
          type="is-dark"
          outlined
          icon-right="chevron-top"
          @click="moveUp(data.row)"
        />
      </div>
    </b-table-column>

    <b-table-column
      v-slot="data"
      custom-key="actions"
      label="Aktionen"
    >
      <div>
        <b-button
          type="is-info"
          tag="nuxt-link"
          :to="'/article/edit/' + data.row.id"
          icon-right="edit"
        />
        <b-button
          type="is-danger"
          icon-right="trash"
          @click="resetArticle(data.row)"
        />
      </div>
    </b-table-column>

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

  computed: {
    highestArticleIndex() {
      return (this.articles.length - 1);
    }
  },

  methods: {
    ...mapMutations(['replaceArticle', 'replaceLot']),
    ...mapActions(['addToSyncQueue']),
    hiddenAttrs(_row, _column) {
      return {
        class: 'is-hidden',
      };
    },
    sortingColumnAttrs(_row, _column) {
      return {
        class: 'is-hidden-mobile',
      };
    },
    bestBeforeColumnAttrs(_row, _column) {
      return {
        class: ['is-hidden-touch', 'is-vcentered', 'has-text-right'],
        style: {'white-space': 'nowrap'},
      };
    },
    stockColumnAttrs(_row, _column) {
      return {
        style: {'width': '150px'},
      };
    },
    hasLots(article) {
      return (article.hasOwnProperty('lots')
        && article.lots.length > 0
      );
    },
    hasBestBefore(article) {
      return (this.hasLots(article)
        && article.lots[0].best_before !== ''
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
        newArticle.lots = [];
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
  vertical-align: middle;
  text-align: center;
}
</style>
