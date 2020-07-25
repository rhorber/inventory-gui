<template>
  <b-navbar
    type="light"
    variant="light"
    sticky
  >
    <b-navbar-nav>
      <h4>
        Inventar
        <small class="text-muted d-none d-md-inline">
          Kleine Hilfs-Applikation zum Verwalten des (Keller-) Inventars.
        </small>
      </h4>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto pr-4">
      <b-nav-item-dropdown
        text="Menu"
        right
        size="lg"
      >
        <b-dropdown-item
          v-for="category in categories"
          :key="category.id"
          :to="'/category/' + category.id"
        >
          {{ category.name }}
        </b-dropdown-item>
        <b-dropdown-divider />

        <b-dropdown-item to="/">
          Alle Artikel
        </b-dropdown-item>
        <b-dropdown-divider />

        <b-dropdown-item
          :disabled="$nuxt.isOffline"
          to="/categories"
          no-prefetch
        >
          Kategorien verwalten
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>

    <b-navbar-brand href="#">
      <Logo />
    </b-navbar-brand>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'

import Logo from './Logo'

export default {
  components: {
    Logo
  },
  computed: {
    ...mapState(['categories'])
  }
}
</script>
