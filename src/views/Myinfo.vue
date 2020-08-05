<template lang="pug">
  #myinfo
    b-container
      h3 我的資料
      b-row
        b-col(cols="4")
          span.round
            img(v-if="avatar.length!==0" :src="avatar[0].src")
          b-form(@submit="newAvatar")
            b-form-file(
              v-model="file"
              :state="filestate"
              placeholder="瀏覽檔案或是拖曳至此"
              drop-placeholder="將檔案拖曳至此"
              required
              browse-text="瀏覽"
              accept="image/*"
              @input="validateFile"
            )
            p 上限250KB
            p PNG、JPEG、JPG、GIF、BMP
            b-button(type="newAvatar") 上傳頭像

        b-col.pt-5(cols="8")
          b-form(@submit="submit")
            b-form-group(
              label="密碼"
              label-for="input-password"
              description="為了保護您的帳戶安全，舊密碼不在此顯示"
              invalid-feedback="格式不符"
              :state="state('password')"
            )
              b-form-input#input-password(type="password" v-model="password" :state="state('password')" placeholder="請輸入新密碼")
            b-form-group(
              label="自我介紹"
              label-for="input-info"
              description="自我介紹最多150字"
              invalid-feedback="格式不符"
              :state="state('description')"
            )
              b-form-textarea(type="textarea" v-model="description" :state="state('description')"  placeholder="介紹一下自己吧")

            b-button(type="submit") 儲存修改
</template>

<script>
import md5 from 'md5'
export default {
  data () {
    return {
      account: '',
      password: '',
      description: '',
      id: '',
      file: null,
      filestate: null,
      model_account: '',
      model_password: '',
      model_description: '',
      avatar: []
    }
  },
  methods: {
    state (type) {
      if (type === 'description') {
        if (this.description !== undefined && this.description.length > 150) {
          return false
        } else {
          return true
        }
      }
    },
    submit (event) {
      event.preventDefault()
      if (this.description !== undefined && this.description.length > 150) {
        this.$swal({
          title: '修改失敗',
          text: '自我介紹格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else {
        if (this.password.length > 0) {
          this.axios.patch(
            process.env.VUE_APP_APIURL + '/users/edit/' + this.id,
            { password: md5(this.password), description: this.description })
            .then(response => {
              this.model_description = this.description
              this.$swal({
                title: '修改成功',
                icon: 'success',
                confirmButtonText: '知道了'
              })
            })
            .catch(error => {
              this.$swal({
                title: '發生錯誤',
                text: error.response.data.message,
                icon: 'error',
                confirmButtonText: '知道了'
              })
            })
        } else {
          this.axios.patch(
            process.env.VUE_APP_APIURL + '/users/edit/' + this.id,
            { description: this.description })
            .then(response => {
              this.model_description = this.description
              this.$swal({
                title: '修改成功',
                icon: 'success',
                confirmButtonText: '知道了'
              })
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
    newAvatar (event) {
      event.preventDefault()
      console.log(this.file)
      if (this.file === null || this.file.size >= 500 * 500 || !this.file.type.includes('image')) {
        this.$swal({
          title: '發生錯誤',
          text: '檔案格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else {
        if (this.avatar.length !== 0) {
          this.axios.delete(process.env.VUE_APP_APIURL + '/avatar/' + this.avatar[0]._id)
            .then(response => {
              this.avatar = null
              const fd = new FormData()
              fd.append('image', this.file)
              this.axios.post(process.env.VUE_APP_APIURL + '/avatar', fd, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
                .then(response => {
                  this.$swal({
                    title: '上傳成功',
                    icon: 'success',
                    confirmButtonText: '知道了'
                  })
                  location.reload()
                })
                .catch(error => {
                  this.filestate = false
                  this.$swal({
                    title: '發生錯誤',
                    text: error.response.data.message,
                    icon: 'error',
                    confirmButtonText: '知道了'
                  })
                })
            })
            .catch(() => {
              this.$swal({
                title: '發生錯誤',
                icon: 'error',
                confirmButtonText: '知道了'
              })
            })
        } else {
          const fd = new FormData()
          fd.append('image', this.file)
          this.axios.post(process.env.VUE_APP_APIURL + '/avatar', fd, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
            .then(response => {
              this.$swal({
                title: '上傳成功',
                icon: 'success',
                confirmButtonText: '知道了'
              })
              location.reload()
            })
            .catch(error => {
              this.filestate = false
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
    validateFile () {
      if (this.file != null) {
        if (this.file.size >= 500 * 500 || !this.file.type.includes('image')) {
          this.filestate = false
          this.file = null
        } else {
          this.filestate = true
        }
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/users/' + this.user)
      .then(response => {
        const result = response.data.result[0]
        this.description = result.description
        this.id = result._id
        this.model_description = result.description
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: '發生錯誤',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      })
    this.axios.get(process.env.VUE_APP_APIURL + '/avatar/' + this.user)
      .then(response => {
        this.avatar = response.data.result.map(d => {
          return {
            src: process.env.VUE_APP_APIURL + '/avatar/image/' + d.name,
            _id: d._id
          }
        })
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: '發生錯誤',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      })
  }

}
</script>
