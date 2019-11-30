<template>
  <section class="container">
    <div>
      <h2>Kategorie erstellen</h2>
      <category-form
        :category="{name: ''}"
        @formSubmitted="addCategory"
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
  methods: {
    ...mapMutations(['resetCategories']),
    addCategory(data) {
      // TODO: Can that be combined with the saveCategory method in the edit page?
      const category = {
        name: data.name
      };

      this.$axios.$post('/v2/categories', category)
        .then(() => {
          this.resetCategories();
          this.$router.push({path: '/categories'});
        })
        .catch(console.error);
    }
  }
}
</script>
