<script>
import { mapState } from 'vuex'

import TheLogo from './TheLogo'

export default {
  components: {
    TheLogo
  },
  computed: {
    ...mapState(['categories']),
    type() {
      if ($nuxt.isOnline) {
        return 'is-light';
      } else {
        return 'is-warning';
      }
    }
  },
  methods: {
    getIsActive(path) {
      return (path === this.$route.path);
    }
  }
}
</script>

<template>
  <b-navbar
    :type="type"
    fixed-top
  >
    <template #brand>
      <b-navbar-item
        tag="nuxt-link"
        to="/"
      >
        <TheLogo />
      </b-navbar-item>
    </template>

    <template #start>
      <b-navbar-item tag="div">
        <div class="columns is-align-items-baseline">
          <div class="column is-narrow">
            <span class="is-size-4">Inventar</span>
          </div>
          <div class="column is-hidden-mobile">
            <span class="has-text-grey is-size-5 is-size-6-touch">
              Kleine Hilfs-Applikation zum Verwalten des (Keller-) Inventars.
            </span>
          </div>
        </div>
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-dropdown
        label="Menu"
        right
      >
        <b-navbar-item
          tag="nuxt-link"
          to="/gtin"
          :active="getIsActive('/gtin')"
        >
          GTIN (EAN) eingeben
        </b-navbar-item>
        <hr class="navbar-divider">
        <b-navbar-item
          v-for="category in categories"
          :key="category.id"
          tag="nuxt-link"
          :to="'/category/' + category.id"
          :active="getIsActive('/category/' + category.id)"
        >
          {{ category.name }}
        </b-navbar-item>
        <hr class="navbar-divider">
        <b-navbar-item
          tag="nuxt-link"
          to="/"
          :active="getIsActive('/')"
        >
          Alle Artikel
        </b-navbar-item>
        <hr class="navbar-divider">
        <b-navbar-item
          v-show="$nuxt.isOnline"
          tag="nuxt-link"
          to="/categories"
          :active="getIsActive('/categories')"
          :prefetch="false"
        >
          Kategorien verwalten
        </b-navbar-item>
        <hr class="navbar-divider">
        <b-navbar-item
          v-show="$nuxt.isOnline"
          tag="nuxt-link"
          to="/inventory"
          :active="getIsActive('/inventory')"
          :prefetch="false"
        >
          Inventur
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>
