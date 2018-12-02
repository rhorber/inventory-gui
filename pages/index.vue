<template>
  <div>
    <b-table
      :fields="tableFields"
      :items="items"
      striped
      hover
    >
      <template
        slot="size"
        slot-scope="data"
      >
        <span v-if="data.item.unit !== 'N/A'">
          {{ data.item.size + '&nbsp;' + data.item.unit }}
        </span>
      </template>
      <template
        slot="stock"
        slot-scope="data"
      >
        <b-button
          variant="outline-secondary"
          @click="decreaseStock(data.item.id)"
        >
          <i class="fa fa-minus"/>
        </b-button>
        <span class="amount">{{ data.value }}</span>
        <b-button
          variant="outline-secondary"
          @click="increaseStock(data.item.id)"
        >
          <i class="fa fa-plus"/>
        </b-button>
      </template>
      <template
        slot="sorting"
        slot-scope="data"
      >
        <div class="d-none d-sm-block">
          <b-button
            v-if="data.index < items.length "
            :class="{ invisible: data.index === items.length - 1 }"
            variant="outline-secondary"
            @click="moveDown(data.item.id)"
          >
            <i class="fa fa-angle-down"/>
          </b-button>
          <b-button
            v-if="data.index > 0"
            variant="outline-secondary"
            @click="moveUp(data.item.id)"
          >
            <i class="fa fa-angle-up"/>
          </b-button>
        </div>
      </template>
      <template
        slot="actions"
        slot-scope="data"
      >
        <nuxt-link :to="'/item/edit/' + data.item.id">
          <b-button variant="primary">
            <i class="fa fa-edit"/>
          </b-button>
        </nuxt-link>
        <b-button
          variant="danger"
          @click="resetStock(data.item.id)"
        >
          <i class="fa fa-trash-o"/>
        </b-button>
      </template>
    </b-table>
    <div>
      <nuxt-link to="/item/add">
        <b-button variant="primary">
          New Item
        </b-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({app}) {
    return app.$axios.$get('/inventory')
      .then((result) => {
        let sortedItems = result.items.sort((item1, item2) => item1.position - item2.position);
        return {items: sortedItems}
      });
  },
  data() {
    return {
      tableFields: [
        {key: 'name', label: 'Name'},
        {key: 'size', label: 'Grösse'},
        {key: 'stock', label: 'Anzahl'},
        {key: 'sorting', label: ''},
        {key: 'actions', label: 'Aktionen'},
      ]
    };
  },
  methods: {
    decreaseStock(itemId) {
      this.$axios.$get(`/item/${itemId}/decrement`)
        .catch(console.error);
    },
    increaseStock(itemId) {
      this.$axios.$get(`/item/${itemId}/increment`)
        .catch(console.error);
    },
    moveDown(itemId) {
      this.$axios.$get(`/item/${itemId}/move-down`)
        .then((_result) => {
          // TODO: Maybe there is a faster/simpler way..
          window.location.reload(true);
        })
        .catch(console.error);
    },
    moveUp(itemId) {
      this.$axios.$get(`/item/${itemId}/move-up`)
        .then((_result) => {
          // TODO: Maybe there is a faster/simpler way..
          window.location.reload(true);
        })
        .catch(console.error);
    },
    resetStock(itemId) {
      this.$axios.$get(`/item/${itemId}/reset-stock`)
        .catch(console.error);
    }
  }
}
</script>

<style scoped>
.amount {
  display: inline-block;
  min-width: 2.5rem;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
