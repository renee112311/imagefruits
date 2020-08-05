import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    author: '',
    album: '',
    successUp: null,
    carouselimg: []
  },
  mutations: {
    login (state, data) {
      state.user = data
    },
    logout (state) {
      state.user = ''
    },
    successClean (state) {
      state.successUp = null
    },
    successUp (state, data) {
      state.successUp = data
    },
    author (state, data) {
      state.author = data
    },
    album (state, data) {
      state.album = data
    },
    carouselimg (state, data) {
      state.carouselimg = data
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    successUp (state) {
      return state.successUp
    },
    author (state) {
      return state.author
    },
    album (state) {
      return state.album
    },
    carouselimg (state) {
      return state.carouselimg
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
