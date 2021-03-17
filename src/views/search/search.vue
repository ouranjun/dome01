<template>
  <div class="search_container">
    <div class="clearfixed">
    <head-top goBack='true' headTitle="搜索">
    </head-top>
    </div>
    <!-- 搜索框 -->
      <form class="search_form">
        <input type="text" name="search" class="search_input" v-model="searchValue" @input="checkInput" placeholder="请输入商家或美食名称" />
        <input type="submit" name="submit" class="search_submit" @click.prevent = "searchTarget('')" />
      </form>
    <!-- 商家 -->
    <section v-if="restaurantList.length">
      <h4 class="title_restaurant">商家</h4>
      <ul class="list_container">
        <router-link :to="{path: '/shop', query: {id: item.id}}" tag="li" v-for="item in restaurantList" :key="item.id" class="list_li">
        <section class="item_left">
          <img :src="imgBaseUrl + item.image_path" class="restaurant_img" alt="">
        </section>
        <section class="item_right">
          <div class="item_right_text">
            <p>
              <span>{{item.name}}</span>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="14" class="pay_icon">
                <polygon points="0,14 4,0 24,0 20,14" style="fill:none;stroke:#FF6000;stroke-width:1" />
                <line x1="1.5" y1="12" x2="20" y2="12" style="stroke:#FF6000;stroke-width:1.5"/>
                <text x="3.5" y="9" style="fill:#FF6000;font-size:9;font-weight:bold;">支付</text>
              </svg>
            </p>
            <p>月售{{item.month_sales || item.recent_order_num}}单</p>
            <p>{{item.delivery_fee||item.float_minimum_order_amount}} 元起送 / 距离{{item.distance}}</p>
          </div>
          <ul class="item_right_detail">
            <li v-for="activities in item.restaurant_acticity" :key="activities.id">
              <span :style="{backgroundColor: '#' + activities.icon_color}" class="activities_icon">{{activities.icon_name}}</span>
              <span>{{activities.name}}</span>
              <span class="only_phone">(手机客户端专享)</span>
            </li>
          </ul>
        </section>
        </router-link>
      </ul>
    </section>
    <!-- 搜索历史 -->
    <section class="search_history" v-if="searchHistory.length && showHistory">
      <h4 class="title_restaurant">搜索历史</h4>
      <ul>
        <li v-for="(item, index) in searchHistory" :key="index" class="history_list">
          <span class="history_text ellpsis" @click="searchTarget(item)">{{item}}</span>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="delete_icon" @click="deleteHistory(index)">
            <line x1="8" y1="8" x2="18" y2="18" style="stroke:#999;stroke-width:3" />
            <line x1="18" y1="8" x2="8" y2="18" style="stroke:#999;stroke-width:3" />
          </svg>
        </li>
      </ul>
      <footer class="clear_history" @click="clearAllHistory">清空搜索历史</footer>
    </section>
    <div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>
  </div>
</template>

<script>
import headTop from '@/components/header/header'
import { imgBaseUrl } from '../../http/http'
import { searchRestaurant } from '@/http/api'
import { Toast } from 'vant'
import { getStore, setStore, removeStore } from '@/config/mUtil'

export default {
  name: 'search',
  data () {
    return {
      geohash: '', // msite页面传递过来的地址信息
      searchValue: '', // 搜索内容
      restaurantList: [], // 搜索返回结果
      showHistory: true, // 是否显示历史记录，只有在返回搜素结果后隐藏
      searchHistory: [], // 历史记录
      emptyResult: false, // 搜索结果为空时显示
      imgBaseUrl // 图片地址
    }
  },
  components: {
    headTop
  },
  methods: {
    // 点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
    async searchTarget (historyValue) {
      if (historyValue) {
        this.searchValue = historyValue
      } else if (!this.searchValue) {
        Toast('请输入内容！')
        return false
      }
      // 隐藏历史记录
      this.showHistory = false
      Toast.loading({
        message: '搜索中...',
        forbidClick: true
      })
      this.restaurantList = await searchRestaurant({
        'extras[]': 'restaurant_activity',
        geohash: this.geohash,
        keyword: this.searchValue,
        type: 'search'
      })
      this.emptyResult = !this.restaurantList.length

      const history = getStore('searchHistory')
      if (history) {
        let checkrepeat = false
        this.searchHistory = JSON.parse(history)
        // 判断是否存在一样的历史记录
        // 没有则新增 如果有则不做重复储存
        this.searchHistory.forEach(item => {
          if (item === this.searchValue) {
            checkrepeat = true
          }
        })
        if (!checkrepeat) {
          this.searchHistory.push(this.searchValue)
        }
      } else {
        this.searchHistory.push(this.searchValue)
      }
      setStore('searchHistory', this.searchHistory)
    },
    // 删除历史记录
    deleteHistory (index) {
      this.searchHistory.splice(index, 1)
      setStore('searchHistory', this.searchHistory)
    },
    // 清空历史记录
    clearAllHistory () {
      this.searchHistory = []
      removeStore('searchHistory')
    },
    // 输入框更变时
    checkInput () {
      if (this.searchValue === '') {
        this.showHistory = true // 显示历史记录
        this.restaurantList = [] // 清空搜索结果
        this.emptyResult = false // 隐藏搜索为空时提示
      }
    }
  },
  mounted () {
    this.geohash = this.$route.params.geohash
  }
}
</script>

<style lang='scss' scoped>
  @import '../../style/mixin';
  .search_container {
    .search_form {
      background: #fff;
      padding: 0.5rem;
      display: flex;
      input {
        height: 1.5rem;
      }
      .search_input {
        flex: 4;
        border: 0.025rem solid $bc;
        @include sc(0.65rem, #333);
        border-radius: 0.125rem;
        background-color: #f2f2f2;
        font-weight: bold;
        padding: 0 0.25rem;
      }
      .search_submit {
        flex: 1;
        border: 0.025rem solid $blue;
        margin-left: 0.2rem;
        @include sc(0.65rem, #fff);
        border-radius: 0.125rem;
        background-color: $blue;
        font-weight: bold;
        padding: 0 0.25rem;
      }
    }
    .search_history {
      .history_list {
        background-color: #fff;
        border-bottom: 0.025rem solid $bc;
        @include font(0.7rem, 2rem);
        padding: 0 0.3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .history_text {
          display: inline-block;
          width: 80%;
        }
        .delete_icon {
          @include wh(1rem, 1rem)
        }
      }
      .clear_history {
        margin-bottom: 2rem;
        text-align: center;
        background-color: #fff;
        color: #3190e8;
        padding: 0.5rem;
        font-size: 0.8rem;
      }
    }
    .title_restaurant {
      font-size: 0.6rem;
      line-height: 2rem;
      text-indent: 0.5rem;
      font-weight: bold;
      color: #666;
    }
    .list_container {
      background-color: #fff;
      margin-bottom: 2rem;
    }
    .list_li {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 0.025rem solid $bc;
      .item_left {
        margin-right: 0.25rem;
        .restaurant_img {
          @include wh(1.7rem, 1.7rem)
        }
      }
      .item_right {
        font-size: 0.55rem;
        flex: 1;
        .item_right_text {
          padding-bottom: 0.25rem;
        }
      }
    }
    .search_none {
      color: #ccc;
      font-size: 0.7rem;
      text-align: center;
      padding: 0.7rem;
      background: #fff;
      border-top: 1px #eee solid;
    }
  }
</style>
