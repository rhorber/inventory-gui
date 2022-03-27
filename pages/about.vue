<script>
export default {
  data() {
    return {
      accessToken: this.$store.state.accessToken,
      isSyncPending: this.$store.state.isSyncPending
    };
  }
};
</script>

<template>
  <div>
    <img
      src="~/assets/logo.svg"
      style="height: 100px;"
    >
    <p class="title">
      Inventory
    </p>
    <p class="subtitle">
      Little helper application to manage (cellar) inventory.
    </p>
    <p class="is-size-5">
      Access Token: {{ accessToken }}
    </p>
    <p class="is-size-5">
      Sync Pending: {{ isSyncPending }}
    </p>
  </div>
</template>

<style scoped>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
  'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 5rem;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 2.25rem;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

p {
  padding-bottom: 0.5rem;
}
</style>
