import { defineNuxtConfig } from '@nuxt/bridge'
import pkg from './package'

const isProduction = (process.env.NODE_ENV === 'production');

if (isProduction === false) {
  require('dotenv').config();
}

export default defineNuxtConfig({
  ssr: false,

  vue: {
    config: {
      productionTip: false
    }
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#333399', height: '3px' },

  /*
  ** Customize the loading-indicator
  */
  loadingIndicator: { name: 'fading-circle', color: '#333399' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/buefy.scss',
    '~/assets/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    // Doc: https://buefy.org/documentation/
    '~/plugins/buefy'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    https: isProduction,
    debug: !isProduction
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
});
