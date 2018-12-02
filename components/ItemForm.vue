<template>
  <b-form @submit="onSubmit">
    <b-form-group
      label="Name"
      label-for="name"
    >
      <b-form-input
        id="name"
        v-model="dataItem.name"
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
        v-model="dataItem.stock"
        type="number"
        required
      />
    </b-form-group>

    <b-form-group
      label="Grösse"
      label-for="size"
    >
      <b-form-input
        id="size"
        v-model="dataItem.size"
        type="text"
        required
      />
    </b-form-group>

    <b-form-group
      label="Einheit"
      label-for="unit"
    >
      <div>
        <b-form-select
          v-model="dataItem.unit"
          :options="units"
        />
      </div>
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
    item: {
      type: Object,
      default: function () {
        return {name: '', stock: 0, size: 0, unit: 'Stk'};
      }
    }
  },
  data() {
    return {
      dataItem: this.item,
      units: ['', 'cl', 'g', 'kg', 'l', 'ml', 'Rolle', 'Stk']
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$emit('formSubmitted', this.dataItem);
    }
  }
}
</script>

<style scoped>

</style>
