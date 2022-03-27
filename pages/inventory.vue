<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapState(['isInventoryActive'])
  },
  methods: {
    ...mapActions(['saveIsInventoryActive']),
    startInventory() {
      this.isLoading = true;
      this.$axios.$post('/v3/inventories')
        .then((_result) => {
          this.isLoading = false;
          this.saveIsInventoryActive(true);
        })
        .catch(console.error);
    },
    stopInventory() {
      this.isLoading = true;
      this.$axios.$delete('/v3/inventories')
        .then((_result) => {
          this.isLoading = false;
          this.saveIsInventoryActive(false);
        })
        .catch(console.error);
    },
  }
}
</script>

<template>
  <section class="container">
    <p class="is-size-3 mb-4">
      Inventur
    </p>
    <div>
      <p v-if="isInventoryActive">
        <b-message
          type="is-warning"
          has-icon
          icon-size="is-medium"
        >
          Zur Zeit ist eine Inventur aktiv.
        </b-message>
      </p>
      <p v-else>
        <b-message
          type="is-info"
          has-icon
          icon-size="is-medium"
        >
          Zur Zeit ist keine Inventur aktiv.
        </b-message>
      </p>
    </div>
    <div class="py-5">
      <b-button
        v-if="isInventoryActive"
        type="is-danger"
        :loading="isLoading"
        @click="stopInventory()"
      >
        Inventur beenden
      </b-button>
      <b-button
        v-else
        type="is-success"
        :loading="isLoading"
        @click="startInventory()"
      >
        Inventur starten
      </b-button>
    </div>
  </section>
</template>
