<template>
  <section class="container">
    <div>
      <h2>Artikel bearbeiten ({{ itemId }})</h2>
      <item-form
        :item="item"
        @formSubmitted="saveItem"
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
  validate({params}) {
    return /^\d+$/.test(params.id);
  },
  asyncData({app, params}) {
    return app.$axios.$get('/v2/articles/' + params.id)
      .then((result) => {
        return {item: result}
      });
  },
  data() {
    return {
      itemId: this.$route.params.id
    };
  },
  methods: {
    ...mapMutations(['resetArticles']),
    saveItem(data) {
      // TODO: Can that be combined with the addItem method in the add page?
      const item = {
        category: 1,
        name: data.name,
        size: data.size,
        unit: data.unit,
        best_before: data.best_before,
        stock: data.stock
      };

      this.$axios.$put('/v2/articles/' + this.itemId, item)
        .then(() => {
          this.resetArticles();
          this.$router.push({path: '/'});
        })
        .catch(console.error);
    }
  }
}
</script>
