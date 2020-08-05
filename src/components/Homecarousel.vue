<template lang="pug">
  #homecarousel
    b-carousel#carousel-fade(
      style='text-shadow: 0px 0px 2px #000'
      fade
      :interval="6000"
      controls
      )
      b-carousel-slide(:img-src="carouselimg[0].src")
      b-carousel-slide(:img-src="carouselimg[1].src")
      b-carousel-slide(:img-src="carouselimg[2].src")
      b-carousel-slide(:img-src="carouselimg[3].src")
    textra(:data='words' :timer="5" :infinite='true' filter="top-bottom")
</template>

<script>
export default {
  data () {
    return {
      words: ['最容易使用的圖床', '最廣泛的交流平台', '最舒適的展示空間', '立即加入水果拼盤'],
      carouselimg: []
    }
  },
  computed: {
  },
  mounted () {
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
