<template>
  <b-navbar
    toggleable="md"
    type="dark"
    variant="light"
  >
    <b-navbar-nav>
      <h4>
        Inventory
        <small class="text-muted">
          Little helper application to manage (cellar) inventory.
        </small>
      </h4>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-navbar-brand href="#">
        <Logo/>
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
