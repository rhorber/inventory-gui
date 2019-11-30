<template>
  <section class="container">
    <div>
      <h2>Artikel erstellen</h2>
      <item-form
        :item="emptyItem"
        @formSubmitted="addItem"
      />
    </div>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'

import ItemForm from '~/components/ItemForm'

export default {
  components: {
    ItemForm
  },

  data() {
    return {
      emptyItem: {
        category: 0,
        name: '',
        size: '',
        unit: '',
        best_before: '',
        stock: 0
      }
    };
  },

  methods: {
    ...mapMutations(['resetArticles']),
    addItem(data) {
      // TODO: Can that be combined with the saveItem method in the edit page?
      const item = {
        category: 1,
        name: data.name,
        size: data.size,
        unit: data.unit,
        best_before: data.best_before,
        stock: data.stock
      };

      this.$axios.$post('/v2/articles', item)
        .then(() => {
          this.resetArticles();
          this.$router.push({path: '/'});
        })
        .catch(console.error);
    }
  }
}
</script>
