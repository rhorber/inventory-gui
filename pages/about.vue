<template>
  <div>
    <img
      src="~/assets/logo.svg"
      style="height: 100px;"
    >
    <h1 class="title">
      Inventory
    </h1>
    <h2 class="subtitle">
      Little helper application to manage (cellar) inventory.
    </h2>
    <h5>Access Token: {{ accessToken }}</h5>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accessToken: this.$store.state.accessToken
    };
  }
};
</script>

<style scoped>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
  'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 36px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
