<template>
  <div class="order_page">
    <head-top go-back="true" head-title="订单"></head-top>
    <ul class="order_list_ul">
      <li class="order_list_li" v-for="item in orderList" :key="item.id">
        <img :src="imgBaseUrl + item.restaurant_image_url" class="restaurant_image" alt="">
        <section class="order_item_right">
          <section>
            <header class="order_item_right_header">
              <section class="order_header">
                <h4>
                  <span class="ellipsis">{{item.restaurant_name}}</span>
                    <svg fill="#333" class="arrow_right">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                    </svg>
                </h4>
                <p class="order_time">{{item.formatted_created_at}}</p>
              </section>
              <p class="order_status">{{item.status_bar.title}}</p>
            </header>
            <section class="order_basket">
              <p class="order_name">{{item.basket.group[0][0].name}}{{item.basket.group[0].length > 1 ? '等' + item.basket.group[0].length + '件商品' : ''}}</p>
              <p class="order_amount">￥{{item.total_amount.toFixed(2)}}</p>
            </section>
          </section>
          <div class="order_again">
            <compute-time v-if="item.status_bar.title == '等待支付'" :time="item.time_pass"></compute-time>
            <router-link :to="{path: '/shop', query: {geohash, id: item.restaurant_id}}" tag="span" class="buy_again" v-else>再来一单</router-link>
          </div>
        </section>
      </li>
    </ul>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
    <section class="order_unlogin" v-if="!userInfo">请登录后查看</section>
  </div>
</template>

<script>
import headTop from '@/components/header/header'
import { getOrderList } from '@/http/api'
import { imgBaseUrl } from '@/http/http'
import { mapState } from 'vuex'
import ComputeTime from '../../components/common/computeTime/computeTime.vue'
import Loading from '../../components/common/loading/loading.vue'
export default {
  name: 'order',
  data () {
    return {
      orderList: null, // 订单列表
      offset: 0,
      preventRepeat: false, // 防止重复获取
      showLoading: true,
      imgBaseUrl
    }
  },
  computed: {
    ...mapState([
      'userInfo', 'geohash'
    ])
  },
  components: {
    headTop,
    ComputeTime,
    Loading
  },
  methods: {
    // 初始化获取信息
    async initData () {
      console.log(this.userInfo)
      if (this.userInfo && this.userInfo.user_id) {
        const res = await getOrderList(this.userInfo.user_id, this.offset)
        console.log('1111111')
        this.orderList = [...res]
        this.hideLoading()
      } else {
        this.hideLoading()
      }
    },
    // 加载更多
    async loaderMore () {
      if (this.preventRepeat) {
        return false
      }
      this.preventRepeat = true
      this.showLoading = true
      this.offset += 10
      // 获取信息
      const res = await getOrderList(this.userInfo.user_id, this.offset)
      this.orderList = [...this.orderList, ...res]
      this.hideLoading()
      if (res.length < 10) {
        return false
      }
      this.preventRepeat = false
    },
    hideLoading () {
      this.showLoading = false
    }
  },
  mounted () {
    this.initData()
  },
  watch: {
    userInfo: function (val) {
      if (val && val.user_id && !this.orderList) {
        this.initData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/style/mixin';
  .order_page {
    position: relative;
    margin-bottom: 1.95rem;
    .order_list_ul {
      padding-top: 1.79rem;
      .order_list_li {
        display: flex;
        background: #fff;
        margin-bottom: 0.5rem;
        padding: 0.6rem 0.6rem 0;
        .restaurant_image {
          width: 2rem;
          height: 2rem;
          margin-right: 0.4rem;
        }
        .order_item_right {
          flex: 5;
          .order_item_right_header {
            border-bottom: 0.025rem solid #f5f5f5;
            padding-bottom: 0.3rem;
            @include fj;
            .order_header {
              h4 {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                @include sc(0.75rem, #333);
                line-height: 1rem;
                width: 9rem;
                .arrow_right {
                  @include wh(0.4rem, 0.4rem);
                  fill: #ccc;
                  margin-right: 0.2rem;
                }
              }
              .order_time {
                @include sc(0.55rem, #999);
                line-height: 0.8rem;
              }
            }
            .order_status {
              @include sc(0.6rem, #333)
            }
          }
          .order_basket {
            @include fj;
            line-height: 2rem;
            border-bottom: 0.025rem solid #f5f5f5;
            .order_name {
              @include sc(0.6rem, #666);
              width: 10rem;
            }
            .order_amount {
              @include sc(0.6rem, #f60);
              font-weight: bold;
            }
          }
          .order_again {
            text-align: right;
            line-height: 1.6rem;
            .buy_again {
              @include sc(0.55rem, #3190e8);
              border: 0.025rem solid #3190e8;
              padding: 0.1rem 0.2rem;
              border-radius: 0.15rem;
            }
          }
        }
      }
    }
  }
  .order_unlogin {
    margin-top: 70%;
    text-align: center;
    font-size: 0.8rem;
    color: #ccc;
  }
    .loading-enter-active, .loading-leave-active {
        transition: opacity .7s
    }
    .loading-enter, .loading-leave-active {
        opacity: 0
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
