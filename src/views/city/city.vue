<template>
  <div class="city_contianer">
    <head-top :head-title="cityname" go-back="true">
      <router-link to="/home" slot="changecity" class="change_city">切换城市</router-link>
    </head-top>
    <form class="city_form" v-on:submit.prevent>
      <div>
        <input type="search" name='city' placeholder="输入学校、商务楼、地址" class="city_input input_style" required v-model="inputValue">
      </div>
      <div>
        <input type="submit" name="submit" class="city_submit input_style" @click="postpois" value="提交">
      </div>
    </form>
    <header v-if="historytitle" class="pois_search_history">搜索历史</header>
    <ul class="city_ul">
      <li v-for="(item, index) in placelist" @click="nextpage(index,item.geohash)" :key="index">
        <h4 class="pois_name ellipsis">{{item.name}}</h4>
        <p class="pois_address ellipsis">{{item.address}}</p>
      </li>
    </ul>
    <footer v-if="historytitle && placelist.length" class="clear_all_history" @click="clearAll">清空所有</footer>
    <div v-if="!placeNone" class="search_none_place">很抱歉！无搜索结果</div>
  </div>
</template>

<script>
import headTop from '@/components/header/header'
import { currentcity, searchplace } from '@/http/api'
import { getStore, setStore, removeStore } from '@/config/mUtil.js'

export default {
  name: 'city',
  data () {
    return {
      inputValue: '', // 搜索地址
      cityname: '', // 当前城市名字,
      cityid: '', // 当前城市id
      historytitle: true, // 默认显示搜索历史头部，点击搜索后隐藏
      placelist: [], // 搜索城市列表
      placeNone: true, // 搜索无结果，显示提示信息
      placeHistory: [] // 历史搜索记录
    }
  },
  components: {
    headTop
  },
  mounted () {
    this.cityid = this.$route.params.cityid
    // 获取当前城市名字
    currentcity(this.cityid).then(res => {
      this.cityname = res.name
    })
    // 执行获取历史记录
    this.initData()
  },
  methods: {
    // 获取搜索历史记录
    initData () {
      if (getStore('placeHistory')) {
        this.placelist = JSON.parse(getStore('placeHistory'))
      } else {
        this.placelist = []
      }
    },
    // 发送搜索信息inputValue
    postpois () {
      // 输入值不为空才发送请求
      if (this.inputValue) {
        searchplace({ type: 'search', city_id: this.cityid, keyword: this.inputValue }).then(res => {
          this.historytitle = false
          this.placelist = res
          this.placeNone = res.length > 0
        })
      }
    },
    // 点击地址进入该地址的主页
    nextpage (index, geohash) {
      const history = getStore('placeHistory')
      const cloosePlace = this.placelist[index]
      // 判断是否存在历史记录，如果存在进行遍历寻找，是否存在相同地址
      // 如果存在相同地址，则不添加到store，否则就添加进去
      if (history) {
        let checkrepeat = false
        this.placeHistory = JSON.parse(history)
        this.placeHistory.forEach(item => {
          if (item.geohash === geohash) {
            checkrepeat = true
          }
        })
        // 如果不存在则添加到placeHistory
        if (!checkrepeat) {
          this.placeHistory.push(cloosePlace)
        }
      } else {
        this.placeHistory.push(cloosePlace)
      }
      setStore('placeHistory', this.placeHistory)
      this.$router.push({ path: '/msite', query: { geohash } })
    },
    // 清空历史记录
    clearAll () {
      removeStore('placeHistory')
      this.initData()
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '../../style/mixin';
  .city_contianer {
    padding-top: 2.35rem;
  }
  .change_city {
    right: 0.4rem;
    @include sc(0.6rem, #fff);
    @include ct;
  }
  .city_form {
    background: #fff;
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    padding-top: 0.4rem;
    div {
      width: 90%;
      margin: 0 auto;
      text-align: center;
      .input_style {
        border-radius: 0.1rem;
        margin-bottom: 0.4rem;
        @include wh(100%, 1.4rem)
      }
      .city_input {
        border: 1px solid $bc;
        padding: 0 0.3rem;
        @include sc(0.65rem, #333)
      }
      .city_submit {
        background: $blue;
        @include sc(0.65rem, #fff)
      }
    }
  }
  .pois_search_history {
    font-size: 0.5rem;
    text-indent: 0.75rem;
    height: 0.9rem;
    line-height: 0.9rem;
    border-bottom: 1px solid #e2e2e2;
  }
  .city_ul {
    background: #fff;
    border-top: 1px soild $bc;
    li {
      margin: 0 auto;
      padding-top: 0.65rem;
      border-bottom: 1px solid $bc;
      .pois_name {
        margin: 0 auto 0.35rem;
        width: 90%;
        @include sc(0.65rem, #333)
      }
      .pois_address {
        width: 90%;
        margin: 0 auto 0.55rem;
        @include sc(0.45rem, #999)
      }
    }
  }
  .search_none_place {
    background: #fff;
    font-size: 0.65rem;
    text-indent: 0.65rem;
    padding: 0.5rem 0;
    border-top: 1px solid #e2e2e2;
  }
  .clear_all_history {
    background: #fff;
    font-size: 0.85rem;
    padding: 0.2rem;
    text-align: center;
  }
</style>
