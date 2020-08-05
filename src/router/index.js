import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      login: false,
      title: 'imagefruits'
    }
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import(/* webpackChunkName: "upload" */ '../views/Upload.vue'),
    meta: {
      login: true,
      title: 'imagefruits | 上傳圖片'
    }
  },
  {
    path: '/uploadSC',
    name: 'UploadSC',
    component: () => import(/* webpackChunkName: "uploadSC" */ '../views/UploadSC.vue'),
    meta: {
      login: true,
      title: 'imagefruits | 上傳成功'
    }
  },
  {
    path: '/myimages',
    name: 'Myimages',
    component: () => import(/* webpackChunkName: "myimages" */ '../views/Myimages.vue'),
    meta: {
      login: true,
      title: 'imagefruits | 我的圖片'
    }
  },
  {
    path: '/myfav',
    name: 'Myfav',
    component: () => import(/* webpackChunkName: "myfav" */ '../views/Myfav.vue'),
    meta: {
      login: true,
      title: 'imagefruits | 我的收藏'
    }
  },
  {
    path: '/myinfo',
    name: 'Myinfo',
    component: () => import(/* webpackChunkName: "myinfo" */ '../views/Myinfo.vue'),
    meta: {
      login: true,
      title: 'imagefruits | 我的資料'
    }
  },
  {
    path: '/myalbum',
    name: 'Myalbum',
    component: () => import(/* webpackChunkName: "myalbum" */ '../views/Myalbum.vue'),
    meta: {
      login: true,
      title: 'imagefruits | 相簿'
    }
  },
  {
    path: '/aboutus',
    name: 'Aboutus',
    component: () => import(/* webpackChunkName: "aboutus" */ '../views/Aboutus.vue'),
    meta: {
      login: false,
      title: 'imagefruits | 關於我們'
    }
  },
  {
    path: '/author',
    name: 'Author',
    component: () => import(/* webpackChunkName: "author" */ '../views/Author.vue'),
    meta: {
      login: false,
      title: 'imagefruits | 作者頁面'
    }
  },
  {
    path: '/authoralbum',
    name: 'Authoralbum',
    component: () => import(/* webpackChunkName: "authoralbum" */ '../views/Authoralbum.vue'),
    meta: {
      login: false,
      title: 'imagefruits | 相簿'
    }
  },
  {
    path: '/newalbum',
    name: 'Newalbum',
    component: () => import(/* webpackChunkName: "newalbum" */ '../views/Newalbum.vue'),
    meta: {
      login: true,
      title: 'imagefruits | 新增相簿'
    }
  },
  {
    path: '/back',
    name: 'Back',
    component: () => import(/* webpackChunkName: "back" */ '../views/Back.vue'),
    meta: {
      login: true,
      title: 'imagefruits | 管理員後台'
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if (to.meta.login && !store.state.user) {
    next('/')
  } else {
    next()
  }
})

export default router
