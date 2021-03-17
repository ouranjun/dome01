<template>
  <div class="shoplist_container">
    <ul v-if="shopListArr.length" type='1'>
      <router-link tag="li" :to="{path: 'shop', query:{geohash, id: item.id}}" v-for="item in shopListArr" :key="item.id" class="shop_li">
        <section>
          <img :src="imgBaseUrl + item.image_path" class="shop_img">
        </section>
        <hgroup class="shop_right">
          <!-- 标题  -->
          <header class="shop_detail_header">
            <h4 :class="item.is_premium ? 'premium' : ''" class="shop_title ellipsis">{{item.name}}</h4>
            <ul class="shop_detail_ul">
              <li class="supports" v-for="item in item.supports" :key="item.id">
              {{item.icon_name}}
              </li>
            </ul>
          </header>
          <!-- 评价星级  -->
          <h5 class="rating_order_num">
            <section class="rating_order_num_left">
              <section class="rating_section">
              <rating-star :rating="item.rating"></rating-star>
              <span class="rating_num">{{item.rating}}</span>
              </section>
              <section class="order_section">
                月售{{item.recent_order_num}}单
              </section>
            </section>
            <section class="rating_order_num_right">
              <span class="delivery_style delivery_left" v-if="item.delivery_mode">
                {{item.delivery_mode.text}}
              </span>
              <span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
            </section>
          </h5>
          <!-- 配送信息 -->
          <h5 class="fee_distance">
            <p class="fee">
              ￥{{item.float_minimum_order_amount}}起送
              <span class="segmentation">/</span>
              {{item.piecewise_agent_fee.tips}}
            </p>
            <p class="distance_time">
              <span v-if="Number(item.distance)">{{item.distance > 1000 ? (item.distance/1000).toFixed(2) + 'km' : item.distance + 'm'}}
                <span class="segmentation">/</span>
              </span>
              <span v-else>{{item.distance}}</span>
              <span class="segmentation">/</span>
              <span class="order_time">{{item.order_lead_time}}</span>
            </p>
          </h5>
        </hgroup>
      </router-link>
    </ul>
    <div class="bottom_text">
      <span v-if="touchend">-我是有底线的-</span>
      <span v-else @click="loadMore">如无法正常加载，点击加载...</span>
    </div>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
    <back-top  :showBackTop="showBackTop"></back-top>
  </div>
</template>

<script>
import { imgBaseUrl } from '@/http/http'
import { mapState } from 'vuex'
import { shopList } from '@/http/api'
import RatingStar from './ratingStar.vue'
import Loading from '../common/loading/loading.vue'
import BackTop from '../common/backTop/backTop.vue'

export default {
  name: 'shoplist',
  data () {
    return {
      offset: 0, // 批次加载加载店铺，每次加载20个 limit = 20
      imgBaseUrl, // 默认图片地址
      shopListArr: [], // 店铺列表数据
      showLoading: true, // 显示加载动画
      touchend: false, // 没有更多数据
      showBackTop: false, // 返回顶部
      preventRepeatReuqest: false // 到达底部加载数据防止重复加载
    }
  },
  components: {
    RatingStar,
    Loading,
    BackTop
  },
  props: ['geohash', 'restaurantCategoryId', 'restaurantCategoryIds', 'deliveryMode', 'confirmSelect', 'sortByType', 'supportIds'],
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
  mounted () {
    this.initData()
    window.onscroll = this.throttle(this.onScroll)
  },
  methods: {
    loadMore () {
      this.loaderMore()
    },
    async initData () {
      // 获取数据
      const res = await shopList({
        latitude: this.latitude,
        longitude: this.longitude,
        offset: this.offset,
        restaurant_category_id: '',
        restaurant_category_ids: '',
        order_by: '',
        delivery_mode: '',
        support_ids: []
      })
      this.hideLoading()
      this.shopListArr = [...res]
      if (res.length < 20) {
        this.touchend = true
      }
    },
    // 隐藏动画
    hideLoading () {
      this.showLoading = false
    },
    // 判断是否数组是否含有’准‘字
    zhunshi (supports) {
      let zhunStatus
      if ((supports instanceof Array) && supports.length) {
        supports.forEach(item => {
          if (item.icon_name === '准') {
            zhunStatus = true
          }
        })
      } else {
        zhunStatus = false
      }
      return zhunStatus
    },
    // 加载更多
    async loaderMore () {
      if (this.touchend) {
        return
      }
      // 防止重复请求
      if (this.preventRepeatReuqest) {
        return
      }
      this.showLoading = true
      this.preventRepeatReuqest = true
      // 数据的定位加20位
      this.offset += 20
      const res = await shopList({
        latitude: this.latitude,
        longitude: this.longitude,
        offset: this.offset,
        restaurant_category_id: '',
        restaurant_category_ids: '',
        order_by: '',
        delivery_mode: '',
        support_ids: []
      })
      this.hideLoading()
      this.shopListArr = [...this.shopListArr, ...res]
      // 当数据小于20 说明没有更多数据
      if (res.length < 20) {
        this.touchend = true
        return
      }
      this.preventRepeatReuqest = false
    },
    // 判断是否到底部
    onScroll () {
      // 变量scrollTop 是滚动条滚动时 距离顶部的距离
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // windowHeight 是可视区的高度
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // scrollHeight是滚动条的总高度
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      if (scrollTop + windowHeight >= scrollHeight) {
        this.loaderMore()
      } else if (scrollTop === 0) {
        this.showBackTop = false
      } else if (scrollTop > 500) {
        this.showBackTop = true
      }
    },
    // 函数节流
    throttle (fn, interval = 300) {
      let canRun = true
      return function () {
        if (!canRun) return
        canRun = false
        setTimeout(() => {
          fn.apply(this, arguments)
          canRun = true
        }, interval)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import '@/style/mixin';
  .shoplist_container {
    background-color: #fff;
    margin-bottom: 1rem;
    .shop_li {
      display: flex;
      border-bottom: 0.025rem solid #f1f1f1;
      padding: 0.7rem 0.4rem;
    }
    .shop_img {
      @include wh(2.7rem, 2.7rem);
      display: block;
      margin: 0 0.4rem 0 0;
    }
    .shop_right {
      flex: auto;
      .shop_detail_header {
        @include fj;
        align-items: center;
        .shop_title {
          width: 8.5rem;
          color: #333;
          padding-top: 0.1rem;
          @include font(0.6rem, 0.65rem, 'PingFangSC-Regular');
          font-weight: 700;
        }
        .premium::before {
          content: '品牌';
          display: inline-block;
          font-size: 0.5rem;
          line-height: 0.6rem;
          color: #333;
          background-color: #ffd930;
          padding: 0 0.1rem;
          border-radius: 0.1rem;
          margin-right: 0.2rem;
        }
        .shop_detail_ul {
          display: flex;
          transform: scale(0.8);
          margin-right: -0.3rem;
          .supports {
            @include sc(0.5rem, #999);
            border: 0.025rem solid #f1f1f1;
            padding: 0 0.04rem;
            border-radius: 0.08rem;
            margin-left: 0.05rem;
          }
        }
      }
      .rating_order_num {
        @include fj(space-between);
        height: 0.6rem;
        margin-top: 0.52rem;
        .rating_order_num_left {
          @include fj(flex-start);
          .rating_section {
            display: flex;
            .rating_num {
              @include sc(0.4rem, #ff6000);
              margin: 0 0.2rem;
            }
          }
          .order_section {
            font-size: 0.4rem;
            transform: scale(0.8);
            color: #666;
            margin-left: -0.2rem;
          }
        }
        .rating_order_num_right {
          display: flex;
          align-items: center;
          transform: scale(.7);
          min-width: 5rem;
          justify-content: flex-end;
          margin-right: -0.8rem;
          .delivery_style {
            font-size: 0.4rem;
            padding: 0.04rem 0.08rem 0;
            border-radius: 0.08rem;
            margin-left: 0.08rem;
            border: 1px;
          }
          .delivery_left {
            color: #fff;
            background-color: $blue;
            border: 0.025rem solid $blue;
          }
          .delivery_right {
            color: $blue;
            border: 0.025rem solid $blue;
          }
        }
      }
      .fee_distance {
        margin-top: 0.52rem;
        @include fj;
        @include sc(0.5rem, #666);
        .fee {
          transform: scale(0.9);
          @include sc(0.5rem, #666);
        }
        .distance_time {
          transform: scale(0.9);
          span {
            color: #999;
          }
          .order_time {
            color: $blue;
          }
          .segmentation {
            color: #ccc;
          }
        }
      }
    }
    .bottom_text {
      text-align: center;
      margin-bottom: 2rem;
      span {
        font-size: 0.65rem;
        color: #ddd;
      }
    }
  }
</style>
