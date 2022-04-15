<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'

import AppLayoutList from '~/components/AppLayoutList.vue'
import { Category } from '~/types/entities'
import { CategoryMoveResponse } from '~/types/api'
import { BTableColumn, HtmlAttrs } from '~/types/buefy'

export default Vue.extend({
  components: {
    AppLayoutList
  },

  computed: {
    ...mapState(['categories']),
    highestCategoryIndex(): number {
      return (this.categories.length - 1)
    }
  },

  methods: {
    ...mapMutations(['replaceCategory']),
    vCenteredAttrs(_row: Category, _column: BTableColumn): HtmlAttrs {
      return {
        class: 'is-vcentered'
      }
    },
    moveDown(category: Category): void {
      this.$axios.$put<CategoryMoveResponse>(`/v3/categories/${category.id}/move-down`)
        .then((result: CategoryMoveResponse): void => {
          this.replaceCategories(result.categories)
        })
        .catch(console.error)
    },
    moveUp(category: Category): void {
      this.$axios.$put<CategoryMoveResponse>(`/v3/categories/${category.id}/move-up`)
        .then((result: CategoryMoveResponse): void => {
          this.replaceCategories(result.categories)
        })
        .catch(console.error)
    },
    replaceCategories(categories: Category[]): void {
      categories.forEach(this.replaceCategory)
    }
  }
})
</script>

<template>
  <AppLayoutList
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
  </AppLayoutList>
</template>
