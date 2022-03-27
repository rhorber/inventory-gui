<script>
export default {
  name: 'BaseLayoutForm',
  props: {
    pageTitle: {
      type: String,
      required: true,
    },
  },
}
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
