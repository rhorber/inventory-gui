<script>
import { mapMutations } from 'vuex'

import BaseLayoutForm from '~/components/BaseLayoutForm'
import CategoryForm from '~/components/CategoryForm'

export default {
  components: {
    BaseLayoutForm,
    CategoryForm,
  },
  methods: {
    ...mapMutations(['resetCategories']),
    addCategory(data) {
      // TODO: Can that be combined with the saveCategory method in the edit page?
      const category = {
        name: data.name
      };

      this.$axios.$post('/v3/categories', category)
        .then(() => {
          this.resetCategories();
          this.$router.push({path: '/categories'});
        })
        .catch(console.error);
    }
  }
}
</script>

<template>
  <BaseLayoutForm
    page-title="Kategorie erstellen"
  >
    <category-form
      :category="{name: ''}"
      @formSubmitted="addCategory"
    />
  </BaseLayoutForm>
</template>
