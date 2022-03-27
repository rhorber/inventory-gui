<script>
import { mapMutations,  mapState } from 'vuex';
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode';

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
      aspectRatio: 1,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.EAN_13,
      ],
    };

    return {
      loading: true,
      scanner: undefined,
      config: config,
      videoConstraints: { facingMode: 'environment' },
      qrcodeConfig: { experimentalFeatures: { useBarCodeDetectorIfSupported: true } },
    }
  },

  computed: {
    ...mapState('scanner', ['cameras', 'selectedCamera']),
  },

  watch: {
    isActive(newValue, _oldValue) {
      if (newValue === true) {
        this.$nextTick(this.openScanner);
      }
    },
  },

  methods: {
    ...mapMutations('scanner', ['setCameras', 'setSelectedCamera']),
    async openScanner() {
      this.$nuxt.$loading.start();
      if (this.cameras === undefined) {
        await this.initCameras();
      }

      this.initConfig();

      try {
        const param = (this.selectedCamera === undefined)
          ? this.videoConstraints
          : this.selectedCamera;

        this.scanner = new Html5Qrcode('scanner', this.qrcodeConfig );
        await this.restartCamera(param);
      } catch (error) {
        this.$refs.scanner.innerText = error;
      }

      this.loading = false;
      this.$nuxt.$loading.finish();
    },
    async initCameras() {
      let cameras;
      try {
        cameras = await Html5Qrcode.getCameras();

        const constraints = { audio: false, video: this.videoConstraints };
        const streams = await navigator.mediaDevices.getUserMedia(constraints);
        const tracks = streams.getVideoTracks();

        if (tracks.length > 0) {
          const settings = tracks[0].getSettings();
          this.setSelectedCamera(settings.deviceId);
        }
      } catch (error) {
        console.error('Error getting camera devices:', error);
        cameras = [];
      }
      this.setCameras(cameras);
    },
    initConfig() {
      const scannerWidth = this.$refs.scanner.clientWidth;
      if (scannerWidth < this.config.qrbox.width) {
        const width = Math.floor(scannerWidth * 2 / 3);
        const height = Math.floor(width * 3 / 8);
        this.config.qrbox = { width, height };
      }
    },
    async changeCamera(cameraId) {
      try {
        await this.restartCamera(cameraId);
        this.setSelectedCamera(cameraId);
      } catch (error) {
        console.error(error);
      }
    },
    async restartCamera(cameraIdOrConfig) {
      await this.stopScanner();
      await this.scanner.start(cameraIdOrConfig, this.config, this.onScanSuccess);
    },
    async cancel() {
      await this.stopScanner();
      this.$emit('onScanCancel');
    },
    async onScanSuccess(decodedText, _decodedResult) {
      await this.stopScanner();
      this.$emit('onScanSuccess', decodedText);
    },
    async stopScanner() {
      if (this.scanner && this.scanner.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
        await this.scanner.stop();
      }
    }
  }
}
</script>

<template>
  <b-modal
    :active="isActive"
    scroll="keep"
    has-modal-card
    full-screen
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
          ref="scanner"
          class="mb-2"
        />
      </div>
      <div class="modal-card-foot is-justify-content-space-between">
        <b-button
          type="is-danger"
          outlined
          @click="cancel"
        >
          Abbrechen
        </b-button>
        <b-select
          :value="selectedCamera"
          :loading="loading"
          @input="changeCamera($event)"
        >
          <option
            v-for="camera in cameras"
            :key="camera.id"
            :value="camera.id"
          >
            {{ camera.label }}
          </option>
        </b-select>
      </div>
    </div>
  </b-modal>
</template>

<style scoped>
#scanner {
  max-width: 600px;
}
</style>
