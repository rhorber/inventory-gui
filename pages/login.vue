<template>
  <b-container
    fluid
    class="p-3"
  >
    <b-form-row>
      <b-col cols="12">
        <b-form-input
          v-model="accessToken"
          type="text"
          required
          @keyup.enter="login"
        />
      </b-col>
    </b-form-row>
  </b-container>
</template>

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
