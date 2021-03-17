<template>
  <div class="rating_page">
    <head-top head-title="账户信息" go-back="true"></head-top>
    <cell-group class="cell_box">
      <cell class="cell_item" center title="头像"  is-link size="large">
        <img class="img_avatar" :src="imgBaseUrl + userInfo.avatar" alt="">
      </cell>
      <cell class="cell_item" center title="用户名" :value="username" is-link size="large" />
      <cell class="cell_item" center title="收货地址" is-link size="large" />
    </cell-group>
    <cell-group class="cell_box" title="账号绑定">
      <cell class="cell_item" @click="changePhone" center title="手机"  is-link size="large" />
    </cell-group>
    <cell-group class="cell_box" title="登陆密码">
      <cell class="cell_item" @click="resetPassword" center title="密码" value="修改"  is-link size="large" />
    </cell-group>
    <van-button @click="exitlogin" block class="out_login" type="danger" size="large" round>退出登录</van-button>
  </div>
</template>

<script>
import { removeStore } from '@/config/mUtil'
import headTop from '@/components/header/header'
import { imgBaseUrl } from '@/http/http'
import { signout } from '@/http/api'
import { Cell, CellGroup, Button, Toast } from 'vant'
import { mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      username: '', // 用户名
      imgBaseUrl // 图片地址
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  components: {
    headTop,
    Cell,
    CellGroup,
    vanButton: Button
  },
  methods: {
    ...mapMutations([
      'OUT_LOGIN'
    ]),
    // 退出登录
    async exitlogin () {
      Toast('已退出')
      this.OUT_LOGIN()
      this.$router.go(-1)
      removeStore('user_id')
      await signout()
    },
    // 修改手机号码
    changePhone () {
      Toast.fail('请在手机APP中设置')
    },
    resetPassword () {
      Toast.fail('暂不支持')
    }
  },
  watch: {
    userInfo: function (value) {
      if (value && value.user_id) {
        this.username = value.username
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import "@/style/mixin";
.rating_page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f2f2;
  z-index: 206;
  padding-top: 1.95rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.cell_box {
  .cell_item {
    line-height: 2rem;
    font-size: 0.65rem !important;
    .img_avatar {
      @include wh(2rem, 2rem);
      border-radius: 50%;
      vertical-align: middle;
    }
  }
}
.out_login {
  margin: 0.58rem auto;
  width: 95%;
}
</style>
