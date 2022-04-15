<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'

import { Article, Lot } from '~/types/entities'
import { ArticlesMoveResponse } from '~/types/api'
import { BTableColumn, HtmlAttrs } from '~/types/buefy'

export default Vue.extend({
  props: {
    articles: {
      type: Array as PropType<Article[]>,
      required: true
    }
  },

  computed: {
    ...mapState(['isInventoryActive']),
    highestArticleIndex(): number {
      return (this.articles.length - 1)
    }
  },

  methods: {
    ...mapMutations(['replaceArticle', 'replaceLot']),
    ...mapActions(['addToSyncQueue']),
    hiddenAttrs(_column: BTableColumn): HtmlAttrs {
      return {
        class: 'is-hidden'
      }
    },
    getLotRowClass(articleIndex: number, lotIndex: number): string {
      if (articleIndex % 2 === 0) {
        return ''
      }
      if (lotIndex % 2 === 0) {
        return 'lot-is-striped-even'
      } else {
        return 'lot-is-striped-odd'
      }
    },
    bestBeforeColumnAttrs(_row: Lot, _column: BTableColumn): HtmlAttrs {
      return {
        class: ['is-hidden-touch', 'is-vcentered', 'has-text-right'],
        style: { 'white-space': 'nowrap' }
      }
    },
    stockColumnAttrs(_row: Lot, _column: BTableColumn): HtmlAttrs {
      return {
        style: { width: '150px' }
      }
    },
    getNameClasses(row: Article): string[] {
      let classes: string[] = []

      if (this.isInventoryActive) {
        const statusClass = (row.inventoried === 1) ? 'is-success' : 'is-danger'

        classes = ['tag', statusClass, 'is-medium', 'custom-height', 'px-2']
      }

      return classes
    },
    hasLots(article: Article): boolean {
      return (Object.prototype.hasOwnProperty.call(article, 'lots')
        && article.lots.length > 0
      )
    },
    hasBestBefore(article: Article): boolean {
      return (this.hasLots(article)
        && article.lots[0].best_before !== ''
      )
    },
    decreaseStock(lot: Lot): void {
      this.$axios.$put<Lot>(`/v3/lots/${lot.id}/decrement`)
        .then(this.replaceLot)
        .catch(console.error)
    },
    increaseStock(lot: Lot): void {
      this.$axios.$put<Lot>(`/v3/lots/${lot.id}/increment`)
        .then(this.replaceLot)
        .catch(console.error)
    },
    moveDown(article: Article): void {
      this.$axios.$put<ArticlesMoveResponse>(`/v3/articles/${article.id}/move-down`)
        .then((result: ArticlesMoveResponse): void => {
          this.replaceArticles(result.articles)
        })
        .catch(console.error)
    },
    moveUp(article: Article): void {
      this.$axios.$put<ArticlesMoveResponse>(`/v3/articles/${article.id}/move-up`)
        .then((result: ArticlesMoveResponse): void => {
          this.replaceArticles(result.articles)
        })
        .catch(console.error)
    },
    resetArticle(article: Article): void {
      const url = `/v3/articles/${article.id}/reset`
      if (this.$nuxt.isOnline) {
        this.$axios.$put<Article>(url)
          .then(this.replaceArticle)
          .catch(console.error)
      } else {
        this.addToSyncQueue({ method: 'put', url: url, payload: {} })
        const newArticle = Object.assign({}, article)
        newArticle.lots = []
        this.replaceArticle(newArticle)
      }
    },
    replaceArticles(articles: Article[]): void {
      articles.forEach(this.replaceArticle)
    }
  }
})
</script>

<template>
  <div class="article-table">
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
        <span
          :id="'article-' + row.id"
          class="article-anchor"
        />
        <div>
          <p :class="getNameClasses(row)">
            {{ row.name }}
          </p>
          <p
            v-if="hasBestBefore(row)"
            class="is-hidden-desktop"
          >
            ({{ row.lots[0].best_before }})
          </p>
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
        v-slot="{ row: articleRow, index }"
        field="lots"
        label="Charge(n)"
      >
        <b-table
          v-if="hasLots(articleRow)"
          :data="articleRow.lots"
          :default-sort="['position', 'asc']"
          hoverable
          narrowed
          :row-class="(_row, lotIndex) => getLotRowClass(index, lotIndex)"
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

    <span
      id="bottom"
      class="article-anchor"
      style="visibility: hidden;"
    />
  </div>
</template>

<style>
.article-table .amount {
  display: inline-block;
  min-width: 2.5rem;
  text-align: center;
}

.article-table p.tag.custom-height {
  height: 1.5rem;
}

.article-table span.article-anchor {
  display: block;
  visibility: hidden;
  margin-top: -5rem;
  padding-top: 5rem;
}

.article-table .lot-is-striped-even {
  background-color: #fafafa !important;
}

.article-table .lot-is-striped-even:hover {
  background-color: #f5f5f5 !important;
}

.article-table .lot-is-striped-odd {
  background-color: #ffffff !important;
}

.article-table .lot-is-striped-odd:hover {
  background-color: #fafafa !important;
}
</style>
