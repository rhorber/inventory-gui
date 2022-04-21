<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'pinia'

import GtinScanner from '~/components/GtinScanner.vue'
import { useRootStore } from '~/stores/root'
import { Article, ArticleProperty, Lot } from '~/types/entities'
import { BTableColumn, HtmlAttrs } from '~/types/buefy'

type BestBeforeObject = {
  text: string
  date: Date
  isMonth: boolean
}

type LotEditing = Omit<Lot, 'best_before'> & {
  best_before: BestBeforeObject
}

type ArticleEditing = Omit<ArticleProperty, 'lots'> & {
  lots: LotEditing[]
}

function parseDate(dateString: string): BestBeforeObject {
  const match = dateString.match(/(\d{2})?\.?(\d{2})\.(\d{4})/)
  const date = new Date()
  let isMonth = false

  if (match !== null) {
    date.setFullYear(Number.parseInt(match[3], 10))
    date.setMonth(Number.parseInt(match[2], 10) - 1)

    if (match[1] === undefined) {
      isMonth = true
    } else {
      date.setDate(Number.parseInt(match[1], 10))
    }
  }

  return {
    text: dateString,
    date: date,
    isMonth: isMonth
  }
}

export default Vue.extend({
  components: {
    GtinScanner
  },

  props: {
    article: {
      type: Object as PropType<ArticleProperty>,
      required: true
    }
  },

  data: function () {
    const article: ArticleEditing = Object.assign({}, this.article, { lots: [] })
    const units = ['', 'g', 'kg', 'l', 'ml', 'Rolle', 'Stk']

    if (Object.prototype.hasOwnProperty.call(this.article, 'lots') === true) {
      this.article.lots.forEach((lot: Lot): void => {
        const lotEditing: LotEditing = Object.assign({}, lot, { best_before: undefined })

        lotEditing.best_before = parseDate(lot.best_before)
        article.lots.push(lotEditing)
      })
    }

    if (typeof article.size === 'string' && article.unit === '') {
      const match = article.size.match(/(\d+) ?(\w+)/)

      // TODO: Should be handled on GTIN page.
      if (match !== null) {
        if (units.includes(match[2])) {
          article.size = match[1]
          article.unit = match[2]
        }
      }
    }

    return {
      dataArticle: article,
      units: units,
      gtin: '',
      scanner: false
    }
  },

  computed: {
    ...mapState(useRootStore, ['categories']),
    articleLots(): LotEditing[] {
      const lots = this.dataArticle.lots.slice(0)
      return lots.sort((lot1: LotEditing, lot2: LotEditing): number => lot1.position - lot2.position)
    },
    highestLotIndex(): number {
      return (this.dataArticle.lots.length - 1)
    }
  },

  methods: {
    bestBeforeColumnAttrs(_columnOrRow: BTableColumn | Lot, _column?: BTableColumn): HtmlAttrs {
      return {
        class: 'best-before'
      }
    },
    setBestBeforeText(bestBefore: BestBeforeObject): void {
      bestBefore.text = this.formatDate(bestBefore.date, bestBefore.isMonth)
    },
    setBestBeforeDate(bestBefore: BestBeforeObject): void {
      const parsed = parseDate(bestBefore.text)

      bestBefore.date = parsed.date
    },
    moveDown(lot: LotEditing): void {
      const filterCandidatesCallback = (l: LotEditing): boolean => l.position > lot.position
      const sortCandidatesCallback = (lot1: LotEditing, lot2: LotEditing): number => lot1.position - lot2.position

      this.moveLot(lot, filterCandidatesCallback, sortCandidatesCallback)
    },
    moveUp(lot: LotEditing): void {
      const filterCandidatesCallback = (l: LotEditing): boolean => l.position < lot.position
      const sortCandidatesCallback = (lot1: LotEditing, lot2: LotEditing): number => lot2.position - lot1.position

      this.moveLot(lot, filterCandidatesCallback, sortCandidatesCallback)
    },
    moveLot(
      lot: LotEditing,
      filterCandidatesCallback: (lot: LotEditing) => boolean,
      sortCandidatesCallback: (lot1: LotEditing, lot2: LotEditing) => number
    ): void {
      const thisPosition = lot.position

      const candidates = this.dataArticle.lots.filter(filterCandidatesCallback)
      candidates.sort(sortCandidatesCallback)
      const lotToSwapWith = candidates.shift()

      if (lotToSwapWith === undefined) {
        return
      }

      lot.position = lotToSwapWith.position
      lotToSwapWith.position = thisPosition
    },
    addLot() {
      let maxPosition = 0
      this.dataArticle.lots.forEach((lot: LotEditing): void => {
        maxPosition = Math.max(maxPosition, lot.position)
      })

      const date = new Date()
      const bestBefore: BestBeforeObject = {
        text: '',
        date: date,
        isMonth: false
      }
      const newPosition = maxPosition + 1
      const newLot = {
        best_before: bestBefore,
        stock: 0,
        position: newPosition
      }

      this.dataArticle.lots.push(newLot)
    },
    removeLot(lot: LotEditing): void {
      this.dataArticle.lots = this.dataArticle.lots.filter(
        (l: LotEditing): boolean => l !== lot
      )
    },
    addGtin(): void {
      if (this.dataArticle.gtins === undefined) {
        this.dataArticle.gtins = []
      }

      if (/\d{1,14}/.test(this.gtin)) {
        if (this.dataArticle.gtins.includes(this.gtin) === false) {
          this.dataArticle.gtins.push(this.gtin)
        }
      }

      this.gtin = ''
    },
    removeGtin(gtin: string) {
      this.dataArticle.gtins = this.dataArticle.gtins.filter(
        (g: string): boolean => g !== gtin
      )
    },
    openScanner(): void {
      this.scanner = true
    },
    onScanCancel(): void {
      this.scanner = false
    },
    onScanSuccess(decodedText: string): void {
      this.scanner = false
      this.gtin = decodedText
      this.addGtin()
    },
    back(): void {
      this.$router.go(-1)
    },
    submit(event: MouseEvent): void {
      event.preventDefault()

      if (this.gtin !== '') {
        this.addGtin()
      }

      const article: Article = Object.assign({}, this.dataArticle, { lots: [], size: 0 })
      const timestamp = Math.floor(Date.now() / 1000)
      const size = this.dataArticle.size as string

      if (article.category === undefined || article.category === -1) {
        return
      }

      this.dataArticle.lots.forEach((lotEditing: LotEditing): void => {
        const lot: Lot = Object.assign({}, lotEditing, { best_before: '' })

        lot.timestamp = timestamp
        lot.best_before = lotEditing.best_before.text

        article.lots.push(lot)
      })
      article.lots.sort(
        (lot1: Lot, lot2: Lot): number => lot1.position - lot2.position
      )
      article.size = Number.parseInt(size, 10)

      this.$emit('formSubmitted', article)
    },
    formatDate(date: Date, isMonth: boolean): string {
      if (typeof date === 'object') {
        const year = date.getFullYear()

        let month = String(date.getMonth() + 1)
        month = month.padStart(2, '0')

        if (isMonth) {
          return `${month}.${year}`
        } else {
          let day = String(date.getDate())
          day = day.padStart(2, '0')

          return `${day}.${month}.${year}`
        }
      } else {
        return ''
      }
    }
  }
})
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
          v-for="g in dataArticle.gtins"
          :key="g"
          class="control"
        >
          <b-tag
            attached
            closable
            @close="removeGtin(g)"
          >
            {{ g }}
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

    <GtinScanner
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
