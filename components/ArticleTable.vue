<template>
  <b-table
    :data="articles"
    striped
    hoverable
    sort-icon="chevron-bottom"
  >
    <b-table-column
      v-slot="{ row }"
      field="name"
      label="Name"
    >
      <div class="columns is-multiline p-3">
        <span :class="getNameClasses(row)">
          {{ row.name }}
        </span>
        <span
          v-if="hasBestBefore(row)"
          class="column p-0 is-hidden-desktop"
        >
          ({{ row.lots[0].best_before }})
        </span>
      </div>
    </b-table-column>

    <b-table-column
      v-slot="{ row }"
      field="size"
      label="Grösse"
    >
      <span v-if="row.unit !== 'N/A'">
        {{ row.size + '&nbsp;' + row.unit }}
      </span>
    </b-table-column>

    <b-table-column
      v-slot="{ row: articleRow}"
      field="lots"
      label="Charge(n)"
    >
      <b-table
        v-if="hasLots(articleRow)"
        :data="articleRow.lots"
        :default-sort="['position', 'asc']"
        striped
        hoverable
        narrowed
      >
        <b-table-column
          v-slot="{ row: lotRow }"
          field="best_before"
          :th-attrs="hiddenAttrs"
          :td-attrs="bestBeforeColumnAttrs"
        >
          {{ lotRow.best_before }}
        </b-table-column>
        <b-table-column
          v-slot="{ row: lotRow }"
          field="stock"
          :th-attrs="hiddenAttrs"
          :td-attrs="stockColumnAttrs"
        >
          <b-button
            v-if="$nuxt.isOnline"
            type="is-dark"
            outlined
            icon-right="minus"
            @click="decreaseStock(lotRow)"
          />
          <span class="amount mt-2">
            {{ lotRow.stock }}
          </span>
          <b-button
            v-if="$nuxt.isOnline"
            type="is-dark"
            outlined
            icon-right="plus"
            @click="increaseStock(lotRow)"
          />
        </b-table-column>
      </b-table>
    </b-table-column>

    <b-table-column
      v-slot="{ row, index }"
      custom-key="sorting"
    >
      <div>
        <b-button
          v-if="$nuxt.isOnline"
          :class="{ 'is-invisible': index === highestArticleIndex }"
          type="is-dark"
          outlined
          icon-right="chevron-bottom"
          @click="moveDown(row)"
        />
        <b-button
          v-if="$nuxt.isOnline"
          :class="{ 'is-invisible': index === 0 }"
          type="is-dark"
          outlined
          icon-right="chevron-top"
          @click="moveUp(row)"
        />
      </div>
    </b-table-column>

    <b-table-column
      v-slot="{ row }"
      custom-key="actions"
      label="Aktionen"
    >
      <div>
        <b-button
          type="is-primary"
          tag="nuxt-link"
          :to="'/article/edit/' + row.id"
          icon-right="edit"
        />
        <b-button
          type="is-danger"
          icon-right="trash"
          @click="resetArticle(row)"
        />
      </div>
    </b-table-column>
  </b-table>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  props: {
    articles: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapState(['isInventoryActive']),
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
    getNameClasses(row) {
      let classes = [];

      if (this.isInventoryActive) {
        let statusClass = (parseInt(row.inventoried, 10) === 1) ? 'is-success' : 'is-danger';

        classes = ['tag', statusClass, 'is-medium', 'is-justify-content-left', 'pl-2'];
      }

      classes.push('column');
      classes.push('p-0');
      return classes;
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
  text-align: center;
}
</style>
