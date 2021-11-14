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

    <form
      v-if="article === undefined"
    >
      <div id="qr-code-scanner"></div>

      <b-field
        label="GTIN (EAN) *"
        class="mb-4"
      >
        <b-input
          v-model="gtin"
          type="text"
          required
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
        :loading="loading"
        @click="send()"
      >
        Senden
      </b-button>
    </form>

    <article-form
      v-if="article !== undefined"
      :article="article"
      @formSubmitted="addArticle"
    />
  </base-layout-form>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

import BaseLayoutForm from '~/components/BaseLayoutForm'
import ArticleForm from '~/components/ArticleForm'

export default {
  name: 'Gtin',

  components: {
    ArticleForm,
    BaseLayoutForm,
  },

  data() {
    return {
      pageTitle: 'GTIN eingeben',
      gtin: '',
      loading: false,
      article: undefined,
      notFound: false,
      error: '',
      scanner: undefined,
    };
  },

  mounted() {
    const scannerConfig = {
      fps: 5,
      qrbox: {width: 250, height: 150},
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.EAN_13,
      ],
    };

    const scanner = new Html5QrcodeScanner('qr-code-scanner', scannerConfig, false);
    scanner.render(this.onScanSuccess, console.error);

    this.scanner = scanner;
  },

  methods: {
    ...mapMutations({resetArticles: 'resetArticles', addToStore: 'addArticle'}),
    ...mapActions(['addToSyncQueue']),
    back() {
      this.scanner.clear();
      this.$router.go(-1);
    },
    send() {
      this.loading = true;
      this.notFound = false;
      this.error = "";
      this.gtin = this.gtin.trim();

      this.$axios.get('/v3/gtin/' + this.gtin)
        .then((response) => {
          this._handleResponse(response.data);
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.error = error;
          this.loading = false;
        });
    },
    onScanSuccess(decodedText, _decodedResult) {
      this.gtin = decodedText;
      this.scanner.clear();
    },
    _handleResponse(response) {
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
