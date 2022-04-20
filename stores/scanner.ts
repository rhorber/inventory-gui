import { defineStore } from 'pinia'

import { CameraDevice, ScannerModuleState } from '~/types/store'

export const useScannerStore = defineStore('scanner', {
  state: function (): ScannerModuleState {
    return {
      cameras: undefined,
      selectedCamera: undefined
    }
  },
  getters: {
  },
  actions: {
    setCameras(cameras: CameraDevice[]): void {
      this.cameras = cameras
    },
    setSelectedCamera(selectedCamera: string): void {
      this.selectedCamera = selectedCamera
    }
  }
})
