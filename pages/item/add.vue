<template>
  <section class="container">
    <div>
      <h2 class="subtitle">
        Artikel hinzufügen
      </h2>
      <item-form
        :item="{name: '', size: '', unit: '', best_before: '', stock: 0}"
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
  methods: {
    ...mapMutations(['setItems']),
    addItem(data){
      const item = {
        name: data.name,
        size: data.size,
        unit: data.unit,
        best_before: data.best_before,
        stock: data.stock
      };

      this.$axios.$post('/v1/item', item)
        .then(() => {
          this.setItems(null);
          this.$router.push({path: '/'})
        })
        .catch(console.error);
    }
  }
}
</script>
