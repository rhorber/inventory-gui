<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppLayoutForm',
  props: {
    pageTitle: {
      type: String,
      required: true
    }
  }
})
</script>

<template>
  <section class="container">
    <p class="is-size-3 mb-2">
      {{ pageTitle }}
    </p>
    <div>
      <slot name="default" />
    </div>
  </section>
</template>
