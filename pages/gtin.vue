<template>
  <base-layout-form
    :page-title="pageTitle"
  >
    <b-message
      v-if="notFound"
      type="is-info"
    >
      Es wurde kein Artikel mit dieser GTIN gefunden.
    </b-message>

    <b-message
      v-if="error !== ''"
      type="is-danger"
    >
      Bei der Abfrage trat folgender Fehler auf:<br>
      {{ error }}
    </b-message>

    <form v-if="article === undefined">
      <b-field
        label="GTIN (EAN) *"
        class="mb-4"
      >
        <p class="control">
          <b-button
            icon-left="fullscreen"
            @click="openScanner"
          />
        </p>
        <b-input
          v-model="gtin"
          type="text"
          required
          expanded
        />
      </b-field>

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
        :loading="loading"
        @click="send()"
      >
        Senden
      </b-button>
    </form>

    <scanner
      :is-active="scanner"
      @onScanCancel="onScanCancel"
      @onScanSuccess="onScanSuccess"
    />

    <article-form
      v-if="article !== undefined"
      :article="article"
      @formSubmitted="addArticle"
    />
  </base-layout-form>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

import BaseLayoutForm from '~/components/BaseLayoutForm'
import ArticleForm from '~/components/ArticleForm'
import Scanner from '~/components/Scanner'

export default {
  name: 'Gtin',

  components: {
    ArticleForm,
    BaseLayoutForm,
    Scanner,
  },

  data() {
    return {
      pageTitle: 'GTIN eingeben',
      gtin: '',
      scanner: false,
      loading: false,
      notFound: false,
      error: '',
      article: undefined,
    };
  },

  methods: {
    ...mapMutations({resetArticles: 'resetArticles', addToStore: 'addArticle'}),
    ...mapActions(['addToSyncQueue']),
    openScanner() {
      this.scanner = true;
    },
    onScanCancel() {
      this.scanner = false;
    },
    onScanSuccess(decodedText, _decodedResult) {
      this.scanner = false;
      this.gtin = decodedText;
    },
    back() {
      this.$router.go(-1);
    },
    send() {
      this.loading = true;
      this.notFound = false;
      this.error = "";
      this.gtin = this.gtin.trim();

      this.$axios.get('/v3/gtin/' + this.gtin)
        .then((response) => {
          this.handleResponse(response.data);
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.error = error;
          this.loading = false;
        });
    },
    handleResponse(response) {
      switch (response.type) {
        case "existing":
          this.$router.push(`/article/edit/${response.articleId}`);
          return;

        case "found":
          this.pageTitle = 'GTIN eingeben: Artikel erstellen';
          this.article = {
            name: response.name,
            size: response.quantity,
            gtin: this.gtin,
          };
          return;

        case "notFound":
          this.notFound = true;
          return;

        case "error":
          this.error = response.error;
          return;
      }
    },
    addArticle(data) {
      // TODO: Can that be combined with the saveArticle method in the edit page?
      const article = {
        category: data.category,
        name: data.name,
        size: data.size,
        unit: data.unit,
        gtin: data.gtin,
        lots: data.lots
      };

      const url = '/v3/articles';
      const path = `/category/${data.category}`;

      if ($nuxt.isOnline) {
        this.$axios.$post(url, article)
          .then(() => {
            this.resetArticles();
            this.$router.push({path: path});
          })
          .catch(console.error);
      } else {
        this.addToSyncQueue({method: 'post', url: url, payload: article});
        this.addToStore(article);
        this.$router.push({path: path});
      }
    }
  }
}
</script>
