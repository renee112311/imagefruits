<template lang="pug">
  #upload
    b-container
      h3 上傳檔案
      b-form(@submit="submit")
        b-form-file(
          multiple
          v-model="files"
          :state="state"
          placeholder="瀏覽檔案或是拖曳至此"
          drop-placeholder="將檔案拖曳至此"
          browse-text="瀏覽"
          accept="image/*"
          @input="validateFile"
        )
        p 一張上限4MB
        p 本次最多能上傳5張
        p PNG、JPEG、JPG、GIF、BMP
        b-button(size="lg" type="submit") 上傳
        br
        p.text-center
          b-spinner(variant="secondary" :style="spinnerstyle")
</template>

<script>
export default {
  name: 'upload',
  data () {
    return {
      files: [],
      state: true,
      images: [],
      banned: false,
      spinnerstyle: {
        display: 'none'
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    imagesL () {
      const localstorage = JSON.parse(localStorage.getItem('vuex'))
      return localstorage.successUp
    }
  },
  methods: {
    validateFile () {
      for (let file of this.files) {
        if (file != null) {
          if (file.size >= 2000 * 2000 || !file.type.includes('image')) {
            this.state = false
            file = null
          } else {
            this.state = true
          }
        } else {
          this.state = false
        }
      }
    },
    submit (event) {
      event.preventDefault()
      if (this.files.length === 0) {
        this.$swal({
          title: '沒有檔案',
          text: '請選擇單個或多個檔案',
          icon: 'warning',
          confirmButtonText: '知道了'
        })
      } else if (this.files.length > 5) {
        this.$swal({
          title: '檔案過多',
          text: '本次最多能上傳5張',
          icon: 'warning',
          confirmButtonText: '知道了'
        })
      } else {
        for (const file of this.files) {
          if (file === null || file.size >= 2000 * 2000 || !file.type.includes('image')) {
            this.$swal({
              title: '上傳失敗',
              text: '檔案格式不符',
              icon: 'error',
              confirmButtonText: '知道了'
            })
            return
          }
        }
        this.spinnerstyle.display = 'inline-block'
        const fd = new FormData()
        for (const i of this.files) {
          fd.append('image', i)
          fd.append('title', '無題')
          fd.append('description', '沒有任何圖片敘述')
          fd.append('album', null)
          fd.append('privacy', '公開')
        }
        this.axios.post(process.env.VUE_APP_APIURL + '/file', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            for (let i = 0; i < response.data.name.length; i++) {
              this.images.push(
                {
                  src: process.env.VUE_APP_APIURL + '/file/' + response.data.name[i].name,
                  _id: response.data.name[i]._id
                }
              )
            }
            this.$store.commit('successUp', this.images)
            this.$router.push('/uploadSC')
          })
          .catch(error => {
            this.$swal({
              title: '發生錯誤',
              text: error.response.data.message,
              icon: 'error',
              confirmButtonText: '知道了'
            })
          })
      }
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/users/' + this.user)
      .then(response => {
        const result = response.data.result[0]
        this.banned = result.banned
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: '發生錯誤',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      })
    setTimeout(() => {
      if (this.banned === true) {
        this.$swal({
          title: '您的帳號已被停權，請洽客服',
          icon: 'error',
          confirmButtonText: '知道了'
        })
        this.$router.push('/')
      }
    }, 500)
  }
}
</script>
