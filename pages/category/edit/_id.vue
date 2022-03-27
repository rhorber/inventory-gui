<script>
import { mapMutations } from 'vuex'

import AppLayoutForm from '~/components/AppLayoutForm'
import CategoryForm from '~/components/CategoryForm'

export default {
  components: {
    AppLayoutForm,
    CategoryForm,
  },
  validate({params}) {
    return /^\d+$/.test(params.id);
  },
  asyncData({app, params}) {
    return app.$axios.$get('/v3/categories/' + params.id)
      .then((result) => {
        return {category: result}
      });
  },
  data() {
    return {
      categoryId: this.$route.params.id
    };
  },
  methods: {
    ...mapMutations(['resetCategories']),
    saveCategory(data) {
      // TODO: Can that be combined with the addCategory method in the add page?
      const category = {
        name: data.name
      };

      this.$axios.$put('/v3/categories/' + this.categoryId, category)
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
  <AppLayoutForm
    :page-title="`Kategorie bearbeiten (${categoryId})`"
  >
    <CategoryForm
      :category="category"
      @formSubmitted="saveCategory"
    />
  </AppLayoutForm>
</template>
