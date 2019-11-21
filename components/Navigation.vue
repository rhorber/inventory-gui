<template>
  <b-navbar
    toggleable="md"
    type="dark"
    variant="light"
  >
    <b-navbar-nav>
      <h4>
        Inventar
        <small class="text-muted d-none d-md-inline">
          Kleine Hilfs-Applikation zum Verwalten des (Keller-) Inventars.
        </small>
      </h4>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-navbar-brand href="#">
        <Logo />
      </b-navbar-brand>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import Logo from './Logo'

export default {
  components: {
    Logo
  }
}
</script>
