<template>
  <section class="container">
    <div>
      <h2 class="subtitle">
        Edit Item {{ itemId }}
      </h2>
      <item-form
        :item="item"
        @formSubmitted="saveItem"
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
  validate({params}) {
    return /^\d+$/.test(params.id);
  },
  asyncData({app, params}) {
    return app.$axios.$get('/item/' + params.id)
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
    saveItem(data) {
      const item = {name: data.name, stock: data.stock, size: data.size, unit: data.unit};
      this.$axios.$put('/item/' + this.itemId, item)
        .then(() => this.$router.push({path: '/'}))
        .catch(console.error);
    }
  }
}
</script>
