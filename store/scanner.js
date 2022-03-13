// Initial state
const state = function () {
  return {
    cameras: undefined,
    selectedCamera: undefined,
  };
};

// Getters
const getters = {};

// Mutations (setters; synchronous operations, preferably on one state property)
const mutations = {
  setCameras(state, cameras) {
    state.cameras = cameras;
  },
  setSelectedCamera(state, selectedCamera) {
    state.selectedCamera = selectedCamera;
  },
};

// Actions (asynchronous operations and/or multiple mutations)
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
