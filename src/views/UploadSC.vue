<template lang="pug">
  #uploadSC
    b-container
      b-btn(@click="tomyimages") 您的檔案已經上傳成功，點擊此處前往「我的圖片」
      p 或是在下方直接編輯
      b-card(v-for="(image,index) in images" :key="index")
        b-row
          b-col(col cols="4")
            img(:src="image.src")
          b-col(col cols="8")
            table
              tr
                td
                  //- 隱私權
                  span(v-if="!image.edit" @click="edit(index)" style="color:#888") ({{image.privacy}})
                  b-form-select(v-else v-model="image.privacy" :options="privacyOp")
                td
              tr
                td
                  //- 標題
                  span#imgtitle(v-if="!image.edit" @click="edit(index)" style="font-size:30px") {{image.title}}
                  b-form-input(v-else v-model="image.title" @blur="update(index)")
                td
              tr
                td
                  //- 描述
                  span#imgdesc(v-if="!image.edit" @click="edit(index)") {{image.description}}
                  b-form-textarea(v-else v-model="image.description" @blur="update(index)")
                td
              tr
                td.text-right
                  b-btn(v-if="!image.edit" variant="light" @click="edit(index)")
                    font-awesome-icon(:icon="['far','edit']")
                  b-btn(variant="light" @click="del(index)")
                    font-awesome-icon(:icon="['far','trash-alt']")
            table
              tr
                td
                  span 圖片連結
                td
              tr
                td
                  span {{image.src}}
                td
                  b-button(type="button"
                  v-clipboard:copy="image.src"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError") 複製
              tr
                td
                  span HTML
                td
              tr
                td
                  span &lt;img src="{{image.src}}"&gt;
                td
                  b-button(type="button"
                  v-clipboard:copy="'<img src='+image.src+'>'"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError") 複製
              tr
                td
                  span Markdown
                td
              tr
                td
                  span ![]({{image.src}})
                td
                  b-button(type="button"
                  v-clipboard:copy="'![]('+image.src+')'"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError") 複製
        //- b-col(cols="12" v-for="(image,index) in images" :key="index")
        //-   b-card
        //-     b-row.inner
        //-       b-col.w-100(style="text-align:center")
        //-         b-card-img(:src="image.src")
        //-       div.w-100(style="height:1px")
        //-       b-col
        //-         b-card-body
        //-           table
        //-             tr
        //-               td
        //-                 //- 隱私權
        //-                 span(v-if="!image.edit" @click="edit(index)" style="color:#888") ({{image.privacy}})
        //-                 b-form-select(v-else v-model="image.privacy" :options="privacyOp")
        //-               td
        //-             tr
        //-               td
        //-                 //- 標題
        //-                 span#imgtitle(v-if="!image.edit" @click="edit(index)" style="font-size:30px") {{image.title}}
        //-                 b-form-input(v-else v-model="image.title" @blur="update(index)")
        //-               td
        //-             tr
        //-               td
        //-                 //- 描述
        //-                 span#imgdesc(v-if="!image.edit" @click="edit(index)") {{image.description}}
        //-                 b-form-textarea(v-else v-model="image.description" @blur="update(index)")
        //-               td
        //-             tr
        //-               td
        //-                 b-btn(v-if="!image.edit" variant="light" @click="edit(index)")
        //-                   font-awesome-icon(:icon="['far','edit']")
        //-               td
        //-                 b-btn(variant="light" @click="del(index)")
        //-                   font-awesome-icon(:icon="['far','trash-alt']")
        //-       b-col
        //-         b-card-footer
        //-           table
        //-             tr
        //-               td
        //-                 span 圖片連結
        //-               td
        //-             tr
        //-               td
        //-                 span {{image.src}}
        //-               td
        //-                 b-button(type="button"
        //-                 v-clipboard:copy="image.src"
        //-                 v-clipboard:success="onCopy"
        //-                 v-clipboard:error="onError") 複製
        //-             tr
        //-               td
        //-                 span HTML
        //-               td
        //-             tr
        //-               td
        //-                 span &lt;img src="{{image.src}}"&gt;
        //-               td
        //-                 b-button(type="button"
        //-                 v-clipboard:copy="'<img src='+image.src+'>'"
        //-                 v-clipboard:success="onCopy"
        //-                 v-clipboard:error="onError") 複製
        //-             tr
        //-               td
        //-                 span Markdown
        //-               td
        //-             tr
        //-               td
        //-                 span ![]({{image.src}})
        //-               td
        //-                 b-button(type="button"
        //-                 v-clipboard:copy="'![]('+image.src+')'"
        //-                 v-clipboard:success="onCopy"
        //-                 v-clipboard:error="onError") 複製

</template>

<script>
export default {
  data () {
    return {
      allimages: [],
      images: [],
      privacyOp: ['公開', '私人']
    }
  },
  methods: {
    clearStorage () {
      const localstorage = JSON.parse(localStorage.getItem('vuex'))
      this.images.length = 0
      localstorage.successUp.length = 0
      localStorage.setItem('vuex', JSON.stringify(localstorage))
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
    },
    update (index) {
      this.axios.patch(process.env.VUE_APP_APIURL + '/file/' + this.images[index]._id, { title: this.images[index].title, description: this.images[index].description, privacy: this.images[index].privacy })
        .then(response => {
          this.images[index].edit = false
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
    tomyimages () {
      this.$router.push('/myimages')
    }
  },
  computed: {
    imagesL () {
      const localstorage = JSON.parse(localStorage.getItem('vuex'))
      return localstorage.successUp
    },
    user () {
      return this.$store.getters.user
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_APIURL + '/author/' + this.user)
      .then(response => {
        this.allimages = response.data.result.map(d => {
          return {
            title: d.title,
            description: d.description,
            privacy: d.privacy,
            src: process.env.VUE_APP_APIURL + '/file/' + d.name,
            _id: d._id,
            edit: false,
            album: d.album
          }
        })
        for (const image of this.imagesL) {
          let idx = -1
          this.allimages.find(function (item, i) {
            if (item._id === image._id) {
              idx = i
            }
          })
          this.images.push(this.allimages[idx])
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
  },
  beforeRouteLeave (to, from, next) {
    this.clearStorage()
    this.$store.commit('successClean')
    next()
  }
}

</script>
