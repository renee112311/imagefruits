<template lang="pug">
  #myfav
    b-container
      h3 我的收藏
      p(v-if="this.images.length===0") 沒有任何收藏
      b-row(v-else v-masonry transition-duration="0.3s" item-selector=".item")
        b-col.item(col cols="12" lg="3" v-for="(image,idx) in images" :key="idx" v-masonry-tile)
          b-card(v-b-modal.modal-img-public @click="showModal(idx)")
            b-card-img(:src="image.src")
            b-card-title(style="color:white;text-shadow:0 0 4px #333") {{image.title}}
    //- Modal
    b-modal#modal-img-public(size="xl" hide-footer hide-header v-if="images.length!==0&&showModalTF")
      b-btn#goFront(variant="light" @click="showModal(index-1)") <<
      b-btn#goForw(variant="light" @click="showModal(index+1)") >>
      div.inner
        b-row
          b-col(col cols="12" md="9")
            div.cardimg
              b-card-img(:src="images[index].src")
            b-card-body
          b-col(col cols="12" md="3")
            //- 標題
            b-card-title {{images[index].title}}
            //- 描述
            b-card-text {{images[index].description}}
            span.heart(v-if="images[index].liked" @click="unfavorite")
              font-awesome-icon(:icon="['fas','heart']")
              span.position-absolute(style="bottom:-70%;left:0;font-size:18px") 點擊取消
            span.heart(v-else @click="favorite")
              font-awesome-icon(:icon="['far','heart']")
              span.position-absolute(style="bottom:-70%;left:0;font-size:18px") 點擊收藏
            //- 作者
            div
              span(style="color:#777") BY
              div.round(@click="toAuthor" style="margin-bottom:10px")
                img(v-if="avatar.length!==0" :src="avatar[0].src")
              a(@click="toAuthor" style="color:#777") {{images[index].user}}
            //- 分享
            div
              p(style="padding-left:10px") 分享至：
              font-awesome-icon(:icon="['fab','facebook-square']" style="margin:0 10px 20px 10px;font-size:30px")
              font-awesome-icon(:icon="['fab','twitter-square']" style="margin:0 10px 20px 10px;font-size:30px")
</template>

<script>
export default {
  data () {
    return {
      images: [],
      index: '0',
      userid: '',
      myfavorites: [],
      avatar: [{ src: '000' }],
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
      this.$store.commit('author', this.images[this.index].user)
      // avatar
      this.axios.get(process.env.VUE_APP_APIURL + '/avatar/' + this.author)
        .then(response => {
          this.avatar = response.data.result.map(d => {
            return {
              src: process.env.VUE_APP_APIURL + '/avatar/image/' + d.name
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
    toAuthor () {
      if (this.images[this.index].user !== 'none') {
        this.$store.commit('author', this.images[this.index].user)
        this.$router.push('/author')
      }
    },
    unfavorite () {
      this.myfavorites.splice(this.index, 1)
      this.axios.patch(process.env.VUE_APP_APIURL + '/users/edit/' + this.userid, { account: this.user, favorite: this.myfavorites })
        .then(response => {
          this.images.splice(this.index, 1)
        })
        .catch((error) => {
          console.log(error)
          this.$swal({
            title: '取消失敗',
            text: '發生錯誤',
            icon: 'error',
            confirmButtonText: '知道了'
          })
        })
    },
    likedOrnot () {
      for (var myfavorite of this.myfavorites) {
        var index = -1
        this.images.find(function (item, i) {
          if (item._id === myfavorite) {
            index = i
          }
        })
        this.images[index].liked = true
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    author () {
      return this.$store.getters.author
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/users/' + this.user)
      .then(response => {
        const result = response.data.result[0]
        this.userid = result._id
        this.myfavorites = result.favorite
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: '發生錯誤',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      })
    this.axios.get(process.env.VUE_APP_APIURL + '/')
      .then(response => {
        const result = []
        for (let i = 0; i < this.myfavorites.length; i++) {
          let index = -1
          const myfavorite = this.myfavorites[i]
          response.data.result.find(function (item, j) {
            if (item._id === myfavorite) {
              index = j
            }
          })
          if (index === -1) {
            this.myfavorites.splice(i, 1)
            this.axios.patch(process.env.VUE_APP_APIURL + '/users/edit/' + this.userid, { account: this.user, favorite: this.myfavorites })
              .then(response => {

              })
              .catch((error) => {
                console.log(error)
                this.$swal({
                  title: '取消失敗',
                  text: '發生錯誤',
                  icon: 'error',
                  confirmButtonText: '知道了'
                })
              })
          } else {
            result.push(response.data.result[index])
          }
        }
        this.images = result.map(d => {
          return {
            title: d.title,
            description: d.description,
            src: process.env.VUE_APP_APIURL + '/file/' + d.name,
            _id: d._id,
            user: d.user,
            liked: true
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
