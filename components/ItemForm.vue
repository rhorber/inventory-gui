<template>
  <b-form @submit="onSubmit">
    <b-form-group
      label="Name"
      label-for="name"
    >
      <b-form-input
        id="name"
        v-model="item.name"
        type="text"
        required
      />
    </b-form-group>

    <b-form-group
      label="Anzahl"
      label-for="stock"
    >
      <b-form-input
        id="stock"
        v-model="item.stock"
        type="number"
        required
      />
    </b-form-group>

    <nuxt-link to="/">
      <b-button variant="outline-danger">
        Cancel
      </b-button>
    </nuxt-link>
    <b-button
      variant="primary"
      type="submit"
    >
      Save
    </b-button>
  </b-form>
</template>

<script>
export default {
  props: {
    initialItem: {
      type: Object,
      default: function () {
        return {name: '', stock: 0};
      }
    }
  },
  data() {
    return {
      item: this.initialItem
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$emit('formSubmitted', this.item);
    }
  }
}
</script>

<style scoped>

</style>
