<template>
  <div>
    <navigation />
    <b-alert
      :show="$nuxt.isOffline"
      variant="warning"
    >
      Du bist offline.
    </b-alert>
    <b-alert
      :show="$nuxt.isOnline && isSyncPending"
      variant="warning"
    >
      <b-button
        variant="warning"
        :disabled="isSyncing"
        @click="synchronize"
      >
        Synchronisieren
      </b-button>
    </b-alert>
    <b-alert
      :show="isSyncing"
      variant="primary"
    >
      Synchronisation läuft...
    </b-alert>
    <div class="d-block d-lg-none container-fluid pt-4">
      <nuxt />
    </div>
    <div class="d-none d-lg-block container pt-4">
      <nuxt />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

import Navigation from "../components/Navigation";

export default {
  components: {
    Navigation
  },
  middleware: 'populateStore',
  computed: {
    ...mapState(['isSyncPending', 'isSyncing'])
  },
  methods: {
    ...mapMutations(['setIsSyncing']),
    ...mapActions(['getSyncQueue', 'resetSyncQueue']),
    async synchronize() {
      this.setIsSyncing(true);

      const queue = await this.getSyncQueue();

      const promises = queue.map((job) => {
        const data = Object.assign(job.payload, {timestamp: job.timestamp});

        return this.$axios({
          url: job.url,
          method: job.method,
          data: data
        });
      });

      try {
        await Promise.all(promises);
        await this.resetSyncQueue();
      } catch (err) {
        console.error('synchronization failed', err);
      }

      this.setIsSyncing(false);
    }
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
