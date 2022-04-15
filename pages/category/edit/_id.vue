<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { Context } from '@nuxt/types'

import AppLayoutForm from '~/components/AppLayoutForm.vue'
import CategoryForm from '~/components/CategoryForm.vue'
import { Category } from '~/types/entities'
import { EmptyResponse } from '~/types/api'

type AsyncData = {
  category: Category
}

export default Vue.extend({
  components: {
    AppLayoutForm,
    CategoryForm
  },
  validate: function ({ params }: Context): boolean {
    return /^\d+$/.test(params.id)
  },
  asyncData: function ({ app, params }: Context): Promise<AsyncData> {
    return app.$axios.$get<Category>('/v3/categories/' + params.id)
      .then((result: Category): AsyncData => {
        return { category: result }
      })
  },
  data: function () {
    return {
      categoryId: this.$route.params.id
    }
  },
  methods: {
    ...mapMutations(['resetCategories']),
    saveCategory(data: Category): void {
      // TODO: Can that be combined with the addCategory method in the add page?
      const category: Category = {
        name: data.name
      }

      this.$axios.$put<EmptyResponse>('/v3/categories/' + this.categoryId, category)
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
    :page-title="`Kategorie bearbeiten (${categoryId})`"
  >
    <CategoryForm
      :category="category"
      @formSubmitted="saveCategory"
    />
  </AppLayoutForm>
</template>
