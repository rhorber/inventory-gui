<template>
  <div>
    <p class="is-size-3">Kategorien</p>
    <div class="py-4">
      <b-button
        type="is-info"
        tag="nuxt-link"
        to="/category/add"
      >
        Kategorie erstellen
      </b-button>
    </div>
    <b-table
      :data="categories"
      striped
      hoverable
    >

      <b-table-column
        field="name"
        label="Name"
        v-slot="data"
        :td-attrs="vCenteredTdAttrs"
      >
        {{ data.row.name }}
      </b-table-column>

      <b-table-column
        field="sorting"
        v-slot="data"
      >
        <b-button
          :class="{ 'is-invisible': data.index === highestCategoryIndex }"
          type="is-dark"
          outlined
          icon-right="chevron-bottom"
          class="pt-4"
          @click="moveDown(data.row)"
        />
        <b-button
          v-if="data.index > 0"
          type="is-dark"
          outlined
          icon-right="chevron-top"
          class="pt-4"
          @click="moveUp(data.row)"
        />
      </b-table-column>

      <b-table-column
        field="actions"
        label="Aktionen"
        v-slot="data"
      >
        <b-button
          type="is-info"
          tag="nuxt-link"
          :to="'/category/edit/' + data.row.id"
          icon-right="edit"
          class="pt-4"
        />
      </b-table-column>

    </b-table>
    <div class="py-4">
      <b-button
        type="is-info"
        tag="nuxt-link"
        to="/category/add"
      >
        Kategorie erstellen
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['categories']),
    highestCategoryIndex() {
      return (this.categories.length - 1);
    }
  },

  methods: {
    ...mapMutations(['replaceCategory']),
    vCenteredTdAttrs(_row, _column) {
      return {
        class: 'is-vcentered'
      };
    },
    moveDown(category) {
      this.$axios.$put(`/v3/categories/${category.id}/move-down`)
        .then((result) => {
          this.replaceCategories(result.categories);
        })
        .catch(console.error);
    },
    moveUp(category) {
      this.$axios.$put(`/v3/categories/${category.id}/move-up`)
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
