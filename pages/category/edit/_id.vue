<template>
  <section class="container">
    <div>
      <h2>Kategorie bearbeiten ({{ categoryId }})</h2>
      <category-form
        :category="category"
        @formSubmitted="saveCategory"
      />
    </div>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'

import CategoryForm from '~/components/CategoryForm'

export default {
  components: {
    CategoryForm
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
