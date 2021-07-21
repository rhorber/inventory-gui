<template>
  <div>
    <p class="is-size-3">
      Kategorien
    </p>
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
      sort-icon="chevron-bottom"
    >
      <b-table-column
        v-slot="{ row }"
        field="name"
        label="Name"
        :td-attrs="vCenteredAttrs"
      >
        {{ row.name }}
      </b-table-column>

      <b-table-column
        v-slot="{ row, index }"
        custom-key="sorting"
      >
        <div>
          <b-button
            :class="{ 'is-invisible': index === highestCategoryIndex }"
            type="is-dark"
            outlined
            icon-right="chevron-bottom"
            @click="moveDown(row)"
          />
          <b-button
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
        <b-button
          type="is-info"
          tag="nuxt-link"
          :to="'/category/edit/' + row.id"
          icon-right="edit"
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
    vCenteredAttrs(_row, _column) {
      return {
        class: 'is-vcentered',
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
