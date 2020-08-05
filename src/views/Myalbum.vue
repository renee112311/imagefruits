<template lang="pug">
  #myalbum
    b-container
      span(@click="tomyimages" style="cursor:pointer;margin-bottom:1.5rem;font-size:18px") <<返回「我的圖片」
      div#albumCover
        img(v-if="images[0]!==undefined" :src="images[0].src")
        b-form-input(v-if="edit" v-model="model_titl")
        h3(v-else) {{this.title}}
        b-form-textarea(v-if="edit" v-model="model_des")
        p(v-else) {{this.description}}

      div(v-if="this.select")
        b-btn(@click="multidelete") 一併刪除
        b-btn(@click="selectCancel") 取消選取
        p(v-if="images.length===0") 沒有任何圖片，快去上傳吧
        b-row(v-else)
          b-col(col cols="12" lg="3" v-for="(image,idx) in images" :key="idx")
            b-card(@click="multiselect(idx)")
              img.berry(v-if="image.checked" src="../assets/berry.png")
              b-card-img(:src="image.src")
      //- allimages
      div(v-else)
        b-btn(v-if="edit" @click="selectOpen") 選取
        b-btn(v-if="edit" v-b-modal.modal-addNewImage) 新增圖片
        b-btn(v-else @click="editAlbum") 編輯相簿

        b-btn(v-if="edit" @click="updateAlbum") 儲存修改
        b-btn(v-if="edit" @click="cancelAlbum") 取消修改
        b-btn(v-else @click="deleteAlbum") 刪除相簿

        p(v-if="images.length===0") 沒有任何圖片，快去上傳吧
        b-row.notinselect(v-else v-masonry transition-duration="0.3s" item-selector=".item")
          b-col.item(col cols="12" lg="3" v-for="(image,idx) in images" :key="idx" v-masonry-tile)
            b-card(v-b-modal.modal-img @click="showModal(idx)")
              b-card-img(:src="image.src")
              b-card-title(style="color:white;text-shadow:0 0 4px #333") {{image.title}}

      //- Modal
      b-modal#modal-img(size="xl" hide-footer hide-header v-if="images.length!==0&&showModalTF")
        b-btn#goFront(variant="light" @click="showModal(index-1)") <<
        b-btn#goForw(variant="light" @click="showModal(index+1)") >>
        div.inner
          b-button.d-block.d-sm-none(size="sm" @click="$bvModal.hide('modal-img')") X
          b-row
            b-col.w-100(style="text-align:center")
              b-card-img(:src="images[index].src")
            div.w-100(style="height:1px")
            b-col
              b-card-body
                table
                  tr
                    td
                      //- 隱私權
                      span(v-if="!images[index].edit" @click="editimg(index)" style="color:#888") ({{images[index].privacy}})
                      b-form-select(v-else v-model="images[index].model_privacy" :options="privacyOp")
                    td
                  tr
                    td
                      //- 標題
                      span#imgtitle(v-if="!images[index].edit" @click="editimg(index)" style="font-size:30px") {{images[index].title}}
                      b-form-input(v-else v-model="images[index].model_titl" @blur="update(index)")
                    td
                  tr
                    td
                      //- 描述
                      span#imgdesc(v-if="!images[index].edit" @click="editimg(index)") {{images[index].description}}
                      b-form-textarea(v-else v-model="images[index].model_des" @blur="update(index)")
                    td
                  tr
                    td
                      b-btn(v-if="!images[index].edit" variant="light" @click="edit(index)")
                        font-awesome-icon(:icon="['far','edit']")
                    td
                      b-btn(variant="light" @click="del(index)")
                        font-awesome-icon(:icon="['far','trash-alt']")
            b-col
              b-card-footer
                table
                  tr
                    td
                      span 圖片連結
                    td
                  tr
                    td.d-none.d-xl-table-cell(width="50%")
                      span {{images[index].src}}
                    td
                      b-button(type="button"
                      v-clipboard:copy="images[index].src"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError") 複製
                  tr
                    td
                      span HTML
                    td
                  tr
                    td.d-none.d-xl-table-cell(width="50%")
                      span &lt;img src="{{images[index].src}}"&gt;
                    td
                      b-button(type="button"
                      v-clipboard:copy="'<img src='+images[index].src+'>'"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError") 複製
                  tr
                    td
                      span Markdown
                    td
                  tr
                    td.d-none.d-xl-table-cell(width="50%")
                      span ![]({{images[index].src}})
                    td
                      b-button(type="button"
                      v-clipboard:copy="'![]('+images[index].src+')'"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError") 複製

      //- 新增圖片
      b-modal#modal-addNewImage(size="xl" hide-footer)
        p 尚未被列入相簿的圖片：
        b-btn(@click="selectCancel2") 取消選取
        b-btn(@click="addImages") 加入到相簿
        p(v-if="newImages.length===0") 沒有任何圖片，快去上傳吧
        b-row(v-else)
          b-col(col cols="12" lg="3" v-for="(newImage,idx) in newImages" :key="idx")
            b-card(@click="multiselect2(idx)")
              img.berry(v-if="newImage.checked" src="../assets/berry.png")
              b-card-img(:src="newImage.src")

</template>

<script>
export default {
  data () {
    return {
      title: '',
      description: '',
      model_titl: '',
      model_des: '',
      id: '',
      images: [],
      newImages: [],
      options: [],
      albums: null,
      index: '0',
      select: false,
      edit: false,
      privacyOp: ['公開', '私人'],
      showModalTF: false
    }
  },
  methods: {
    showModal (idx) {
      this.showModalTF = true
      if (idx < 0) {
        this.index = this.images.length - 1
      } else if (idx === this.images.length) {
        this.index = 0
      } else {
        this.index = idx
      }
    },
    validateText () {
      if (this.description.length > 150) {
        this.textstate = false
      } else {
        this.textstate = true
      }
    },
    editAlbum () {
      this.edit = true
    },
    updateAlbum () {
      this.axios.patch(process.env.VUE_APP_APIURL + '/albums/' + this.id,
        { title: this.model_titl, description: this.model_des })
        .then(response => {
          this.edit = false
          this.title = this.model_titl
          this.description = this.model_des
          this.$store.commit('album', this.title)
        })
        .catch(() => {
          this.$swal({
            title: '發生錯誤',
            icon: 'error',
            confirmButtonText: '知道了'
          })
        })
      for (let i = 0; i < this.images.length; i++) {
        this.axios.patch(process.env.VUE_APP_APIURL + '/file/' + this.images[i]._id, { album: this.model_titl })
          .then(response => {

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
    cancelAlbum () {
      this.edit = false
      this.model_titl = this.title
      this.model_des = this.description
    },
    deleteAlbum () {
      this.$swal.fire({
        title: '確定要刪除相簿？?',
        text: '圖片本身不會被刪除',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then((result) => {
        if (result.value) {
          this.axios.delete(process.env.VUE_APP_APIURL + '/albums/' + this.id)
            .then(response => {
              for (let i = 0; i < this.images.length; i++) {
                this.axios.patch(process.env.VUE_APP_APIURL + '/file/' + this.images[i]._id, { album: 'null' })
                  .then(response => {

                  })
                  .catch(() => {
                    this.$swal({
                      title: '發生錯誤',
                      icon: 'error',
                      confirmButtonText: '知道了'
                    })
                  })
              }
              this.$router.push('/myimages')
            })
            .catch(() => {
              this.$swal({
                title: '發生錯誤',
                icon: 'error',
                confirmButtonText: '知道了'
              })
            })
        }
      })
    },
    editimg (index) {
      this.images[index].edit = true
      this.images[index].model_titl = this.images[index].title
      this.images[index].model_des = this.images[index].description
    },
    update (index) {
      this.axios.patch(process.env.VUE_APP_APIURL + '/file/' + this.images[index]._id, { title: this.images[index].model_titl, description: this.images[index].model_des, privacy: this.images[index].model_privacy })
        .then(response => {
          this.images[index].edit = false
          this.images[index].title = this.images[index].model_titl
          this.images[index].description = this.images[index].model_des
          this.images[index].privacy = this.images[index].model_privacy
        })
        .catch(() => {
          this.$swal({
            title: '發生錯誤',
            icon: 'error',
            confirmButtonText: '知道了'
          })
        })
    },
    del (index) {
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
    onCopy: function (e) {
      this.$swal({
        title: '已複製到剪貼簿',
        icon: 'success',
        confirmButtonText: '知道了'
      })
    },
    onError: function (e) {
      this.$swal({
        title: '發生錯誤',
        icon: 'error',
        confirmButtonText: '知道了'
      })
    },
    selectOpen () {
      this.select = true
      this.edit = false
    },
    selectCancel () {
      this.select = false
      this.options.length = 0
      for (var image of this.images) {
        image.checked = false
      }
    },
    selectCancel2 () {
      this.options.length = 0
      for (var newImage of this.newImages) {
        newImage.checked = false
      }
    },
    multiselect (idx) {
      if (!this.images[idx].checked) {
        this.options.push(this.images[idx])
        this.images[idx].checked = true
      } else {
        this.options.splice(this.options.indexOf(this.images[idx]), 1)
        this.images[idx].checked = false
      }
    },
    multiselect2 (idx) {
      if (!this.newImages[idx].checked) {
        this.options.push(this.newImages[idx])
        this.newImages[idx].checked = true
      } else {
        this.options.splice(this.options.indexOf(this.newImages[idx]), 1)
        this.newImages[idx].checked = false
      }
    },
    multidelete () {
      for (let i = 0; i < this.options.length; i++) {
        this.axios.patch(process.env.VUE_APP_APIURL + '/file/' + this.options[i]._id, { album: 'null' })
          .then(response => {
            this.select = false
            this.options.length = 0
            location.reload()
            for (const image of this.images) {
              image.checked = false
            }
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
    addImages () {
      for (let i = 0; i < this.options.length; i++) {
        this.axios.patch(process.env.VUE_APP_APIURL + '/file/' + this.options[i]._id, { album: this.album })
          .then(response => {
            this.select = false
            this.options.length = 0
            for (var newImage of this.newImages) {
              newImage.checked = false
            }
            location.reload()
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
    tomyimages () {
      this.$router.push('/myimages')
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    album () {
      return this.$store.getters.album
    }
  },
  mounted () {
    // allimages
    this.axios.get(process.env.VUE_APP_APIURL + '/author/' + this.user)
      .then(response => {
        const result = response.data.result.filter(obj => obj.album === this.album)
        this.images = result.map(d => {
          return {
            title: d.title,
            description: d.description,
            privacy: d.privacy,
            src: process.env.VUE_APP_APIURL + '/file/' + d.name,
            _id: d._id,
            checked: false,
            edit: false,
            model_titl: d.title,
            model_des: d.description,
            model_privacy: d.privacy,
            album: d.album
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
    // albumdata
    this.axios.get(process.env.VUE_APP_APIURL + '/albums/' + this.user)
      .then(response => {
        var result = response.data.result.filter(obj => obj.title === this.album)
        this.albums = result.map(d => {
          return {
            title: d.title,
            description: d.description,
            _id: d._id,
            model_titl: d.title,
            model_des: d.description
          }
        })
        result = result[0]
        this.title = result.title
        this.description = result.description
        this.id = result._id
        this.model_titl = result.title
        this.model_des = result.description
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: '發生錯誤',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      })
    // 未被列入相簿的圖片
    this.axios.get(process.env.VUE_APP_APIURL + '/author/' + this.user)
      .then(response => {
        const result = response.data.result.filter(i => i.album === 'null')
        this.newImages = result.map(d => {
          return {
            title: d.title,
            desc: d.description,
            src: process.env.VUE_APP_APIURL + '/file/' + d.name,
            _id: d._id,
            album: d.album,
            checked: false
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
  },
  beforeRouteLeave (to, from, next) {
    this.showModalTF = false
    next()
  }
}
</script>
