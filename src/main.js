import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueClipboard from 'vue-clipboard2'
import VuePageTransition from 'vue-page-transition'
import Textra from 'vue-textra'
import Swal from 'vue-sweetalert2'
import GoTop from '@inotom/vue-go-top'

import 'sweetalert2/dist/sweetalert2.min.css'
import './plugins/bootstrap-vue'
import './style/style.styl'
import App from './App.vue'
import router from './router'
import store from './store'
import ScrollAnimation from './directives/scrollanimations.js'

import { VueMasonryPlugin } from 'vue-masonry'
import { BootstrapVue } from 'bootstrap-vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrashAlt, faEdit, faHeart as farHeart, faUser } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { faFacebookSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
library.add(faTrashAlt, faEdit, farHeart, fasHeart, faFacebookSquare, faTwitterSquare, faSignInAlt, faUser)

axios.defaults.withCredentials = true

Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)
Vue.use(VueMasonryPlugin)
Vue.use(VueClipboard)
Vue.use(VuePageTransition)
Vue.use(Textra)
Vue.use(Swal)
Vue.use(GoTop)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.directive('scrollanimation', ScrollAnimation)

VueClipboard.config.autoSetContainer = true
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
