<script lang="ts">
import Vue, { PropType } from 'vue'

type ReturnType = string | undefined

export default Vue.extend({
  name: 'AppIcon',

  props: {
    icon: {
      type: Array as PropType<string[]>,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    iconIsArray(): boolean {
      return (Array.isArray(this.icon))
    },
    iconPack(): ReturnType {
      return (this.iconIsArray && this.icon.length >= 1)
        ? this.icon[0]
        : undefined
    },
    iconName(): ReturnType {
      return (this.iconIsArray && this.icon.length >= 2)
        ? this.icon[1]
        : undefined
    },
    iconId(): ReturnType {
      if (this.iconPack !== 'bitesize' || this.iconName === undefined) {
        return undefined
      }
      return this.getIconId(this.iconName)
    },
    isKnownIcon(): boolean {
      return this.iconId !== undefined
    }
  },

  methods: {
    getIconId(iconName: string): ReturnType {
      const knownIcons = [
        'i-alert',
        'i-arrow-bottom',
        'i-arrow-left',
        'i-arrow-right',
        'i-arrow-top',
        'i-calendar',
        'i-chevron-bottom',
        'i-chevron-left',
        'i-chevron-right',
        'i-chevron-top',
        'i-edit',
        'i-error',
        'i-fullscreen',
        'i-info',
        'i-minus',
        'i-plus',
        'i-trash'
      ]

      if (knownIcons.includes(iconName)) {
        return iconName
      }
      return undefined
    }
  }
})
</script>

<template>
  <span :class="size">
    <svg
      v-if="isKnownIcon"
      :class="size"
    >
      <use :xlink:href="'/icons.svg#' + iconId" />
    </svg>
    <span v-else>N/A</span>
  </span>
</template>

<style scoped>
svg {
  stroke: currentColor;
  stroke-width: 2.5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  vertical-align: top;
}

span,
svg {
  width: 24px;
  height: 24px;
}
span.is-small,
svg.is-small {
  width: 16px;
  height: 16px;
}
span.is-medium,
svg.is-medium {
  width: 32px;
  height: 32px;
}
span.is-large,
svg.is-large {
  width: 48px;
  height: 48px;
}
</style>
