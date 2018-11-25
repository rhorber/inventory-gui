<template>
  <section class="container">
    <div>
      <h2 class="subtitle">
        Add Item
      </h2>
      <item-form
        :item="{name: '', stock: 0}"
        @formSubmitted="addItem"
      />
    </div>
  </section>
</template>

<script>
import ItemForm from '~/components/ItemForm'

export default {
  components: {
    ItemForm
  },
  methods: {
    addItem(data){
      const item = {name: data.name, stock: data.stock};
      this.$axios.$post('/api/item', item)
        .then(() => this.$router.push({path: '/'}))
        .catch(console.error);
    }
  }
}
</script>
