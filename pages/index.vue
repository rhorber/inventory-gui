<template>
  <div>
    <h2>{{ pageTitle }}</h2>
    <div>
      <nuxt-link to="/article/add">
        <b-button
          variant="primary"
          class="mt-2 mb-3"
        >
          Artikel erstellen
        </b-button>
      </nuxt-link>
    </div>
    <b-table
      :fields="tableFields"
      :items="sortedArticles"
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
          v-if="data.item.best_before !== ''"
          class="d-inline d-lg-none"
        >
          ({{ data.item.best_before }})
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
        slot="cell(stock)"
        slot-scope="data"
      >
        <b-button
          variant="outline-secondary"
          @click="decreaseStock(data.item)"
        >
          <i class="fa fa-minus" />
        </b-button>
        <span class="amount">{{ data.value }}</span>
        <b-button
          variant="outline-secondary"
          @click="increaseStock(data.item)"
        >
          <i class="fa fa-plus" />
        </b-button>
      </template>
      <template
        slot="cell(sorting)"
        slot-scope="data"
      >
        <b-button
          :class="{ invisible: data.index === highestArticleIndex }"
          variant="outline-secondary"
          @click="moveDown(data.item)"
        >
          <i class="fa fa-angle-down" />
        </b-button>
        <b-button
          v-if="data.index > 0"
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
    <div>
      <nuxt-link to="/article/add">
        <b-button
          variant="primary"
          class="mb-2"
        >
          Artikel erstellen
        </b-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      tableFields: [
        {key: 'name', label: 'Name'},
        {key: 'size', label: 'Grösse'},
        {key: 'best_before', label: 'MHD', class: ['d-none', 'd-lg-table-cell']},
        {key: 'stock', label: 'Anzahl'},
        {key: 'sorting', label: '', class: ['d-none', 'd-sm-table-cell']},
        {key: 'actions', label: 'Aktionen'},
      ]
    };
  },

  computed: {
    ...mapState(['articles']),
    ...mapGetters(['categoriesMap']),
    selectedCategory() {
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'category')) {
        return this.categoriesMap[(this.$route.query.category)];
      } else {
        return null;
      }
    },
    pageTitle() {
      if (this.selectedCategory === null) {
        return 'Alle Artikel';
      } else {
        return 'Artikel: ' + this.selectedCategory.name;
      }
    },
    filteredArticles() {
      if (this.selectedCategory === null) {
        return this.articles;
      } else {
        return this.articles.filter(
          (article) => article.category === this.selectedCategory.id
        );
      }
    },
    sortedArticles() {
      return [...this.filteredArticles].sort(
        (article1, article2) => {
          if (article1.category === article2.category) {
            return (article1.position - article2.position);
          } else {
            let category1 = this.categoriesMap[article1.category];
            let category2 = this.categoriesMap[article2.category];

            return (category1.position - category2.position);
          }
        }
      );
    },
    highestArticleIndex() {
      return (this.filteredArticles.length - 1);
    }
  },

  methods: {
    ...mapMutations(['replaceArticle']),
    decreaseStock(article) {
      this.$axios.$put(`/v2/articles/${article.id}/decrement`)
        .then(this.replaceArticle)
        .catch(console.error);
    },
    increaseStock(article) {
      this.$axios.$put(`/v2/articles/${article.id}/increment`)
        .then(this.replaceArticle)
        .catch(console.error);
    },
    moveDown(article) {
      this.$axios.$put(`/v2/articles/${article.id}/move-down`)
        .then((result) => {
          this.replaceArticles(result.articles);
        })
        .catch(console.error);
    },
    moveUp(article) {
      this.$axios.$put(`/v2/articles/${article.id}/move-up`)
        .then((result) => {
          this.replaceArticles(result.articles);
        })
        .catch(console.error);
    },
    resetArticle(article) {
      this.$axios.$put(`/v2/articles/${article.id}/reset`)
        .then(this.replaceArticle)
        .catch(console.error);
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
