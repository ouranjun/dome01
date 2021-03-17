<template>
  <div class="miste_container">
    <div class="clearfixed">
    <head-top signinUp='msite'>
      <router-link slot="search" :to="{path:'/search/'+ geohash}">
      <span class="iconfont icon-faxian"></span>
      </router-link>
      <router-link to="/home" slot="msite-title" class="msite_title">
        <span class="title_text ellipsis">{{misteTitle}}</span>
      </router-link>
    </head-top>
    </div>
    <nav class="msite_nav">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide food_types_container" v-for="(item, index) in foodTypes" :key="index">
            <router-link :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}" v-for="foodItem in item" :key="foodItem.id" class="link_to_food">
              <figure>
                <img :src="imgBaseUrl + foodItem.image_url" alt="">
                <figcaption>{{foodItem.title}}</figcaption>
              </figure>
            </router-link>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </nav>
    <div class="shop_list_container">
      <header class="shop_header">
        <span class="iconfont icon-zhuye"></span>
        <span class="shop_header_title">附近商家</span>
      </header>
      <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import headTop from '@/components/header/header'
import shopList from '@/components/shoplist/shoplist'
import { msiteAddress, cityGuess, msiteFoodTypes } from '@/http/api'
import '@/style/swiper/swiper.min.css'
import '@/plugins/swiper.min.js'

export default {
  name: 'msite',
  data () {
    return {
      geohash: '', // 传进来的地址
      misteTitle: 'c', // msite页面头部标题
      foodTypes: [], // 食品分类列表
      imgBaseUrl: 'https://fuss10.elemecdn.com', // 图片域名地址
      hasGetData: false // 是否已经获取地理位置数据，成功获取在获取商铺信息
    }
  },
  components: {
    headTop,
    shopList
  },
  async beforeMount () {
    // 如果没有地址信息，再发送请求获取默认地址
    if (!this.$route.query.geohash) {
      const address = await cityGuess({ type: 'guess' })
      this.geohash = address.latitude + ',' + address.longitude
    } else {
      this.geohash = this.$route.query.geohash
    }
    // 保存geohash到vuex
    this.SAVE_GEOHASH(this.geohash)
    // 获取位置信息
    const res = await msiteAddress(this.geohash)
    this.misteTitle = res.name
    // 记录经纬度
    this.RECORD_ADDRESS(res)
    this.hasGetData = true
  },
  mounted () {
    // 获取导航食品类型列表
    msiteFoodTypes({
      geohash: this.geohash,
      group_type: '1',
      'flags[]': 'F'
    }).then(res => {
      const resLength = res.length
      const resArr = [...res] // 返回一个新的数组
      const foodArr = []
      for (let i = 0, j = 0; i < resLength; i += 8, j++) {
        foodArr[j] = resArr.splice(0, 8)
      }
      this.foodTypes = foodArr
    }).then(() => {
      // 初始化swiper
      /* eslint-disable */
      new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        loop: true
      })
      /* eslint-disable */
    })
  },
  methods: {
    ...mapMutations([
      'SAVE_GEOHASH',
      'RECORD_ADDRESS'
    ]),
    // 解码url地址，求去resaturant_category_id值
    getCategoryId (url) {
      const urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''))
      if (/restaurant_category_id/gi.test(urlData)) {
        return JSON.parse(urlData).restaurant_category_id.id
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .icon-faxian {
    color: #fff;
    font-size: 0.8rem;
    left: 0.55rem;
    @include ct;
  }
  .msite_title {
    @include center;
    display: block;
    width: 50%;
    color: #fff;
    text-align: center;
     .title_text {
       @include sc(0.8rem, #fff);
       text-align: center;
       display: block;
     }
  }
  .msite_nav {
    height: 8.5rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;
    .swiper-container {
      @include wh (100%, auto);
      padding-bottom: 0.6rem;
      .swiper-pagination {
        bottom: 0.2rem;
      }
    }
    .fl_back {
      @include wh(100%, 100%)
    }
  }
  .food_types_container {
    display: flex;
    flex-wrap: wrap;
    .link_to_food {
      width: 25%;
      padding: 0.3rem 0;
      text-align: center;
      @include fj(center);
      figure {
        img {
          margin-bottom: 0.3rem;
          @include wh(1.8rem, 1.8rem);
        }
        figcaption {
          text-align: center;
          white-space: nowrap;
          @include sc(0.55rem, #666);
        }
      }
    }
  }
  .shop_list_container {
    margin-top: 0.4rem;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
    .shop_header {
      .icon-zhuye {
        color: #999;
        margin-left: 0.6rem;
        margin-right: 0.1rem;
        vertical-align: center;
        font-size: 0.50rem;
      }
      .shop_header_title {
        color: #999;
        @include font(0.55rem, 1.6rem);
      }
    }
  }
</style>
