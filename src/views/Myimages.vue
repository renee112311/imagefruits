<template lang="pug">
  #myimages
    b-container
      h3 我的圖片
      b-card(no-body)
        b-tabs
          b-tab#allimages(title='所有圖片' active)
            //- 開啟多選
            div.inner(v-if="this.select")
              b-btn(@click="multidelete") 一併刪除
              b-btn(@click="selectCancel") 取消選取
              p(v-if="images.length===0") 沒有任何圖片，快去上傳吧
              b-row(v-else)
                b-col(col cols="12" lg="2" v-for="(image,idx) in images" :key="idx")
                  b-card(@click="multiselect(idx)")
                    img.berry(v-if="image.checked" src="../assets/berry.png")
                    b-card-img(:src="image.src")
            //- allimages
            div.inner(v-else)
              b-btn(@click="selectOpen") 選取
              p(v-if="images.length===0") 沒有任何圖片，快去上傳吧
              b-row.notinselect(v-else)
                b-col(col cols="12" lg="2" v-for="(image,idx) in images" :key="idx")
                  b-card(v-b-modal.modal-img @click="showModal(idx)")
                    b-card-img(:src="image.src")
                    b-card-title(style="color:white;text-shadow:0 0 4px #333") {{image.title}}

          b-tab(title='所有相簿')
            div.inner
              b-btn(@click="toNewalbum") 新增相簿
              p(v-if="albums.length===0") 沒有任何相簿唷
              b-row.allalbums(v-else)
                b-col(col cols="12" md="6" lg="2" v-for="(album, idx) in albums" :key="idx")
                  b-card(@click="toMyalbum(idx)")
                    b-card-img(v-if="albumCover[idx]!==undefined" :src="albumCover[idx]")
                    b-card-title(style="color:white;text-shadow:0 0 4px #333") {{album.title}}
      div.mask
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
            b-col(col cols="4")
              b-card-body
                table
                  tr
                    td
                      //- 隱私權
                      span(v-if="!images[index].edit" @click="edit(index)" style="color:#888") ({{images[index].privacy}})
                      b-form-select(v-else v-model="images[index].model_privacy" :options="privacyOp")
                    td
                  tr
                    td
                      //- 標題
                      span#imgtitle(v-if="!images[index].edit" @click="edit(index)" style="font-size:30px") {{images[index].title}}
                      b-form-input(v-else v-model="images[index].model_titl" @blur="update(index)")
                    td
                  tr
                    td
                      //- 描述
                      span#imgdesc(v-if="!images[index].edit" @click="edit(index)") {{images[index].description}}
                      b-form-textarea(v-else v-model="images[index].model_des" @blur="update(index)")
                    td
                  tr
                    td
                      b-btn(v-if="!images[index].edit" variant="light" @click="edit(index)")
                        font-awesome-icon(:icon="['far','edit']")
                    td
                      b-btn(variant="light" @click="del(index)")
                        font-awesome-icon(:icon="['far','trash-alt']")
            b-col(col cols="8")
              b-card-footer
                table
                  tr
                    td
                      span 圖片連結
                    td
                  tr
                    td.d-none.d-xl-table-cell
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
                    td.d-none.d-xl-table-cell
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
                    td.d-none.d-xl-table-cell
                      span ![]({{images[index].src}})
                    td
                      b-button(type="button"
                      v-clipboard:copy="'![]('+images[index].src+')'"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError") 複製

</template>

<script>
export default {
  data () {
    return {
      description: '',
      images: [],
      albums: [],
      albumCover: [],
      index: '0',
      select: false,
      options: [],
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
    edit (index) {
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
    multidelete () {
      for (const checked of this.options) {
        this.axios.delete(process.env.VUE_APP_APIURL + '/file/' + checked._id)
          .then(response => {
            const findindex = this.images.findIndex(obj => obj._id === checked._id)
            this.images.splice(findindex, 1)
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
    },
    selectCancel () {
      this.select = false
      this.options.length = 0
      for (const image of this.images) {
        image.checked = false
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
    toNewalbum () {
      this.$router.push('/Newalbum')
    },
    toMyalbum (idx) {
      this.index = idx
      this.$store.commit('album', this.albums[this.index].title)
      this.$router.push('/myalbum')
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  mounted () {
    // allalbums
    this.axios.get(process.env.VUE_APP_APIURL + '/albums/' + this.user)
      .then(response => {
        this.albums = response.data.result.map(d => {
          return {
            title: d.title,
            description: d.description
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
    // allimages
    this.axios.get(process.env.VUE_APP_APIURL + '/author/' + this.user)
      .then(response => {
        this.images = response.data.result.map(d => {
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
        for (const album of this.albums) {
          const idx = []
          this.images.find(function (item, i) {
            if (item.album === album.title) {
              idx.push(i)
            }
          })
          if (this.images[idx[0]] !== undefined && idx !== null) {
            this.albumCover.push(this.images[idx[0]].src)
          }
        }
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
  },
  beforeRouteLeave (to, from, next) {
    this.showModalTF = false
    next()
  }
}
</script>
