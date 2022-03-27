<script>
export default {
  name: 'AppLayoutList',
  props: {
    pageTitle: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <div>
    <p class="is-size-3">
      {{ pageTitle }}
    </p>
    <div class="py-4">
      <slot name="header" />
    </div>
    <div>
      <slot name="default" />
    </div>
    <div class="py-4">
      <template v-if="$scopedSlots.footer">
        <slot name="footer" />
      </template>
      <template v-else>
        <slot name="header" />
      </template>
    </div>
  </div>
</template>
