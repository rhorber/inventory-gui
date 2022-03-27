<script>
import { mapState } from 'vuex'

import Scanner from '~/components/Scanner'

export default {
  components: {
    Scanner,
  },

  props: {
    article: {
      type: Object,
      required: true
    }
  },

  data() {
    const article = Object.assign({}, this.article);
    const units = ['', 'g', 'kg', 'l', 'ml', 'Rolle', 'Stk'];

    if (article.hasOwnProperty('lots') === false) {
      article.lots = [];
    }

    article.lots.forEach((lot) => {
      if (lot.best_before instanceof Object) {
        return;
      }

      const bestBefore = lot.best_before;
      const parsed = this.parseDate(bestBefore);

      lot.best_before = {
        text: bestBefore,
        date: parsed.date,
        isMonth: parsed.isMonth,
      };
    });

    if (article.size !== null && article.size !== '' && article.hasOwnProperty('unit') === false) {
      const match = article.size.match(/(\d+) (\w+)/);

      if (match !== null) {
        if (units.includes(match[2])) {
          article.size = match[1];
          article.unit = match[2];
        }
      }
    }

    return {
      dataArticle: article,
      units: units,
      gtin: '',
      scanner: false,
    }
  },

  computed: {
    ...mapState(['categories']),
    articleLots() {
      const lots = this.dataArticle.lots.slice(0);
      return lots.sort((lot1, lot2) => lot1.position - lot2.position);
    },
    highestLotIndex() {
      return (this.dataArticle.lots.length - 1);
    }
  },

  methods: {
    bestBeforeColumnAttrs(_row, _column) {
      return {
        class: 'best-before',
      };
    },
    setBestBeforeText(bestBefore) {
      bestBefore.text = this.formatDate(bestBefore.date, bestBefore.isMonth);
    },
    setBestBeforeDate(bestBefore) {
      if (bestBefore instanceof Object) {
        const parsed = this.parseDate(bestBefore.text);

        bestBefore.date = parsed.date;
      }
    },
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

      const date = new Date();
      const bestBefore = {
        text: '',
        date: date,
        isMonth: false,
      };
      const newPosition = String(maxPosition + 1);
      const newLot = {
        best_before: bestBefore,
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
    addGtin() {
      if (this.dataArticle.gtins === undefined) {
        this.dataArticle.gtins = [];
      }

      if (/\d{1,14}/.test(this.gtin)) {
        if (this.dataArticle.gtins.indexOf(this.gtin) === -1) {
          this.dataArticle.gtins.push(this.gtin);
        }
      }

      this.gtin = '';
    },
    removeGtin(gtin) {
      this.dataArticle.gtins = this.dataArticle.gtins.filter(
        (g) => g !== gtin
      );
    },
    openScanner() {
      this.scanner = true;
    },
    onScanCancel() {
      this.scanner = false;
    },
    onScanSuccess(decodedText, _decodedResult) {
      this.scanner = false;
      this.gtin = decodedText;
      this.addGtin();
    },
    back() {
      this.$router.go(-1);
    },
    submit(event) {
      event.preventDefault();

      const timestamp = Math.floor(Date.now() / 1000);
      this.dataArticle.lots.forEach((lot) => {
        lot.timestamp = timestamp;
        lot.best_before = lot.best_before.text;
      });
      this.dataArticle.lots.sort(
        (lot1, lot2) => lot1.position - lot2.position
      );

      if (this.gtin !== '') {
        this.addGtin();
      }

      this.$emit('formSubmitted', this.dataArticle);
    },
    parseDate(dateString) {
      const match = dateString.match(/(\d{2})?\.?(\d{2})\.(\d{4})/);
      const date = new Date();
      let isMonth = false;

      if (match !== null) {
        date.setFullYear(match[3]);
        date.setMonth(match[2] - 1);

        if (match[1] === undefined) {
          isMonth = true;
        } else {
          date.setDate(match[1]);
        }
      }

      return {
        date,
        isMonth,
      };
    },
    formatDate(date, isMonth) {
      if (date instanceof Date) {
        const year = date.getFullYear();

        let month = String(date.getMonth() + 1)
        month = month.padStart(2, '0');

        if (isMonth) {
          return `${month}.${year}`;
        } else {
          let day = String(date.getDate())
          day = day.padStart(2, '0');

          return `${day}.${month}.${year}`;
        }
      } else {
        return '';
      }
    }
  }
}
</script>

<template>
  <form>
    <section>
      <p class="is-size-4 mt-4 mb-2">
        Artikel
      </p>

      <b-field label="Kategorie *">
        <b-select
          v-model="dataArticle.category"
          required
        >
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </b-select>
      </b-field>

      <b-field label="Name *">
        <b-input
          v-model="dataArticle.name"
          type="text"
          required
        />
      </b-field>

      <b-field label="Grösse">
        <b-input
          v-model="dataArticle.size"
          type="text"
        />
      </b-field>

      <b-field label="Einheit">
        <b-select v-model="dataArticle.unit">
          <option
            v-for="unit in units"
            :key="unit"
            :value="unit"
          >
            {{ unit }}
          </option>
        </b-select>
      </b-field>
    </section>

    <section>
      <p class="is-size-4 mt-5 mb-2">
        Charge(n)
      </p>

      <b-table
        :data="articleLots"
        :default-sort="['position', 'asc']"
        striped
        hoverable
      >
        <b-table-column
          v-slot="{ row }"
          custom-key="best_before"
          label="Mindestens haltbar bis"
          :th-attrs="bestBeforeColumnAttrs"
          :td-attrs="bestBeforeColumnAttrs"
        >
          <b-field>
            <b-datepicker
              v-model="row.best_before.date"
              :type="row.best_before.isMonth ? 'month' : undefined"
              :mobile-native="false"
              append-to-body
              @input="setBestBeforeText(row.best_before)"
            >
              <template #default>
                <b-field class="columns">
                  <b-radio-button
                    v-model="row.best_before.isMonth"
                    :native-value="false"
                    class="column pr-0"
                  >
                    <span>dd.mm.YYYY</span>
                  </b-radio-button>
                  <b-radio-button
                    v-model="row.best_before.isMonth"
                    :native-value="true"
                    class="column pl-0"
                  >
                    <span>mm.YYYY</span>
                  </b-radio-button>
                </b-field>
              </template>
              <template #trigger>
                <b-button
                  icon-right="calendar"
                />
              </template>
            </b-datepicker>
            <b-input
              v-model="row.best_before.text"
              type="text"
              custom-class="has-text-right"
              @input="setBestBeforeDate(row.best_before)"
            />
          </b-field>
        </b-table-column>

        <b-table-column
          v-slot="{ row }"
          field="stock"
          label="Anzahl *"
        >
          <b-field>
            <b-input
              v-model="row.stock"
              type="number"
              class="amount"
              required
            />
          </b-field>
        </b-table-column>

        <b-table-column
          v-slot="{ row, index }"
          custom-key="sorting"
        >
          <div>
            <b-button
              v-if="$nuxt.isOnline"
              :class="{ 'is-invisible': index === highestLotIndex }"
              type="is-dark"
              outlined
              icon-right="chevron-bottom"
              @click="moveDown(row)"
            />
            <b-button
              v-if="$nuxt.isOnline"
              :class="{ 'is-invisible': index === 0 }"
              type="is-dark"
              outlined
              icon-right="chevron-top"
              @click="moveUp(row)"
            />
          </div>
        </b-table-column>

        <b-table-column
          v-slot="{ row }"
          custom-key="actions"
          label="Aktionen"
        >
          <b-button
            type="is-danger"
            outlined
            icon-right="trash"
            @click="removeLot(row)"
          />
        </b-table-column>

        <template #footer>
          <td>
            <p class="is-size-7 has-text-grey">
              Format: dd.mm.YYYY oder mm.YYYY
            </p>
          </td>
          <td colspan="2" />
          <td>
            <b-button
              type="is-primary"
              outlined
              icon-right="plus"
              @click="addLot()"
            />
          </td>
        </template>
      </b-table>
    </section>

    <section>
      <p class="is-size-4 mt-5 mb-2">
        GTIN (EAN)
      </p>

      <b-field label="GTIN (EAN)">
        <p class="control">
          <b-button
            icon-left="fullscreen"
            @click="openScanner"
          />
        </p>
        <b-input
          v-model="gtin"
          type="text"
          expanded
        />
        <p class="control">
          <b-button
            icon-left="plus"
            @click="addGtin()"
          />
        </p>
      </b-field>

      <b-field
        grouped
        group-multiline
      >
        <div
          v-for="gtin in dataArticle.gtins"
          :key="gtin"
          class="control"
        >
          <b-tag
            attached
            closable
            @close="removeGtin(gtin)"
          >
            {{ gtin }}
          </b-tag>
        </div>
      </b-field>
    </section>

    <section class="py-4">
      <b-button
        type="is-danger"
        outlined
        @click="back()"
      >
        Abbrechen
      </b-button>
      <b-button
        type="is-primary"
        native-type="submit"
        @click="submit($event)"
      >
        Speichern
      </b-button>
    </section>

    <scanner
      :is-active="scanner"
      @onScanCancel="onScanCancel"
      @onScanSuccess="onScanSuccess"
    />
  </form>
</template>

<style scoped>
.table th.best-before, .table td.best-before {
  min-width: 8.5rem;
}
</style>
