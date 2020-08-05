<template lang="pug">
  #back
    b-container
      h3 管理員後台
      b-card(no-body)
        b-tabs(pills card vertical)
          b-tab(title='會員管理' active)
            h4 會員管理
            //- search
            b-row.searchrow
              b-col(col cols="12" xl="4")
                b-form-select.form-control(v-model="searchType")
                  option 會員帳號
                  option 會員ID編號
              b-col(col cols="12" xl="8")
                b-nav-form
                  b-form-input(type="text" size="sm" v-model="keywords" placeholder="輸入關鍵字即可搜尋")
            b-table-simple(

              striped
              hover
              responsive="sm"
              )
              b-thead
                b-tr
                  b-th 編號
                  b-th 會員帳號
                  b-th 動作
              b-tbody
                b-tr(v-if="searchuser.length === 0")
                  td 沒有資料
                b-tr(v-else v-for="(allUser, index) in searchuser" :key="'key' + index")
                  b-td
                    span {{ allUser._id }}
                  b-td
                    span {{ allUser.account }}
                  b-td
                    b-btn(v-if="allUser.banned" @click="banUser (index)") 恢復
                    b-btn(v-if="!allUser.banned&&allUser.account!=='admin'" variant="danger" @click="banUser (index)") 停權

          b-tab(title='檔案管理')
            h4 檔案管理
            //- search
            b-row.searchrow
              b-col(col cols="12" lg="3")
                b-form-select.form-control(v-model="searchType")
                  option 會員帳號
                  option 檔案ID編號
              b-col(col cols="12" lg="9")
                b-nav-form
                  b-form-input(type="text" size="sm" v-model="keywords" placeholder="輸入關鍵字即可搜尋")
            b-table-simple(
              striped
              hover
              responsive="sm"
              )
              b-thead
                b-tr
                  b-th 編號
                  b-th 會員帳號
                  b-th 檔名
                  b-th 內容
                  b-th 動作
              b-tbody
                b-tr(v-if="searchimg.length === 0")
                  td(colspan="2") 沒有資料
                b-tr(v-else v-for="(image, index) in searchimg" :key="'key' + index")
                  b-td
                    span {{ image._id }}
                  b-td
                    span {{ image.user }}
                  b-td
                    span {{ image.name }}
                  b-td
                    span {{ image.src }}
                  b-td
                    b-btn(variant="danger" @click="deleteImg(index)") 刪除
          b-tab(title='其他')
            h4 輪播圖
            b-form(@submit="newCarou1")
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
              p 上限16MB
              p PNG、JPEG、JPG、GIF、BMP
              b-button(type="newCarou1") 更換第一張
            b-form(@submit="newCarou2")
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
              p 上限16MB
              p PNG、JPEG、JPG、GIF、BMP
              b-button(type="newCarou2") 更換第二張
            b-form(@submit="newCarou3")
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
              p 上限16MB
              p PNG、JPEG、JPG、GIF、BMP
              b-button(type="newCarou3") 更換第三張
            b-form(@submit="newCarou4")
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
              p 上限16MB
              p PNG、JPEG、JPG、GIF、BMP
              b-button(type="newCarou4") 更換第四張

            //- b-form(@submit="NN")
            //-   b-form-file(
            //-     v-model="file"
            //-     :state="filestate"
            //-     placeholder="瀏覽檔案或是拖曳至此"
            //-     drop-placeholder="將檔案拖曳至此"
            //-     required
            //-     browse-text="瀏覽"
            //-     accept="image/*"
            //-     @input="validateFile"
            //-   )
            //-   b-btn(type="NN") 上傳

</template>
<script>
export default {
  data () {
    return {
      allUsers: [],
      images: [],
      keywords: '',
      searchType: '會員帳號',
      file: null,
      filestate: null,
      carouselimg: []
    }
  },
  methods: {
    banUser (index) {
      if (this.allUsers[index].banned) {
        this.axios.patch(
          process.env.VUE_APP_APIURL + '/users/banned/' + this.allUsers[index]._id,
          { banned: false }
        )
          .then(response => {
            this.allUsers[index].banned = false
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
          process.env.VUE_APP_APIURL + '/users/banned/' + this.allUsers[index]._id,
          { banned: true }
        )
          .then(response => {
            this.allUsers[index].banned = true
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
    },
    deleteImg (index) {
      this.axios.delete(process.env.VUE_APP_APIURL + '/file/' + this.images[index]._id)
        .then(response => {
          this.images.splice(index, 1)
        })
        .catch(() => {
          this.$swal({
            title: '發生錯誤',
            icon: 'error',
            confirmButtonText: '知道了'
          })
        })
    },
    newCarou1 (event) {
      event.preventDefault()
      if (this.file === null || this.file.size >= 4000 * 4000 || !this.file.type.includes('image')) {
        this.$swal({
          title: '發生錯誤',
          text: '檔案格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else {
        this.axios.delete(process.env.VUE_APP_APIURL + '/carousel/' + this.carouselimg[0]._id)
          .then(response => {
            const fd = new FormData()
            fd.append('image', this.file)
            this.axios.post(process.env.VUE_APP_APIURL + '/carousel', fd, {
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
      }
    },
    newCarou2 (event) {
      event.preventDefault()
      if (this.file === null || this.file.size >= 4000 * 4000 || !this.file.type.includes('image')) {
        this.$swal({
          title: '發生錯誤',
          text: '檔案格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else {
        this.axios.delete(process.env.VUE_APP_APIURL + '/carousel/' + this.carouselimg[1]._id)
          .then(response => {
            const fd = new FormData()
            fd.append('image', this.file)
            this.axios.post(process.env.VUE_APP_APIURL + '/carousel', fd, {
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
      }
    },
    newCarou3 (event) {
      event.preventDefault()
      if (this.file === null || this.file.size >= 4000 * 4000 || !this.file.type.includes('image')) {
        this.$swal({
          title: '發生錯誤',
          text: '檔案格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else {
        this.axios.delete(process.env.VUE_APP_APIURL + '/carousel/' + this.carouselimg[2]._id)
          .then(response => {
            const fd = new FormData()
            fd.append('image', this.file)
            this.axios.post(process.env.VUE_APP_APIURL + '/carousel', fd, {
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
      }
    },
    newCarou4 (event) {
      event.preventDefault()
      if (this.file === null || this.file.size >= 4000 * 4000 || !this.file.type.includes('image')) {
        this.$swal({
          title: '發生錯誤',
          text: '檔案格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else {
        this.axios.delete(process.env.VUE_APP_APIURL + '/carousel/' + this.carouselimg[3]._id)
          .then(response => {
            const fd = new FormData()
            fd.append('image', this.file)
            this.axios.post(process.env.VUE_APP_APIURL + '/carousel', fd, {
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
      }
    },
    NN (event) {
      event.preventDefault()
      if (this.file === null || this.file.size >= 4000 * 4000 || !this.file.type.includes('image')) {
        this.$swal({
          title: '發生錯誤',
          text: '檔案格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else {
        const fd = new FormData()
        fd.append('image', this.file)
        this.axios.post(process.env.VUE_APP_APIURL + '/carousel', fd, {
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
    },
    validateFile () {
      if (this.file != null) {
        if (this.file.size >= 4000 * 4000 || !this.file.type.includes('image')) {
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
    },
    searchuser () {
      if (this.keywords !== '') {
        const pattern = new RegExp(this.keywords)
        if (this.searchType === '會員ID編號') {
          return this.allUsers.filter(i => pattern.test(i._id))
        } else if (this.searchType === '會員帳號') {
          return this.allUsers.filter(i => pattern.test(i.account))
        } else {
          return this.allUsers
        }
      } else {
        return this.allUsers
      }
    },
    searchimg () {
      if (this.keywords !== '') {
        const pattern = new RegExp(this.keywords)
        if (this.searchType === '檔案ID編號') {
          return this.images.filter(i => pattern.test(i._id))
        } else if (this.searchType === '會員帳號') {
          return this.images.filter(i => pattern.test(i.user))
        } else {
          return this.images
        }
      } else {
        return this.images
      }
    }
  },
  mounted () {
    // allusers
    this.axios.get(process.env.VUE_APP_APIURL + '/back/users/')
      .then(response => {
        this.allUsers = response.data.result.map(d => {
          return {
            _id: d._id,
            account: d.account,
            banned: d.banned
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
    // allfiles
    this.axios.get(process.env.VUE_APP_APIURL + '/back/files/')
      .then(response => {
        this.images = response.data.result.map(d => {
          return {
            _id: d._id,
            user: d.user,
            name: d.name,
            src: process.env.VUE_APP_APIURL + '/file/' + d.name
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
    // carouselimg
    this.axios.get(process.env.VUE_APP_APIURL + '/carousel/img')
      .then(response => {
        const result = response.data.result
        this.carouselimg = result.map(d => {
          return {
            src: process.env.VUE_APP_APIURL + '/file/' + d.name,
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
