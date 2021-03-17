<template>
  <div class="back-top" @click="backtop" v-show="showBackTop">
    <img src="../../../images/back-top.png" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    showBackTop: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    backtop () {
      const timer = setInterval(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        document.body.scrollTop = scrollTop - 300
        document.documentElement.scrollTop = scrollTop - 300
        if (scrollTop === 0) {
          clearInterval(timer)
        }
      }, 20)
    }
  }
}
</script>

<style lang="scss" scoped>
  .back-top {
    position: fixed;
    bottom: 2.4rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    img {
      width: 100%;
    }
  }
</style>
