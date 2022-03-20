import { defineNuxtConfig } from '@nuxt/bridge'
import pkg from './package.json'

const isProduction = (process.env.NODE_ENV === 'production');

if (isProduction === false) {
  import('dotenv')
    .then(dotenv => dotenv.config());
}

export default defineNuxtConfig({
  // Temporarily disable bridge integration: https://v3.nuxtjs.org/getting-started/bridge/#ensure-everything-goes-well
  bridge: false,

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  vue: {
    config: {
      productionTip: false
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: pkg.name,
    htmlAttrs: {
      lang: 'de'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Customize the progress-bar color
  loading: { color: '#333399', height: '3px' },

  // Customize the loading-indicator
  loadingIndicator: { name: 'fading-circle', color: '#333399' },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/buefy.scss',
    '~/assets/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    // Doc: https://buefy.org/documentation/
    '~/plugins/buefy'
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    https: isProduction,
    debug: !isProduction
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
});
