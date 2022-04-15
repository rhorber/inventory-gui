<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { Html5QrcodeResult, QrDimensions } from 'html5-qrcode/es2015/core'
import { Html5QrcodeCameraScanConfig, Html5QrcodeFullConfig } from 'html5-qrcode/es2015/html5-qrcode'

import { CameraDevice } from '~/types/store'

const videoConstraints: MediaTrackConstraints = {
  facingMode: 'environment'
}
const qrcodeConfig: Html5QrcodeFullConfig = {
  formatsToSupport: [
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.EAN_13
  ],
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true
  },
  verbose: undefined
}
const config: Html5QrcodeCameraScanConfig = {
  fps: 2,
  qrbox: {
    width: 400,
    height: 150
  },
  aspectRatio: 1
}
let scanner: undefined | Html5Qrcode

export default Vue.extend({
  name: 'GtinScanner',

  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },

  data: function () {
    return {
      loading: true
    }
  },

  computed: {
    ...mapState('scanner', ['cameras', 'selectedCamera'])
  },

  watch: {
    isActive(newValue: boolean, _oldValue: boolean): void {
      if (newValue) {
        this.$nextTick(this.openScanner)
      }
    }
  },

  methods: {
    ...mapMutations('scanner', ['setCameras', 'setSelectedCamera']),
    async openScanner(): Promise<void> {
      this.$nuxt.$loading.start()
      if (this.cameras === undefined) {
        await this.initCameras()
      }

      this.initConfig()

      try {
        const param = (this.selectedCamera === undefined)
          ? videoConstraints
          : this.selectedCamera

        scanner = new Html5Qrcode('scanner', qrcodeConfig)
        await this.restartCamera(param)
      } catch (error) {
        if (error instanceof String) {
          const scannerDiv = this.$refs.scanner as HTMLDivElement
          scannerDiv.innerText = error.toString()
        }
      }

      this.loading = false
      this.$nuxt.$loading.finish()
    },
    async initCameras(): Promise<void> {
      let cameras: CameraDevice[]
      try {
        cameras = await Html5Qrcode.getCameras()

        const constraints = { audio: false, video: videoConstraints }
        const streams = await navigator.mediaDevices.getUserMedia(constraints)
        const tracks = streams.getVideoTracks()

        if (tracks.length > 0) {
          const settings = tracks[0].getSettings()
          this.setSelectedCamera(settings.deviceId)
        }
      } catch (error) {
        console.error('Error getting camera devices:', error)
        cameras = []
      }
      this.setCameras(cameras)
    },
    initConfig(): void {
      const scannerDiv = this.$refs.scanner as HTMLDivElement
      const qrBox = config.qrbox as QrDimensions

      const scannerWidth = scannerDiv.clientWidth
      if (scannerWidth < qrBox.width) {
        const width = Math.floor(scannerWidth * 2 / 3)
        const height = Math.floor(width * 3 / 8)
        config.qrbox = { width, height }
      }
    },
    async changeCamera(cameraId: string): Promise<void> {
      try {
        await this.restartCamera(cameraId)
        this.setSelectedCamera(cameraId)
      } catch (error) {
        console.error(error)
      }
    },
    async restartCamera(cameraIdOrConfig: string): Promise<void> {
      await this.stopScanner()
      if (scanner) {
        await scanner.start(cameraIdOrConfig, config, this.onScanSuccess, undefined)
      }
    },
    async cancel(): Promise<void> {
      await this.stopScanner()
      this.$emit('onScanCancel')
    },
    async onScanSuccess(decodedText: string, _decodedResult: Html5QrcodeResult): Promise<void> {
      await this.stopScanner()
      this.$emit('onScanSuccess', decodedText)
    },
    async stopScanner(): Promise<void> {
      if (scanner && scanner.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
        await scanner.stop()
      }
    }
  }
})
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
