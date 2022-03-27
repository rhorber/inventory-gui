<script>
import { mapActions, mapMutations, mapState } from 'vuex'

import Navigation from '../components/Navigation';

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

<template>
  <div>
    <navigation />
    <section class="mx-3">
      <b-message
        v-if="$nuxt.isOffline"
        type="is-warning"
        has-icon
        icon-size="is-medium"
      >
        Du bist offline.
      </b-message>
      <b-message
        v-if="$nuxt.isOnline && isSyncPending"
        type="is-warning"
      >
        <b-button
          type="is-warning"
          :disabled="isSyncing"
          @click="synchronize"
        >
          Synchronisieren
        </b-button>
      </b-message>
      <b-message
        v-if="isSyncing"
        type="is-primary"
        has-icon
        icon-size="is-medium"
      >
        Synchronisation läuft...
      </b-message>
    </section>
    <section>
      <div class="container p-5">
        <nuxt />
      </div>
    </section>
  </div>
</template>

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
