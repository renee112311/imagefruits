<template lang="pug">
  #homewater
    //- search
    b-row.searchrow(v-scrollanimation)
      b-col(col cols="12" xl="3")
        b-form-select.form-control(v-model="searchType")
          option 圖片標題
          option 作者帳號
      b-col(col cols="12" xl="9")
        b-nav-form#searchBar
          b-form-input(type="text" size="sm" v-model="keywords" placeholder="輸入關鍵字即可搜尋")

    //- images
    p(v-if="this.search.length===0&&this.searchType === '圖片標題'" v-scrollanimation) 沒有標題包含「{{this.keywords}}」的圖片唷！
    p(v-if="this.search.length===0&&this.searchType === '作者帳號'" v-scrollanimation) 沒有作者帳號包含「{{this.keywords}}」的圖片唷！
    b-row(v-if="this.search.length!==0" v-masonry transition-duration="1s" item-selector=".item" v-scrollanimation)
      b-col.item(col cols="12" lg="3" v-for="(image,idx) in search" :key="idx" v-masonry-tile)
        b-card(v-b-modal.modal-img-public @click="showModal(idx)")
          b-card-img(:src="image.src")
          b-card-title {{image.title}}
    //- Modal
    b-modal#modal-img-public(size="xl" hide-footer hide-header v-if="search.length!==0&&showModalTF")
      b-btn#goFront(variant="light" @click="showModal(index-1)") <<
      b-btn#goForw(variant="light" @click="showModal(index+1)") >>
      div.inner
        b-row
          b-col(col cols="12" md="9")
            div.cardimg
              b-card-img(:src="search[index].src")
            b-card-body
          b-col(col cols="12" md="3")
            //- 標題
            b-card-title {{search[index].title}}
            //- 描述
            b-card-text {{search[index].description}}
            //- 愛心
            span.heart(v-if="search[index].liked" @click="unfavorite")
              font-awesome-icon(:icon="['fas','heart']")
              span.position-absolute(style="bottom:-70%;left:0;font-size:18px") 點擊取消
            span.heart.position-relative(v-else @click="favorite")
              font-awesome-icon(:icon="['far','heart']")
              span.position-absolute(style="bottom:-70%;left:0;font-size:18px") 點擊收藏
            //- 作者
            div
              span(style="color:#777") BY
              div.round(@click="toAuthor" style="margin-bottom:10px")
                img(v-if="avatar.length!==0" :src="avatar[0].src")
              a(@click="toAuthor" style="color:#777") {{search[index].user}}
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
      keywords: '',
      userid: '',
      myfavorites: [],
      avatar: [{ src: '000' }],
      searchType: '圖片標題',
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
      this.$store.commit('author', this.search[this.index].user)
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
      this.showModalTF = false
      this.$store.commit('author', this.images[this.index].user)
      this.$router.push('/author')
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
        this.myfavorites.push(this.search[this.index]._id)
        this.axios.patch(process.env.VUE_APP_APIURL + '/users/edit/' + this.userid, { favorite: this.myfavorites })
          .then(response => {
            this.search[this.index].liked = true
            for (var myfavorite of this.myfavorites) {
              var index = -1
              this.search.find(function (item, i) {
                if (item._id === myfavorite) {
                  index = i
                }
              })
              this.search[index].liked = true
            }
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
      const searchindex = this.myfavorites.indexOf(this.search[this.index]._id)
      this.myfavorites.splice(searchindex, 1)
      this.axios.patch(process.env.VUE_APP_APIURL + '/users/edit/' + this.userid, { favorite: this.myfavorites })
        .then(response => {
          this.search[this.index].liked = false
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
        this.search.find(function (item, i) {
          if (item._id === myfavorite) {
            index = i
          }
        })
        this.search[index].liked = true
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    author () {
      return this.$store.getters.author
    },
    search () {
      if (this.keywords !== '') {
        this.keywords.toLowerCase()
        var pattern = new RegExp(this.keywords)
        if (this.searchType === '圖片標題') {
          return this.images.filter(i => pattern.test(i.title.toLowerCase()))
        } else if (this.searchType === '作者帳號') {
          return this.images.filter(i => pattern.test(i.user.toLowerCase()))
        } else {
          return this.images
        }
      } else {
        return this.images
      }
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/')
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

<style lang="stylus">
  .before-enter
    opacity 0
    transform translateY(100px)
    transition all 1s ease

  .enter
    opacity 1
    transform translateY(0px)

</style>
