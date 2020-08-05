import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import(/* webpackChunkName: "upload" */ '../views/Upload.vue'),
    meta: {
      login: false
    }
  },
  {
    path: '/uploadSC',
    name: 'UploadSC',
    component: () => import(/* webpackChunkName: "uploadSC" */ '../views/UploadSC.vue'),
    meta: {
      login: false
    }
  },
  {
    path: '/myimages',
    name: 'Myimages',
    component: () => import(/* webpackChunkName: "myimages" */ '../views/Myimages.vue'),
    meta: {
      login: false
    }
  },
  {
    path: '/myfav',
    name: 'Myfav',
    component: () => import(/* webpackChunkName: "myfav" */ '../views/Myfav.vue'),
    meta: {
      login: false
    }
  },
  {
    path: '/myinfo',
    name: 'Myinfo',
    component: () => import(/* webpackChunkName: "myinfo" */ '../views/Myinfo.vue'),
    meta: {
      login: false
    }
  },
  {
    path: '/myalbum',
    name: 'Myalbum',
    component: () => import(/* webpackChunkName: "myalbum" */ '../views/Myalbum.vue'),
    meta: {
      login: false
    }
  },
  {
    path: '/aboutus',
    name: 'Aboutus',
    component: () => import(/* webpackChunkName: "aboutus" */ '../views/Aboutus.vue')
  },
  {
    path: '/author',
    name: 'Author',
    component: () => import(/* webpackChunkName: "author" */ '../views/Author.vue')
  },
  {
    path: '/authoralbum',
    name: 'Authoralbum',
    component: () => import(/* webpackChunkName: "authoralbum" */ '../views/Authoralbum.vue')
  },
  {
    path: '/newalbum',
    name: 'Newalbum',
    component: () => import(/* webpackChunkName: "newalbum" */ '../views/Newalbum.vue'),
    meta: {
      login: false
    }
  },
  {
    path: '/back',
    name: 'Back',
    component: () => import(/* webpackChunkName: "back" */ '../views/Back.vue'),
    meta: {
      login: false
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.login && !store.state.user) {
    next('/')
  } else {
    next()
  }
})

// router.afterEach((to, from) => {
//   document.title = (to.name !== 'Album') ? to.meta.title : store.state.user + ' 的相簿'
//   // if(to.name !== 'Album') document.title = to.meta.title
//   // else document.title = store.state.user + ' 的相簿'
// })

export default router
