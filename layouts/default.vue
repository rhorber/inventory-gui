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
      <b-row align-v="center">
        <b-col>Du bist wieder online und die Synchronisations-Warteschlange ist nicht leer.</b-col>
        <b-col>
          <b-button
            variant="warning"
            :disabled="isSyncing"
            class="float-right"
            @click="synchronize"
          >
            Synchronisieren
          </b-button>
        </b-col>
      </b-row>
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
  middleware: 'populateStore',
  components: {
    Navigation
  },
  computed: {
    ...mapState(['isSyncPending', 'isSyncing'])
  },
  methods: {
    ...mapMutations(['setIsSyncing']),
    ...mapActions(['getSyncQueue', 'resetSyncQueue']),
    async synchronize() {
      this.setIsSyncing(true);

      let promises = [];
      let queue = await this.getSyncQueue();
      let request;
      let data;

      // TODO: Replace with array map.
      queue.forEach((job) => {
        data = Object.assign(job.payload, {timestamp: job.timestamp});
        request = this.$axios({
          url: job.url,
          method: job.method,
          data: data
        });
        promises.push(request);
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
