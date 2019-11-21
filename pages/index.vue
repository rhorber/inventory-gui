<template>
  <div>
    <div>
      <nuxt-link to="/item/add">
        <b-button
          variant="primary"
          class="mt-2 mb-3"
        >
          Artikel hinzufügen
        </b-button>
      </nuxt-link>
    </div>
    <b-table
      :fields="tableFields"
      :items="sortedItems"
      striped
      hover
    >
      <template
        slot="cell(name)"
        slot-scope="data"
      >
        {{ data.item.name }}
        <br class="d-inline d-md-none">
        <span
          v-if="data.item.best_before !== ''"
          class="d-inline d-lg-none"
        >
          ({{ data.item.best_before }})
        </span>
      </template>
      <template
        slot="cell(size)"
        slot-scope="data"
      >
        <span v-if="data.item.unit !== 'N/A'">
          {{ data.item.size + '&nbsp;' + data.item.unit }}
        </span>
      </template>
      <template
        slot="cell(stock)"
        slot-scope="data"
      >
        <b-button
          variant="outline-secondary"
          @click="decreaseStock(data.item)"
        >
          <i class="fa fa-minus" />
        </b-button>
        <span class="amount">{{ data.value }}</span>
        <b-button
          variant="outline-secondary"
          @click="increaseStock(data.item)"
        >
          <i class="fa fa-plus" />
        </b-button>
      </template>
      <template
        slot="cell(sorting)"
        slot-scope="data"
      >
        <b-button
          v-if="data.index < items.length "
          :class="{ invisible: data.item.position == nofItems }"
          variant="outline-secondary"
          @click="moveDown(data.item)"
        >
          <i class="fa fa-angle-down" />
        </b-button>
        <b-button
          v-if="data.index > 0"
          variant="outline-secondary"
          @click="moveUp(data.item)"
        >
          <i class="fa fa-angle-up" />
        </b-button>
      </template>
      <template
        slot="cell(actions)"
        slot-scope="data"
      >
        <nuxt-link :to="'/item/edit/' + data.item.id">
          <b-button variant="primary">
            <i class="fa fa-edit" />
          </b-button>
        </nuxt-link>
        <b-button
          variant="danger"
          @click="resetStock(data.item)"
        >
          <i class="fa fa-trash-o" />
        </b-button>
      </template>
    </b-table>
    <div>
      <nuxt-link to="/item/add">
        <b-button
          variant="primary"
          class="mb-2"
        >
          Artikel hinzufügen
        </b-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({app}) {
    return app.$axios.$get('/v1/inventory')
      .then((result) => {
        return {items: result.items}
      });
  },
  data() {
    return {
      tableFields: [
        {key: 'name', label: 'Name'},
        {key: 'size', label: 'Grösse'},
        {key: 'best_before', label: 'MHD', class: ['d-none', 'd-lg-table-cell']},
        {key: 'stock', label: 'Anzahl'},
        {key: 'sorting', label: '', class: ['d-none', 'd-sm-table-cell']},
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
      this.$axios.$get(`/v1/item/${item.id}/decrement`)
        .then((_result) => {
          item.stock--;
        })
        .catch(console.error);
    },
    increaseStock(item) {
      this.$axios.$get(`/v1/item/${item.id}/increment`)
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
      this.$axios.$get(`/v1/item/${item.id}/move-up`)
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
      this.$axios.$get(`/v1/item/${item.id}/reset-stock`)
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
