import Vue from 'vue'
import Buefy from 'buefy'

import AppIcon from '~/components/AppIcon.vue'

// Doc: https://buefy.org/documentation/
Vue.use(Buefy, {
  defaultIconPack: 'bitesize',
  defaultIconComponent: AppIcon,
  defaultLocale: 'de-CH',
  defaultFirstDayOfWeek: 1,
  customIconPacks: {
    bitesize: {
      iconPrefix: 'i-',
      internalIcons: {
        'alert-circle': 'error',
        information: 'info'
      },
      sizes: {
        default: '',
        'is-small': 'is-small',
        'is-medium': 'is-medium',
        'is-large': 'is-large'
      }
    }
  }
})
