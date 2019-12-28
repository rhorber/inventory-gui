<template>
  <b-form @submit="onSubmit">
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

    <b-form-group
      label="Mindestens haltbar bis"
      label-for="best-before"
    >
      <b-form-input
        id="best-before"
        v-model="dataArticle.best_before"
        type="text"
      />
      <b-form-text id="best-before-help">
        Format: dd.mm.YYYY oder mm.YYYY
      </b-form-text>
    </b-form-group>

    <b-form-group
      label="Anzahl *"
      label-for="stock"
    >
      <b-form-input
        id="stock"
        v-model="dataArticle.stock"
        type="number"
        required
      />
    </b-form-group>

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
      units: ['', 'cl', 'g', 'kg', 'l', 'ml', 'Rolle', 'Stk']
    }
  },
  computed: {
    ...mapState(['categories'])
  },
  methods: {
    back(_event) {
      this.$router.go(-1);
    },
    onSubmit(event) {
      event.preventDefault();
      this.$emit('formSubmitted', this.dataArticle);
    }
  }
}
</script>
