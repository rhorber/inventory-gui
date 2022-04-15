<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'

import AppLayoutForm from '~/components/AppLayoutForm.vue'
import CategoryForm from '~/components/CategoryForm.vue'
import { Category } from '~/types/entities'
import { EmptyResponse } from '~/types/api'

export default Vue.extend({
  components: {
    AppLayoutForm,
    CategoryForm
  },
  methods: {
    ...mapMutations(['resetCategories']),
    addCategory(data: Category): void {
      // TODO: Can that be combined with the saveCategory method in the edit page?
      const category: Category = {
        name: data.name
      }

      this.$axios.$post<EmptyResponse>('/v3/categories', category)
        .then((): void => {
          this.resetCategories()
          this.$router.push({ path: '/categories' })
        })
        .catch(console.error)
    }
  }
})
</script>

<template>
  <AppLayoutForm
    page-title="Kategorie erstellen"
  >
    <category-form
      :category="{ name: '' }"
      @formSubmitted="addCategory"
    />
  </AppLayoutForm>
</template>
