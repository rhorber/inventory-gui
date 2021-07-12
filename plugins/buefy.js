import Vue from 'vue';
import Buefy from 'buefy';
import BaseIcon from "../components/BaseIcon";

// Doc: https://buefy.org/documentation/
Vue.use(Buefy, {
    defaultIconPack: 'bitesize',
    defaultIconComponent: BaseIcon,
    defaultLocale: 'de-CH',
    defaultFirstDayOfWeek: 1
  }
);
