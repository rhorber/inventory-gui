<template>
  <b-form @submit="onSubmit">
    <b-form-group
      label="Name *"
      label-for="name"
    >
      <b-form-input
        id="name"
        v-model="dataCategory.name"
        type="text"
        required
      />
    </b-form-group>

    <nuxt-link to="/categories">
      <b-button variant="outline-danger">
        Abbrechen
      </b-button>
    </nuxt-link>
    <b-button
      variant="primary"
      type="submit"
    >
      Speichern
    </b-button>
  </b-form>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dataCategory: this.category
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$emit('formSubmitted', this.dataCategory);
    }
  }
}
</script>
