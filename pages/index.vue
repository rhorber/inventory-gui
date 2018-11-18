<template>
  <div>
    <div class="container pt-4">
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
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import Navigation from '~/components/Navigation.vue'

export default {
  components: {
    Logo,
    Navigation
  },
  data() {
    return {
      loading: true,
      tableFields: [
        {key: 'name', label: 'Name'},
        {key: 'stock', label: 'Anzahl'},
        {key: 'actions', label: 'Aktionen'},
      ],
      items: [
        {id: 1, name: "Item 1", stock: 1},
        {id: 2, name: "Item 2", stock: 42},
        {id: 3, name: "Item 2", stock: 42},
      ]
    };
  },
  methods: {
    decreaseStock(item) {
      item.stock--;
      // TODO: Save to database/send to API.
      console.log(item);
    },
    increaseStock(item) {
      item.stock++;
      // TODO: Save to database/send to API.
      console.log(item);
    },
    resetStock(item) {
      item.stock = 0;
      // TODO: Save to database/send to API.
      console.log(item);
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
