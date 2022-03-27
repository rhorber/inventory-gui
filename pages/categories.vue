<script>
import { mapMutations, mapState } from 'vuex'

import BaseLayoutList from '~/components/BaseLayoutList'

export default {
  components: {
    BaseLayoutList,
  },

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

<template>
  <BaseLayoutList
    page-title="Kategorien"
  >
    <template #header>
      <b-button
        type="is-primary"
        tag="nuxt-link"
        to="/category/add"
      >
        Kategorie erstellen
      </b-button>
    </template>

    <template #default>
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
            type="is-primary"
            tag="nuxt-link"
            :to="'/category/edit/' + row.id"
            icon-right="edit"
          />
        </b-table-column>
      </b-table>
    </template>
  </BaseLayoutList>
</template>
