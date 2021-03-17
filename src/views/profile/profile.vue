<template>
  <div class="profile_page">
    <head-top go-back="true" head-title="我的"></head-top>
    <section>
      <section class="profile-number">
        <router-link :to="userInfo && userInfo.user_id ? '/profile/info' : '/login'" class="profile-link">
        <img :src="imgBaseUrl + userInfo.avatar" v-if="userInfo && userInfo.user_id" class="privateImage" alt="">
        <span class="privateImage" v-else>
          <svg class="privateImage-svg">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
          </svg>
        </span>
          <div class="user-info">
            <p>{{username}}</p>
            <p>
              <span class="user-icon">
                <svg class="icon-mobile" fill="#fff">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mobile"></use>
                </svg>
              </span>
              <span class="icon-mobile-number">{{mobile}}</span>
            </p>
          </div>
          <span class="arrow">
            <svg class="arrow-svg" fill="#fff">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </router-link>
      </section>
      <section class="info-data">
        <ul class="clear">
          <router-link to="/balance" tag="li" class="info-data-li">
          <span class="info-data-top"><b>0.00</b>元</span>
          <span class="info-data-bottom">我的余额</span>
          </router-link>
          <router-link to="/balance" tag="li" class="info-data-li">
          <span class="info-data-top"><b>0</b>个</span>
          <span class="info-data-bottom">我的优惠</span>
          </router-link>
          <router-link to="/balance" tag="li" class="info-data-li">
          <span class="info-data-top"><b>0</b>分</span>
          <span class="info-data-bottom">我的积分</span>
          </router-link>
        </ul>
      </section>
      <section class="info-data">
      <cell-group class="cell_box">
        <cell class="cell_item" center title="我的订单"  is-link size="large" to="/order"/>
        <cell class="cell_item" center title="积分商城" url="https://home.m.duiba.com.cn/#/chome/index"  is-link size="large" />
        <cell class="cell_item" center title="饿了么会员卡" is-link size="large" />
    </cell-group>
      </section>
      <section class="info-data">
        <cell-group class="cell_box">
          <cell class="cell_item" center title="服务中心"  is-link size="large"/>
          <cell class="cell_item" center title="下载饿了么"  is-link size="large" />
      </cell-group>
      </section>
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getStore } from '@/config/mUtil'
import { mapState } from 'vuex'
import headTop from '@/components/header/header'
import { imgBaseUrl } from '@/http/http'
import { Cell, CellGroup } from 'vant'

export default {
  name: 'profile',
  data () {
    return {
      imgBaseUrl,
      mobile: '暂无绑定手机号码', // 电话号码
      avatar: '', // 头像地址
      balance: 0, // 余额
      count: 0, // 优惠券数
      pointNumber: 0, // 积分数
      username: '登录/注册' // 用户名
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  mounted () {
    this.initData()
    const user = getStore('user_id')
    console.log(JSON.parse(user))
  },
  components: {
    headTop,
    CellGroup,
    Cell
  },
  methods: {
    // 初始化
    initData () {
      console.log(this.userInfo)
      if (this.userInfo && this.userInfo.user_id) {
        this.avatar = this.userInfo.avatar
        this.username = this.userInfo.username
        this.mobile = this.userInfo.mobile || '暂无绑定手机号码'
        this.balance = this.userInfo.balance
        this.count = this.userInfo.gift_amount
        this.pointNumber = this.userInfo.point
      } else {
        this.username = '登录/注册'
        this.mobile = '暂无绑定手机号码'
      }
    }
  },
  watch: {
    userInfo: function (value) {
      this.initData()
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '@/style/mixin';
  .profile_page {
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .profile-number {
    padding-top: 1.95rem;
    .profile-link {
      display: flex;
      align-items: center;
      background: $blue;
      padding: 0.666667rem 0.6rem;
      .privateImage {
        display: inline-block;
        @include wh(2.5rem, 2.5rem);
        border-radius: 50%;
        vertical-align: middle;
        .privateImage-svg {
          background: $fc;
          border-radius: 50%;
          @include wh(2.5rem, 2.5rem)
        }
      }
      .user-info {
        margin-left: 0.48rem;
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        p {
          font-weight: 700;
          @include sc(0.8rem, $fc);
          .user-icon {
            @include wh(0.5rem, 0.75rem);
            display: inline-block;
            vertical-align: middle;
            line-height: 0.75rem;
            margin-right: 0.5rem;
            .icon-mobile {
              @include wh(100%, 100%)
            }
          }
          .icon-mobile-number {
            display: inline-block;
            @include sc(0.5733rem, $fc)
          }
        }
      }
      .arrow {
        @include wh(0.46667rem, 0.98rem);
        display: inline-block;
        .arrow-svg{
          @include wh(100%, 100%);
          fill: #fff;
        }
      }
    }
  }
  .info-data {
    margin-top: 0.5rem;
    ul {
      display: flex;
      .info-data-li {
        width: 33.33%;
        height: 4rem;
        background: #fff;
        text-align: center;
        line-height: 4rem;
        border-right: 0.025rem #f5f5f5 solid;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span {
          line-height: 1rem;
          font-size: 0.55rem;
        }
        .info-data-top {
          margin-bottom: 0.1rem;
          b {
            font-size: 1.2rem;
            font-weight: 700;
            color: coral;
            font-family: Helvetica Neue,Tahoma;
          }
        }
      }
    }
    .cell_box{
      .cell_item {
        line-height: 2rem;
      }
    }
  }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
