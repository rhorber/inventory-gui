<template>
  <section class="container">
    <div>
      <h2 class="subtitle">
        Artikel bearbeiten ({{ itemId }})
      </h2>
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
    return app.$axios.$get('/v1/item/' + params.id)
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
    ...mapMutations(['setItems']),
    saveItem(data) {
      const item = {
        name: data.name,
        size: data.size,
        unit: data.unit,
        best_before: data.best_before,
        stock: data.stock
      };

      this.$axios.$put('/v1/item/' + this.itemId, item)
        .then(() => {
          this.setItems(null);
          this.$router.push({path: '/'})
        })
        .catch(console.error);
    }
  }
}
</script>
