<template>
  <div>
    <b-table
      :fields="tableFields"
      :items="sortedItems"
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
        slot="sorting"
        slot-scope="data"
      >
        <div class="d-none d-sm-block">
          <b-button
            v-if="data.index < items.length "
            :class="{ invisible: data.item.position === nofItems }"
            variant="outline-secondary"
            @click="moveDown(data.item)"
          >
            <i class="fa fa-angle-down"/>
          </b-button>
          <b-button
            v-if="data.index > 0"
            variant="outline-secondary"
            @click="moveUp(data.item)"
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
          @click="resetStock(data.item)"
        >
          <i class="fa fa-trash-o"/>
        </b-button>
      </template>
    </b-table>
    <div>
      <nuxt-link to="/item/add">
        <b-button
          variant="primary"
          class="mb-2"
        >
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
        {key: 'size', label: 'Grösse'},
        {key: 'stock', label: 'Anzahl'},
        {key: 'sorting', label: ''},
        {key: 'actions', label: 'Aktionen'},
      ]
    };
  },
  computed: {
    sortedItems() {
      return [...this.items].sort((item1, item2) => item1.position - item2.position);
    },
    nofItems() {
      return this.items.length;
    }
  },
  methods: {
    decreaseStock(item) {
      this.$axios.$get(`/item/${item.id}/decrement`)
        .then((_result) => {
          item.stock--;
        })
        .catch(console.error);
    },
    increaseStock(item) {
      this.$axios.$get(`/item/${item.id}/increment`)
        .then((_result) => {
          item.stock++;
        })
        .catch(console.error);
    },
    moveDown(item) {
      this.$axios.$get(`/item/${item.id}/move-down`)
        .then((_result) => {
          let newPosition = parseInt(item.position) + 1;
          let otherItem = this.items.find((i) => parseInt(i.position) === newPosition);

          otherItem.position--;
          item.position++;

          // TODO: Maybe there is a better way.. (use store)
        })
        .catch(console.error);
    },
    moveUp(item) {
      this.$axios.$get(`/item/${item.id}/move-up`)
        .then((_result) => {
          let newPosition = parseInt(item.position) - 1;
          let otherItem = this.items.find((i) => parseInt(i.position) === newPosition);

          otherItem.position++;
          item.position--;

          // TODO: Maybe there is a better way.. (use store)
        })
        .catch(console.error);
    },
    resetStock(item) {
      this.$axios.$get(`/item/${item.id}/reset-stock`)
        .then((_result) => {
          item.stock = 0;
        })
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
