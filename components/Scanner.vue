<template>
  <b-modal
    :active="isActive"
    scroll="keep"
    has-modal-card
    can-cancel
    :on-cancel="cancel"
  >
    <div class="modal-card">
      <div class="modal-card-head">
        <div class="modal-card-title">
          Barcode Scanner
        </div>
      </div>
      <div class="modal-card-body">
        <div
          id="scanner"
          class="mb-2"
        />
      </div>
      <div class="modal-card-foot">
        <b-button
          type="is-danger"
          outlined
          @click="cancel"
        >
          Abbrechen
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default {
  name: 'Scanner',

  props: {
    isActive: {
      type: Boolean,
      required: true,
    }
  },

  data() {
    const config = {
      fps: 2,
      qrbox: {width: 400, height: 150},
      aspectRatio: 1.777778,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.EAN_13,
      ],
    };

    return {
      scanner: undefined,
      config: config,
    }
  },

  watch: {
    isActive(newValue, _oldValue) {
      if (newValue === true) {
        $nuxt.$nextTick(this.openScanner);
      }
    },
  },

  methods: {
    openScanner() {
      const scanner = new Html5Qrcode('scanner');
      scanner.start(
        {facingMode: 'environment'},
        this.config,
        this.onScanSuccess,
      );
      this.scanner = scanner;
    },
    cancel() {
      this.stopScanner();
      this.$emit('onScanCancel');
    },
    onScanSuccess(decodedText, _decodedResult) {
      this.stopScanner();
      this.$emit('onScanSuccess', decodedText);
    },
    stopScanner() {
      if (this.scanner && this.scanner.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
        this.scanner.stop();
      }
    }
  }
}
</script>

<style scoped>
#scanner {
  width: 600px;
}
</style>
