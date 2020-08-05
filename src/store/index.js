import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    author: '',
    album: '',
    successUp: [],
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
      state.successUp.length = 0
    },
    successUp (state, data) {
      state.successUp.push(data)
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
      var successUp0 = state.successUp[0]
      return successUp0
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
