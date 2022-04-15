import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { CameraDevice, RootState, ScannerModuleState } from '~/types/store'

// Initial state
const state = function () {
  return {
    cameras: undefined,
    selectedCamera: undefined
  }
}

// Getters
const getters: GetterTree<ScannerModuleState, RootState> = {}

// Mutations (setters; synchronous operations, preferably on one state property)
const mutations: MutationTree<ScannerModuleState> = {
  setCameras(state: ScannerModuleState, cameras: CameraDevice[]) {
    state.cameras = cameras
  },
  setSelectedCamera(state: ScannerModuleState, selectedCamera: string) {
    state.selectedCamera = selectedCamera
  }
}

// Actions (asynchronous operations and/or multiple mutations)
const actions: ActionTree<ScannerModuleState, RootState> = {}

export default {
  state,
  getters,
  mutations,
  actions
}