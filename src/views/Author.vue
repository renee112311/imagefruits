<template lang="pug">
  #author
    b-container
      div.up
        div#avatar
          img(v-if="avatar.length!==0" :src="this.avatar[0].src")
        h4 {{this.author}}
      div
        b-tabs
          b-tab.allimages(title='所有圖片' active)
            //- allimages
            p(v-if="this.images.length===0") 沒有圖片唷！
            b-row(v-else v-masonry transition-duration="0.3s" item-selector=".item")
              b-col.item(col cols="12" lg="3" v-for="(image,idx) in images" :key="idx" v-masonry-tile)
                b-card(v-b-modal.modal-img-public @click="showModal(idx)")
                  b-card-img(:src="image.src")
                  b-card-title {{image.title}}
          b-tab.albums(title='相簿')
            p(v-if="albums.length===0") 沒有任何相簿
            b-row(v-else)
              b-col(col cols="12" md="6" lg="2" v-for="(album, idx) in albums" :key="idx")
                b-card(@click="toMyalbum(idx)")
                  b-card-img(v-if="albumCover.length!==0" :src="albumCover[idx].src")
                  b-card-title(style="color:white;text-shadow:0 0 4px #333") {{album.title}}

          b-tab.aboutme(title='關於我')
            p {{this.description}}
            span 電話: 0900-000-000
            br
            span 信箱: abc12345@gmail.com
            br
            span 地址: 臺北市00區00路00巷00號
            br
            a(href="#")
              font-awesome-icon(:icon="['fab','facebook-square']" style="margin:30px 10px 20px 10px;font-size:30px")
            a(href="#")
              font-awesome-icon(:icon="['fab','twitter-square']" style="margin:30px 10px 20px 10px;font-size:30px")
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
              div.round(style="margin-bottom:10px")
                img(v-if="avatar.length!==0" :src="avatar[0].src")
              a(style="color:#777") {{images[index].user}}
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
      albums: [],
      albumCover: [],
      index: '0',
      albumindex: '0',
      description: '',
      avatar: [],
      userid: '',
      myfavorites: [],
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
    favorite () {
      if (!this.user) {
        this.$swal({
          title: '收藏失敗',
          text: '請先登入',
          icon: 'warning',
          confirmButtonText: '知道了'
        })
      } else {
        this.myfavorites.push(this.images[this.index]._id)
        this.axios.patch(process.env.VUE_APP_APIURL + '/users/edit/' + this.userid, { account: this.user, favorite: this.myfavorites })
          .then(response => {
            this.images[this.index].liked = true
            this.$swal({
              title: '收藏成功',
              icon: 'success',
              confirmButtonText: '知道了'
            })
          })
          .catch((error) => {
            console.log(error)
            this.$swal({
              title: '收藏失敗',
              text: '發生錯誤',
              icon: 'error',
              confirmButtonText: '知道了'
            })
          })
      }
    },
    unfavorite () {
      const searchindex = this.myfavorites.indexOf(this.images[this.index]._id)
      this.myfavorites.splice(searchindex, 1)
      this.axios.patch(process.env.VUE_APP_APIURL + '/users/edit/' + this.userid, { account: this.user, favorite: this.myfavorites })
        .then(response => {
          this.images[this.index].liked = false
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
      for (const myfavorite of this.myfavorites) {
        console.log(myfavorite)
        let index = -1
        this.images.find(function (item, i) {
          if (item._id === myfavorite) {
            index = i
          }
        })
        if (index !== -1 && index !== undefined) {
          this.images[index].liked = true
        }
      }
    },
    toMyalbum (idx) {
      this.albumindex = idx
      this.$store.commit('album', this.albums[this.albumindex].title)
      this.$router.push('/authoralbum')
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
    // allimages
    this.axios.get(process.env.VUE_APP_APIURL + '/author/' + this.author)
      .then(response => {
        const result = response.data.result.filter(i => i.privacy === '公開')
        this.images = result.map(d => {
          return {
            title: d.title,
            description: d.description,
            src: process.env.VUE_APP_APIURL + '/file/' + d.name,
            _id: d._id,
            user: d.user,
            liked: false
          }
        })
        for (const album of this.albums) {
          const idx = []
          const albumtitle = album.title
          this.images.find(function (item, i) {
            if (item.album === albumtitle) {
              idx.push(i)
            }
          })
          console.log(idx)
          if (idx !== null && idx.length !== 0) {
            this.albumCover.push(this.images[idx[0]].src)
          }
        }
        console.log(this.albumCover)
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: '發生錯誤',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      })
    // 相簿
    this.axios.get(process.env.VUE_APP_APIURL + '/albums/' + this.author)
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
    // 作者資料
    this.axios.get(process.env.VUE_APP_APIURL + '/users/' + this.author)
      .then(response => {
        const result = response.data.result[0]
        this.description = result.description
      })
      .catch((error) => {
        console.log(error)
        this.$swal({
          title: '發生錯誤',
          icon: 'error',
          confirmButtonText: '知道了'
        })
      })
    if (this.user !== undefined && this.user.length !== 0) {
      this.axios.get(process.env.VUE_APP_APIURL + '/users/' + this.user)
        .then(response => {
          const result = response.data.result[0]
          if (result === undefined) {

          } else {
            this.userid = result._id
            this.myfavorites = result.favorite
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
    }

    setTimeout(() => {
      this.likedOrnot()
    }, 100)
  },
  beforeRouteLeave (to, from, next) {
    this.showModalTF = false
    next()
  }
}
</script>
