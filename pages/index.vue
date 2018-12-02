<template>
  <div>
    <b-table
      :fields="tableFields"
      :items="items"
      striped
      hover
    >
      <template
        slot="stock"
        slot-scope="data"
      >
        <b-button
          variant="outline-secondary"
          @click="decreaseStock(data.item)"
        >
          <i class="fa fa-minus"/>
        </b-button>
        <span class="amount">{{ data.value }}</span>
        <b-button
          variant="outline-secondary"
          @click="increaseStock(data.item)"
        >
          <i class="fa fa-plus"/>
        </b-button>
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
          @click="resetStock(data.item)"
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
        return {items: result.items}
      });
  },
  data() {
    return {
      tableFields: [
        {key: 'name', label: 'Name'},
        {key: 'stock', label: 'Anzahl'},
        {key: 'actions', label: 'Aktionen'},
      ]
    };
  },
  methods: {
    decreaseStock(item) {
      item.stock--;
      this.$axios.$get(`/item/${item.id}/decrement`)
        .then(console.log)
        .catch(console.error);
    },
    increaseStock(item) {
      item.stock++;
      this.$axios.$get(`/item/${item.id}/increment`)
        .then(console.log)
        .catch(console.error);
    },
    resetStock(item) {
      item.stock = 0;
      this.$axios.$get(`/item/${item.id}/reset-stock`)
        .then(console.log)
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
