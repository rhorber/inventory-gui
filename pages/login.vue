<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'login',
  data: function () {
    return {
      accessToken: ''
    }
  },
  methods: {
    login(): void {
      this.$store.dispatch('saveAccessToken', this.accessToken)
        .then((): void => {
          this.$router.push('/')
        })
    }
  }
})
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
