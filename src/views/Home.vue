<template lang="pug">
  #home
    Homecarousel
    b-container
      h1(v-scrollanimation) 盤子上有什麼？
      Homewater
      go-top(:size="60" :bottom="50")

</template>

<script>
import Homecarousel from '../components/Homecarousel.vue'
import Homewater from '../components/Homewater.vue'
import GoTop from '@inotom/vue-go-top'
export default {
  name: 'Home',
  components: {
    Homecarousel,
    Homewater,
    GoTop
  },
  computed: {
    user () {
      return this.$store.getters.user
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
