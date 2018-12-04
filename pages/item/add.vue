<template>
  <section class="container">
    <div>
      <h2 class="subtitle">
        Add Item
      </h2>
      <item-form
        :item="{name: '', stock: 0, size: 0, unit: 'Stk'}"
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
      const item = {name: data.name, stock: data.stock, size: data.size, unit: data.unit};
      this.$axios.$post('/item', item)
        .then(() => this.$router.push({path: '/'}))
        .catch(console.error);
    }
  }
}
</script>
