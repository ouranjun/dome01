<template>
  <div class="page">
    <span class="rem_time" style="color: orange; border: 1px solid orange;" @click="gotoPay">
      {{remaining}}
    </span>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  data () {
    return {
      countNum: 900,
      showAlert: false,
      alertText: null
    }
  },
  mounted () {
    this.countNum -= this.numTime
    this.remainingTime()
  },
  methods: {
    gotoPay () {
      Toast.fail('暂无法支付')
    },
    remainingTime () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.countNum--
        if (this.countNum === 0) {
          clearInterval(this.timer)
          Toast.fail('支付超时')
        }
      }, 1000)
    }
  },
  props: ['time'],
  computed: {
    // 转换时间成分秒
    remaining () {
      let minute = parseInt(this.countNum / 60)
      let second = parseInt(this.countNum % 60)
      if (minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second
      }
      return '去支付(还剩' + minute + '分' + second + '秒)'
    },
    // 订单返回时间秒分分别处理
    numTime () {
      if (this.time.toString().indexOf('分钟') !== -1) {
        return parseInt(this.time) * 60
      } else {
        return parseInt(this.time)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';
  .page {
    display: inline-block;
    .rem_time {
      @include sc(0.5rem, orange);
      padding: 0.1rem 0.2rem;
      border-radius: 0.15rem;
    }
  }
</style>
