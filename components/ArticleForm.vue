<template>
  <b-form
    class="mb-2"
    @submit="onSubmit"
  >
    <h4 class="mt-3">
      Artikel
    </h4>
    <b-form-group
      label="Kategorie *"
      label-for="category"
    >
      <b-form-select
        id="category"
        v-model="dataArticle.category"
        :options="categories"
        value-field="id"
        text-field="name"
        required
      />
    </b-form-group>

    <b-form-group
      label="Name *"
      label-for="name"
    >
      <b-form-input
        id="name"
        v-model="dataArticle.name"
        type="text"
        required
      />
    </b-form-group>

    <b-form-group
      label="Grösse"
      label-for="size"
    >
      <b-form-input
        id="size"
        v-model="dataArticle.size"
        type="text"
      />
    </b-form-group>

    <b-form-group
      label="Einheit"
      label-for="unit"
    >
      <div>
        <b-form-select
          id="unit"
          v-model="dataArticle.unit"
          :options="units"
        />
      </div>
    </b-form-group>

    <h4 class="mt-4">
      Charge(n)
    </h4>

    <b-table
      :fields="tableFields"
      :items="dataArticle.lots"
      sort-by="position"
      foot-clone
      striped
      hover
    >
      <template
        slot="cell(best_before)"
        slot-scope="data"
      >
        <b-form-input
          v-model="data.item.best_before"
          type="text"
        />
      </template>
      <template
        slot="cell(stock)"
        slot-scope="data"
      >
        <b-form-input
          v-model="data.item.stock"
          type="number"
          class="amount"
          required
        />
      </template>
      <template
        slot="cell(sorting)"
        slot-scope="data"
      >
        <b-button
          v-if="$nuxt.isOnline"
          :class="{ invisible: data.index === highestLotIndex }"
          variant="outline-secondary"
          @click="moveDown(data.item)"
        >
          <i class="fa fa-angle-down" />
        </b-button>
        <b-button
          v-if="$nuxt.isOnline && data.index > 0"
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
        <b-button
          variant="outline-danger"
          @click="removeLot(data.item)"
        >
          <i class="fa fa-trash-o" />
        </b-button>
      </template>
      <template slot="foot()">
        &nbsp;
      </template>
      <template slot="foot(best_before)">
        <b-form-text id="best-before-help">
          Format: dd.mm.YYYY oder mm.YYYY
        </b-form-text>
      </template>
      <template slot="foot(actions)">
        <b-button
          variant="outline-primary"
          @click="addLot()"
        >
          <i class="fa fa-plus" />
        </b-button>
      </template>
    </b-table>

    <a @click="back()">
      <b-button variant="outline-danger">
        Abbrechen
      </b-button>
    </a>
    <b-button
      variant="primary"
      type="submit"
    >
      Speichern
    </b-button>
  </b-form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dataArticle: this.article,
      units: ['', 'cl', 'g', 'kg', 'l', 'ml', 'Rolle', 'Stk'],
      tableFields: [
        {key: 'best_before', label: 'Mindestens haltbar bis'},
        {key: 'stock', label: 'Anzahl *'},
        {key: 'sorting', label: ''},
        {key: 'actions', label: 'Aktionen'},
      ]
    }
  },
  computed: {
    ...mapState(['categories']),
    highestLotIndex() {
      return (this.dataArticle.lots.length - 1);
    }
  },
  methods: {
    moveDown(lot) {
      const filterCandidatesCallback = (l) => l.position > lot.position;
      const sortCandidatesCallback = (lot1, lot2) => lot1.position - lot2.position;

      this.moveLot(lot, filterCandidatesCallback, sortCandidatesCallback);
    },
    moveUp(lot) {
      const filterCandidatesCallback = (l) => l.position < lot.position;
      const sortCandidatesCallback = (lot1, lot2) => lot2.position - lot1.position;

      this.moveLot(lot, filterCandidatesCallback, sortCandidatesCallback);
    },
    moveLot(lot, filterCandidatesCallback, sortCandidatesCallback) {
      const thisPosition = lot.position;

      const candidates = this.dataArticle.lots.filter(filterCandidatesCallback);
      candidates.sort(sortCandidatesCallback);
      const lotToSwapWith = candidates.shift();

      lot.position = lotToSwapWith.position;
      lotToSwapWith.position = thisPosition;
    },
    addLot() {
      let maxPosition = 0;
      let thisPosition = 0;
      this.dataArticle.lots.forEach((lot) => {
        thisPosition = Number.parseInt(lot.position, 10);
        maxPosition = Math.max(maxPosition, thisPosition);
      });

      const newPosition = String(maxPosition + 1);
      const newLot = {
        best_before: '',
        stock: 0,
        position: newPosition
      };

      this.dataArticle.lots.push(newLot);
    },
    removeLot(lot) {
      this.dataArticle.lots = this.dataArticle.lots.filter(
        (l) => l !== lot
      );
    },
    back(_event) {
      this.$router.go(-1);
    },
    onSubmit(event) {
      event.preventDefault();

      const timestamp = Math.floor(Date.now() / 1000);
      this.dataArticle.lots.forEach((lot) => {
        lot.timestamp = timestamp;
      });
      this.dataArticle.lots.sort(
        (lot1, lot2) => lot1.position - lot2.position
      );

      this.$emit('formSubmitted', this.dataArticle);
    }
  }
}
</script>
