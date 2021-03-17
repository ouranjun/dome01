<template>
  <div class="rating_page">
    <head-top head-title="在线支付" go-back="true"></head-top>
    <section class="show_time_amount">
      <section>
        <header class="time_last">剩余支付时间</header>
        <p class="time">{{remaining}}</p>
        <footer class="order_detail" v-if="payDetail.resultData">
          <span>详情</span>
          <span>¥ {{cartPrice&&cartPrice.toFixed(2) || payDetail.resultData.orderInfo.orderAmount&&(payDetail.resultData.orderInfo.orderAmount/100).toFixed(2)}}</span>
        </footer>
      </section>
    </section>
    <div class="pay_way">选择支付方式</div>
    <section class="pay_way_list">
      <section class="pay_item">
        <div class="pay_icon_container">
          <div class="zhifubao"></div>
          <span>支付宝</span>
        </div>
        <svg class="choose_icon" @click="payWay = 1" :class="{choosed_way: payWay == 1}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
      </section>
      <section class="pay_item">
        <div class="pay_icon_container">
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#weixin"></use>
          </svg>
          <span>微信</span>
        </div>
        <svg class="choose_icon" @click="payWay = 2" :class="{choosed_way: payWay == 2}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
      </section>
    </section>
    <p class="determine" @click="confrimPay">确认支付</p>
  </div>
</template>

<script>
import headTop from '@/components/header/header'
import { Toast } from 'vant'
export default {
  data () {
    return {
      payDetail: false, // 付款信息详情
      payWay: 1, // 付款方式
      countNum: 900 // 倒计时15分钟
    }
  },
  components: {
    headTop
  },
  computed: {
    remaining: function () {
      let minute = parseInt(this.countNum / 60)
      if (minute < 10) {
        minute = '0' + minute
      }
      let second = parseInt(this.countNum % 60)
      if (second < 10) {
        second = '0' + second
      }
      return '00: ' + minute + ':' + second
    }
  },
  mounted () {
    this.remainingTime()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    confrimPay () {
      Toast.fail('无法支付')
    },
    // 倒计时
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
  }
}
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    .rating_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 206;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .show_time_amount{
      background-color: #fff;
      padding: .7rem;
      text-align: center;
      .time_last{
            @include sc(.6rem, #666);
            margin-top: 1rem;
        }
        .time{
            @include sc(1.5rem, #333);
            margin: .3rem 0 1rem;
        }
        .order_detail{
            @include fj;
            span{
                @include sc(.65rem, #666);
            }
            span:nth-of-type(2){
                color: #ff6000;
                font-weight: bold;
            }
        }
    }
    .pay_way{
        background-color: #f1f1f1;
        padding: 0 .7rem;
        @include sc(.7rem, #666);
        line-height: 1.8rem;
    }
    .pay_way_list{
        background-color: #fff;
        .pay_item{
            padding: .4rem .7rem;
            @include fj;
            align-items: center;
            line-height: 2.6rem;
            border-bottom: 0.025rem solid #f5f5f5;
            .pay_icon_container{
                @include fj;
                align-items: center;
                .zhifubao{
                    @include wh(2rem, 2rem);
                    background: url(../../../images/zhifubao.png) no-repeat;
                    background-size: 100% 100%;
                    margin-right: .2rem;
                }
                svg{
                    @include wh(2rem, 2rem);
                    margin-right: .3rem;
                }
                span{
                    @include sc(.7rem, #666);
                }
            }
            .choose_icon{
                @include wh(1rem, 1rem);
                fill: #ccc;
            }
            .choosed_way{
                fill: #4cd964;
            }
        }
    }
    .determine{
        background-color: #4cd964;
        @include sc(.7rem, #fff);
        text-align: center;
        margin: 0 .7rem;
        line-height: 1.8rem;
        border-radius: 0.2rem;
        margin-top: 0.5rem;
        font-weight: bold;
    }
</style>
