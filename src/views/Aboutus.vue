<template lang="pug">
  #aboutus
    b-container(v-scrollanimation)
      a(@click="tohome" style="cursor:pointer") <<回首頁
      h3 關於imagefruits
      b-row
        b-col(col cols="12" lg="6")
          p(style="line-height:3rem") 盤子上頭裝滿來自各地、各種味道的美果，就如各種領域的創作者都能提供觀者前所未有的獨特感受。我們建立imagefruits讓形形色色的影像創作在此流通，任何題材、創意、發想都能放進來。
          br
          p(style="line-height:3rem;color:#f25c78") imagefruits是自由的，想怎麼用，就怎麼用。
          br
          br
          div.alinks
            a 使用條款
            a 隱私權
            a 支援
            a 徵才
        b-col(col cols="12" lg="6")
          img(src="../assets/fruit2.jpg")
</template>
<script>
export default {
  data () {
    return {
      aboutus: ''
    }
  },
  methods: {
    tohome () {
      this.$router.push('/')
    }
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
