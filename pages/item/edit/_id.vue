<template>
  <section class="container">
    <div>
      <h2 class="subtitle">
        Edit Item {{ itemId }}
      </h2>
      <item-form
        item="{name: '', stock: 0}"
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
  data() {
    return {
      itemId: this.$route.params.id
    };
  },
  methods: {
    saveItem(data) {
      const item = {name: data.name, stock: data.stock};
      console.log(item);
      this.$router.push({path: '/'});
    }
  }
}
</script>
