<template>
  <div>
    <h2>Kategorien</h2>
    <div>
      <nuxt-link to="/category/add">
        <b-button
          variant="primary"
          class="mt-2 mb-3"
        >
          Kategorie erstellen
        </b-button>
      </nuxt-link>
    </div>
    <b-table
      :fields="tableFields"
      :items="categories"
      striped
      hover
    >
      <template
        slot="cell(sorting)"
        slot-scope="data"
      >
        <b-button
          :class="{ invisible: data.index === highestCategoryIndex }"
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
        <nuxt-link :to="'/category/edit/' + data.item.id">
          <b-button variant="primary">
            <i class="fa fa-edit" />
          </b-button>
        </nuxt-link>
      </template>
    </b-table>
    <div>
      <nuxt-link to="/category/add">
        <b-button
          variant="primary"
          class="mb-2"
        >
          Kategorie erstellen
        </b-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      tableFields: [
        {key: 'name', label: 'Name'},
        {key: 'sorting', label: ''},
        {key: 'actions', label: 'Aktionen'},
      ]
    };
  },

  computed: {
    ...mapState(['categories']),
    highestCategoryIndex() {
      return (this.categories.length - 1);
    }
  },

  methods: {
    ...mapMutations(['replaceCategory']),
    moveDown(category) {
      this.$axios.$put(`/v2/categories/${category.id}/move-down`)
        .then((result) => {
          this.replaceCategories(result.categories);
        })
        .catch(console.error);
    },
    moveUp(category) {
      this.$axios.$put(`/v2/categories/${category.id}/move-up`)
        .then((result) => {
          this.replaceCategories(result.categories);
        })
        .catch(console.error);
    },
    replaceCategories(categories) {
      categories.forEach(this.replaceCategory);
    }
  }
}
</script>
