<template>
  <span>
    <svg
      v-if="isKnownIcon"
      :class="size"
    >
      <use :xlink:href="'icons.svg#' + iconId" />
    </svg>
    <span v-else>N/A</span>
  </span>
</template>

<script>
export default {
  name: 'BaseIcon',

  props: {
    icon: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    iconPack() {
      return (this.icon === undefined) ? undefined : this.icon[0];
    },
    iconName() {
      return (this.icon === undefined) ? undefined : this.icon[1];
    },
    iconId() {
      if (this.iconPack === undefined || this.iconName === undefined) {
        return undefined;
      }
      if (this.iconPack !== 'bitesize') {
        return undefined;
      }
      return this.getIconId(this.iconName);
    },
    isKnownIcon() {
      return this.iconId !== undefined;
    }
  },

  methods: {
    getIconId(iconName) {
      const knownIcons = [
        'i-alert',
        'i-chevron-bottom',
        'i-chevron-left',
        'i-chevron-right',
        'i-chevron-top',
        'i-edit',
        'i-info',
        'i-minus',
        'i-plus',
        'i-trash',
      ];

      if (knownIcons.includes(iconName)) {
        return iconName;
      }
      return undefined;
    }
  }
}
</script>

<style scoped>
svg {
  stroke: currentColor;
  stroke-width: 2.5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  width: 24px;
  height: 24px;
  vertical-align: top;
}

svg.is-small {
  width: 16px;
  height: 16px;
}
svg.is-medium {
  width: 32px;
  height: 32px;
}
svg.is-large {
  width: 48px;
  height: 48px;
}
</style>
