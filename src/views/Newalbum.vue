<template lang="pug">
  #newalbum
    b-container
      h3 新增相簿
      p 尚未被列入相簿的圖片：
      b-btn(@click="selectCancel") 取消選取
      p(v-if="images.length===0") 沒有任何圖片，快去上傳吧
      b-row(v-else)
        b-col(col cols="12" lg="2" v-for="(image,idx) in images" :key="idx")
          b-card(@click="multiselect(idx)")
            img.berry(v-if="image.checked" src="../assets/berry.png")
            b-card-img(:src="image.src")

      b-form(@submit="createAlbum")
        b-form-input(
            v-model="title"
            placeholder="相簿標題"
            @input="validateText"
            :state="titlestate"
          )
        b-form-textarea(
            v-model="description"
            placeholder="相簿說明"
            rows="3" max-rows="6"
            maxlength="200"
            @input="validateText"
            :state="descstate"
          )
          br
        b-button(type="createAlbum") 新增相簿
</template>

<script>
export default {
  data () {
    return {
      title: '',
      description: '',
      index: '0',
      images: [],
      options: [],
      titlestate: null,
      descstate: null
    }
  },
  methods: {
    validateText () {
      if (this.title.length > 20) {
        this.titlestate = false
      } else {
        this.titlestate = true
      }
      if (this.description.length > 150) {
        this.descstate = false
      } else {
        this.descstate = true
      }
    },
    selectCancel () {
      this.options.length = 0
      for (var image of this.images) {
        image.checked = false
      }
    },
    createAlbum (event) {
      event.preventDefault()
      if (this.title.length > 20) {
        this.$swal({
          title: '新增失敗',
          text: '相簿標題格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      } else if (this.description.length > 150) {
        this.$swal({
          title: '新增失敗',
          text: '相簿說明格式不符',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      }
      for (var checked of this.options) {
        this.axios.patch(process.env.VUE_APP_APIURL + '/file/' + checked._id, { album: this.title })
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
      this.axios.post(process.env.VUE_APP_APIURL + '/albums',
        { user: this.user, title: this.title, description: this.description }
      )
        .then(response => {
          const data = response.data
          if (data.success) {
            this.$router.push('/myimages')
          } else {
            this.$swal({
              title: '發生錯誤',
              text: data.message,
              icon: 'error',
              confirmButtonText: '知道了'
            })
          }
        })
        .catch(() => {
          this.$swal({
            title: '發生錯誤',
            icon: 'error',
            confirmButtonText: '知道了'
          })
        })
    },
    multiselect (idx) {
      if (!this.images[idx].checked) {
        this.options.push(this.images[idx])
        this.images[idx].checked = true
      } else {
        this.options.splice(this.options.indexOf(this.images[idx]), 1)
        this.images[idx].checked = false
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/author/' + this.user)
      .then(response => {
        const result = response.data.result.filter(i => i.album === 'null')
        this.images = result.map(d => {
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
  }
}
</script>
