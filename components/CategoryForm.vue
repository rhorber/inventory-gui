<script lang="ts">
import Vue, { PropType } from 'vue'

import { Category } from '~/types/entities'

export default Vue.extend({
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true
    }
  },
  data: function () {
    return {
      dataCategory: this.category
    }
  },
  methods: {
    back(): void {
      this.$router.go(-1)
    },
    submit(event: MouseEvent): void {
      event.preventDefault()
      this.$emit('formSubmitted', this.dataCategory)
    }
  }
})
</script>

<template>
  <form>
    <b-field
      label="Name *"
      class="mb-4"
    >
      <b-input
        v-model="dataCategory.name"
        type="text"
        required
      />
    </b-field>

    <b-button
      type="is-danger"
      outlined
      @click="back()"
    >
      Abbrechen
    </b-button>
    <b-button
      type="is-primary"
      native-type="submit"
      @click="submit($event)"
    >
      Speichern
    </b-button>
  </form>
</template>
