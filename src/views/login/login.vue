<template>
  <div class="loginContainer">
    <head-top go-back="true" head-title="密码登录"></head-top>
    <form class="loginForm">
      <section class="input_container">
        <input type="text" placeholder="登录" v-model.lazy="userAccount">
      </section>
      <section class="input_container">
        <input v-if="!showPassWord" type="password" placeholder="密码" v-model="passWord">
        <input v-else type="text" placeholder="密码" v-model="passWord">
        <div class="button_switch" :class="{change_to_text: showPassWord}">
          <div class="circle_button" :class="{trans_to_right: showPassWord}" @click="changePassWordType"></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
      <section class="input_container captcha_code_container">
        <input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">
        <div class="img_change_img">
          <img :src="captchaCodeImg" v-show="captchaCodeImg" alt="">
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login_tips">
      温馨提示：未注册过的账号，登录时将自动注册
    </p>
    <p class="login_tips">
      注册过的用户可凭账号密码登录
    </p>
    <div class="login_container" @click="mobileLogin">登录</div>
    <router-link to="/forget" class="to_forget" v-if="!loginWay">重置密码?</router-link>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import headTop from '@/components/header/header'
import { getcaptchas, accountLogin } from '@/http/api'
import { Toast } from 'vant'
export default {
  data () {
    return {
      showPassWord: false, // 是否显示密码
      loginWay: false, // 登录方式
      userAccount: null, // 用户名
      codeNumber: null, // 验证码
      userInfo: null, // 用户信息
      captchaCodeImg: null, // 验证码地址
      passWord: null // 密码
    }
  },
  components: {
    headTop
  },
  computed: {
    // 判断手机号码
    rightPhoneNumber: function () {
      return /^1\d{10}$/gi.test(this.userAccount)
    }
  },
  created () {
    this.getCaptchaCode()
  },
  methods: {
    ...mapMutations([
      'RECORD_USERINFO'
    ]),
    // 显示密码
    changePassWordType () {
      this.showPassWord = !this.showPassWord
    },
    // 获取验证码
    async getCaptchaCode () {
      const res = await getcaptchas()
      this.captchaCodeImg = res.code
    },
    // 发送登录信息
    async mobileLogin () {
      if (!this.userAccount) {
        Toast.fail('请输入手机号')
        return false
      } else if (!this.rightPhoneNumber) {
        Toast.fail('请输入正确的手机号')
        return false
      } else if (!this.passWord) {
        Toast.fail('请输入密码')
        return false
      } else if (!this.codeNumber) {
        Toast.fail('请输入验证码')
        return false
      }
      this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber)
      console.log(this.userInfo)
      if (!this.userInfo.user_id) {
        Toast.fail(this.userInfo.message)
        return false
      } else {
        this.RECORD_USERINFO(this.userInfo)
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/style/mixin';
  .loginContainer {
    padding-top: 1.95rem;
    p, span, input {
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .change_login {
    position: absolute;
    @include ct;
    right: 0.75rem;
    @include sc(0.7rem, #fff)
  }
  .loginForm {
    background: #fff;
    margin-top: 0.6rem;
    .input_container {
      display: flex;
      justify-content: space-between;
      padding: 0.6rem 0.8rem;
      border-bottom: 1px solid #f1f1f1;
      input {
        @include sc(0.7rem, #666)
      }
      .right_phone_number {
        background: #4cd964;
      }
    }
    .captcha_code_container {
      height: 2.2rem;
      .img_change_img {
        display: flex;
        align-items: center;
        img {
          @include wh(3.5rem, 1.5rem);
          margin-right: 0.2rem;
        }
        .change_img {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          width: 2rem;
          justify-content: center;
          p {
            @include sc(0.55rem, #666);
          }
          p:nth-of-type(2){
            color: #3b95e9;
            margin-top: 0.2rem;
          }
        }
      }
    }
  }
  .login_tips {
    @include sc(0.5rem, red);
    padding: 0.4rem 0.6rem;
    line-height: 0.5rem;
    a {
      color: #3b95e9;
    }
  }
  .login_container {
    margin: 0 0.5rem 1rem;
    @include sc(0.7rem, #fff);
    background-color: #4cd964;
    padding: 0.5rem 0;
    border: 1px;
    border-radius: 0.15rem;
    text-align: center;
  }
  .button_switch {
    background: #ccc;
    display: flex;
    justify-content: center;
    @include wh(2rem, 0.7rem);
    padding: 0 0.2rem;
    border: 1px;
    border-radius: 0.5rem;
    position: relative;
    .circle_button {
      transition: all 0.3s;
      position: absolute;
      top: -0.2rem;
      z-index: 1;
      left: -0.3rem;
      @include wh(1.2rem, 1.2rem);
      box-shadow: 0 0.266667rem 0.053333rem 0 rgba(0,0,0,0.1);
      background: #f1f1f1;
      border-radius: 50%;
    }
    .trans_to_right {
      transform: translateX(1.3rem);
    }
    span {
      @include sc(0.45rem, #fff);
      transform: translateY(0.05rem);
      line-height: 0.6rem;
    }
    span:nth-of-type(2) {
      transform: translateY(-0.8rem);
    }
  }
  .change_to_text {
    background-color: #4cd964;
  }
  .to_forget {
    float: right;
    @include sc(0.6rem, #3b95e9);
    margin-right: 0.3rem;
  }
</style>
