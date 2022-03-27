<script>
export default {
  layout: "login",
  data() {
    return {
      accessToken: ''
    };
  },
  methods: {
    login() {
      this.$store.dispatch('saveAccessToken', this.accessToken)
        .then(() => {
          this.$router.push('/');
        });
    }
  }
};
</script>

<template>
  <div class="m-4">
    <b-field>
      <b-input
        v-model="accessToken"
        type="text"
        @keyup.enter.native="login"
      />
    </b-field>
  </div>
</template>
