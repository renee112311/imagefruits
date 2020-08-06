<template lang="pug">
  #app
    #loading(:style="styleloading")
      #loadinner
        img(src='./assets/LOGO2.svg')
        h2 loading...
    #nav(:style="stylenav")
      b-navbar(toggleable="lg" fixed="top" :style="styleList")
        b-navbar-brand(to='/' style="width:190px;padding-top:0px;margin-bottom:4px")
          img(src="./assets/LOGO.svg" style="width:100%;")
        b-navbar-nav
          b-nav-item(to='/aboutus') 關於我們

        b-navbar-toggle(target='nav-collapse' v-if="user.length===0")
        b-collapse#nav-collapse(is-nav v-if="user.length===0")
          b-navbar-nav.ml-auto
            b-nav-item(v-b-modal.modal-login right)
              font-awesome-icon(:icon="['far','user']")
              | 登入
            b-nav-item(v-b-modal.modal-reg right)
              font-awesome-icon(:icon="['fas','sign-in-alt']")
              | 註冊

        b-navbar-toggle(target='nav-collapse2' v-if="user.length!==0&&user!=='admin'")
        b-collapse#nav-collapse2(is-nav v-if="user.length!==0&&user!=='admin'")
          b-navbar-nav.ml-auto
            b-nav-item.d-block.d-lg-none {{this.user}}
            b-nav-item.d-block.d-lg-none(to="/upload") 上傳圖片
            b-nav-item.d-block.d-lg-none(to="/myimages") 我的圖片
            b-nav-item.d-block.d-lg-none(to="/myfav") 我的收藏
            b-nav-item.d-block.d-lg-none(to="/myinfo") 我的資料
            b-nav-item.d-block.d-lg-none(@click="logout") 登出
            b-nav-item-dropdown.d-none.d-lg-block(right :text="this.user")
              b-dropdown-item(to="/upload") 上傳圖片
              b-dropdown-item(to="/myimages") 我的圖片
              b-dropdown-item(to="/myfav") 我的收藏
              b-dropdown-item(to="/myinfo") 我的資料
              b-dropdown-item(@click="logout") 登出

        b-navbar-toggle(target='nav-collapse3' v-if="user==='admin'")
        b-collapse#nav-collapse3(is-nav v-if="user==='admin'")
          b-navbar-nav.ml-auto
            b-nav-item.d-block.d-lg-none(to="/back") 後台管理
            b-nav-item.d-block.d-lg-none(@click="logout") 登出
            b-nav-item-dropdown.d-none.d-lg-block(right :text="this.user")
              b-dropdown-item(to="/back") 後台管理
              b-dropdown-item(@click="logout") 登出

      //- login
      b-modal#modal-login(size="xl" no-stacking hide-footer ref="modal-login")
        template(v-slot:modal-title)
          b-navbar(type="light")
            b-navbar-nav
              b-nav-item(v-b-modal.modal-login)
                font-awesome-icon(:icon="['far','user']")
                | 登入
              b-nav-item(v-b-modal.modal-reg)
                font-awesome-icon(:icon="['fas','sign-in-alt']")
                | 註冊
        b-form(@submit="submitLogin")
          b-form-group(
            label="帳號"
            label-for="input-account"
            description="帳號為 5~10 字"
            invalid-feedback="帳號格式不符"
            :state="state('account')"
          )
            b-form-input#input-account(type="text" v-model="account" :state="state('account')" placeholder="請輸入帳號")
          br
          b-form-group(
            label="密碼"
            label-for="input-password"
            description="密碼至少 1 字"
            invalid-feedback="密碼格式不符"
            :state="state('password')"
          )
            b-form-input#input-password(type="password" v-model="password" :state="state('password')" placeholder="請輸入密碼")
          b-button#login(size="lg" type="submitLogin") 登入
          b-button(size="lg" @click="$bvModal.hide('modal-login')") 取消
      //- Reg
      b-modal#modal-reg(size="xl" no-stacking hide-footer)
        template(v-slot:modal-title)
          b-navbar(type="light")
            b-navbar-nav
              b-nav-item(v-b-modal.modal-login)
                font-awesome-icon(:icon="['far','user']")
                | 登入
              b-nav-item(v-b-modal.modal-reg)
                font-awesome-icon(:icon="['fas','sign-in-alt']")
                | 註冊

        b-form(@submit="submitReg")
          b-form-group(
            label="帳號"
            label-for="input-account"
            description="帳號為 5~10 字"
            invalid-feedback="格式不符"
            :state="state('account')"
          )
            b-form-input#input-account(type="text" v-model="account" :state="state('account')" placeholder="請輸入帳號")
          br
          b-form-group(
            label="密碼"
            label-for="input-password"
            description="密碼至少 1 字"
            invalid-feedback="格式不符"
            :state="state('password')"
          )
            b-form-input#input-password(type="password" v-model="password" :state="state('password')" placeholder="請輸入密碼")
          br
          p(v-b-modal.modal-login) 已經有帳號了？點擊這裡登入。
          b-button(size="lg" type="submitReg") 註冊
          b-button(size="lg" @click="$bvModal.hide('modal-reg')") 取消

      keep-alive
        vue-page-transition(name="fade")
          router-view

</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      account: '',
      password: '',
      styleList: {
        background: 'rgba(255,255,255,0.5)',
        boxShadow: 'none'
      },
      styleloading: {
        display: 'table',
        opacity: '1',
        transition: 'all 1.5s ease'
      },
      stylenav: {
        display: 'none'
      }
    }
  },
  methods: {
    state (type) {
      if (type === 'account') {
        if (this.account.length !== 0 && (this.account.length < 5 || this.account.length > 10)) {
          return false
        } else {
          return true
        }
      }
    },
    submitLogin (event) {
      event.preventDefault()
      if (this.account.length < 5 || this.account.length > 10) {
        this.$swal({
          title: '無法登入',
          text: '帳號格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else if (this.password.length < 1) {
        this.$swal({
          title: '無法登入',
          text: '密碼格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      }
      this.axios.post(
        process.env.VUE_APP_APIURL + '/login',
        { account: this.account, password: this.password }
      )
        .then(response => {
          const data = response.data
          if (data.success) {
            this.$swal({
              title: '登入成功',
              text: '歡迎回來',
              icon: 'success',
              confirmButtonText: '知道了'
            })
            this.$refs['modal-login'].hide()
            this.$store.commit('login', this.account)
            if (this.account === 'admin') {
              this.$router.push('/back')
            }else{
              location.reload()
            }
          } else {
            this.$swal({
              title: '登入失敗',
              text: data.message,
              icon: 'error',
              confirmButtonText: '知道了'
            })
          }
        })
        .catch(error => {
          this.$swal({
            title: '登入失敗',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: '知道了'
          })
        })
    },
    submitReg (event) {
      event.preventDefault()
      if (this.account.length < 5 || this.account.length > 10) {
        this.$swal({
          title: '無法註冊',
          text: '帳號格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else if (this.password.length < 1) {
        this.$swal({
          title: '無法註冊',
          text: '請輸入密碼',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      }
      this.axios.post(
        process.env.VUE_APP_APIURL + '/users',
        { account: this.account, password: this.password, description: '', favorite: [], banned: false }
      )
        .then(response => {
          const data = response.data
          if (data.success) {
            this.$swal({
              title: '註冊成功',
              text: '恭喜您',
              icon: 'success',
              confirmButtonText: '知道了'
            })
          } else {
            this.$swal({
              title: '註冊失敗',
              text: data.message,
              icon: 'error',
              confirmButtonText: '知道了'
            })
          }
        })
        .catch(error => {
          this.$swal({
            title: '註冊失敗',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: '知道了'
          })
        })
    },
    logout () {
      this.axios.delete(process.env.VUE_APP_APIURL + '/logout')
        .then(reponse => {
          const data = reponse.data
          if (data.success) {
            this.$store.commit('logout')
            if (this.$router.path !== '/') {
              this.$router.push('/')
            }
          } else {
            this.$swal({
              title: '登出失敗',
              text: data.message,
              icon: 'error',
              confirmButtonText: '知道了'
            })
          }
        })
        .catch(error => {
          this.$swal({
            title: '登出失敗',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: '知道了'
          })
        })
    },
    heartbeat () {
      this.axios.get(process.env.VUE_APP_APIURL + '/heartbeat')
        .then(response => {
          const data = response.data
          if (this.user.length > 0) {
            if (!data) {
              this.$swal({
                title: '發生錯誤',
                text: '登入時效已過期',
                icon: 'warning',
                confirmButtonText: '知道了'
              })
              this.$store.commit('logout')
              if (this.$router.path !== '/') {
                this.$router.push('/')
              }
            }
          }
        })
        .catch(() => {
          this.$swal({
            title: '發生錯誤',
            icon: 'error',
            confirmButtonText: '知道了'
          })
          this.$store.commit('logout')
          if (this.$router.path !== '/') {
            this.$router.push('/')
          }
        })
    },
    handleScroll (event) {
      if (window.scrollY <= 600) {
        this.styleList.background = 'rgba(255,255,255,0.5)'
        this.styleList.boxShadow = 'none'
      } else {
        this.styleList.background = '#fff'
        this.styleList.boxShadow = '0 0 10px rgba(0,0,0,0.3)'
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    window.onload = () => {
      setTimeout(() => {
        this.styleloading.opacity = 0
        this.styleloading.display = 'none'
        this.styleloading.transition = 'all 1.5s ease'
        this.stylenav.display = 'block'
      }, 1000)
    }
    this.heartbeat()
    setInterval(() => {
      this.heartbeat()
    }, 1000 * 5)
  },
  beforeDestroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    $route (to, from) {
      if (to.path !== '/') {
        this.styleList.background = '#fff'
        window.removeEventListener('scroll', this.handleScroll)
      } else {
        window.addEventListener('scroll', this.handleScroll)
      }
    }
  }
}
</script>
