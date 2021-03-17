<template>
  <div class="address_page">
    <head-top head-title="添加地址" go-back="true"></head-top>
    <section class="page_text_container">
      <section class="section_list">
        <span class="section_left">联系人</span>
        <section class="section_right">
          <input type="text" name="name" id="" placeholder="你的名字" v-model="name" class="input_style">
          <div class="choose_sex">
            <span class="choose_option" @click="chooseSex(1)">
              <svg class="address_empty_right"  :class="{choosed: sex == 1}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>先生</span>
            </span>
            <span class="choose_option"  @click="chooseSex(2)">
              <svg class="address_empty_right" :class="{choosed: sex == 2}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>女士</span>
            </span>
          </div>
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">联系电话</span>
        <section class="section_right">
          <div class="phone_add">
            <input type="text" name="phone" placeholder="你的手机" v-model="phone" class="input_style">
            <img src="../../../../images/add_phone.png" height="20" width="20" @click="phone_bk = true" alt="">
          </div>
          <input v-if="phone_bk" type="text" name="anntherPhoneNumber" v-model="anntherPhoneNumber" placeholder="备选电话" class="input_style phone_bk">
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">送餐地址</span>
        <section class="section_right">
          <router-link to="/confirmOrder/chooseAddress/addAddress/searchAddress" tag="div" class="choose_address">
          {{searchAddress ? searchAddress.name : '小区/写字楼/学校等'}}
          </router-link>
          <input type="text" name="address_detail" placeholder="详情地址(如门牌号等)" v-model="address_detail" class="input_style">
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">标签</span>
        <section class="section_right">
          <input type="text" name="tag" placeholder="无/家/学校/公司" v-model="tag" class="input_style">
        </section>
      </section>
    </section>
    <div class="determine" @click="addAddress">确定</div>
    <transition name="route-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import headTop from '@/components/header/header'
import { postAddAddress } from '@/http/api'
import { Toast } from 'vant'

export default {
  data () {
    return {
      name: null, // 姓名
      sex: 1, // 性别 1为男 2为女
      phone: null, // 电话
      taf_type: 1, // 备注类型
      phone_bk: false, // 是否选择备注电话
      address_detail: null, // 详情地址
      tag: null, // 标签
      anntherPhoneNumber: null // 备注电话
    }
  },
  components: {
    headTop
  },
  computed: {
    ...mapState([
      'searchAddress', 'geohash', 'userInfo'
    ])
  },
  methods: {
    ...mapMutations([
      'CONFIRM_ADDRESS'
    ]),
    // 选择性别
    chooseSex (num) {
      this.sex = num
    },
    // 保存地址信息
    async addAddress () {
      if (!(this.userInfo && this.userInfo.user_id)) {
        Toast.fail('请登录')
        return false
      } else if (!this.name) {
        Toast.fail('请输入姓名')
        return false
      } else if (!this.phone) {
        Toast.fail('请输入手机号码')
        return false
      } else if (!this.searchAddress) {
        Toast.fail('请输入地址')
        return false
      } else if (!this.address_detail) {
        Toast.fail('请输入详情地址')
        return false
      }
      if (this.tag === '家') {
        this.tag_type = 2
      } else if (this.tag === '学校') {
        this.tag_type = 3
      } else if (this.tag === '公司') {
        this.tag_type = 4
      }
      const res = await postAddAddress(this.userInfo.user_id, this.searchAddress.name, this.address_detail, this.geohash, this.name, this.phone, this.anntherPhoneNumber, 0, this.sex, this.tag, this.tag_type)
      if (res.message) {
        Toast.fail(res.message)
      } else {
        this.CONFIRM_ADDRESS(1)
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/style/mixin';
  .address_page {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    height: 100%;
    z-index: 205;
    padding-top: 1.95rem;
    p, span, input{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .page_text_container {
    background: #fff;
    padding: 0 0.7rem;
  }
  .section_list {
    display: flex;
    border-bottom: 0.025rem solid #f5f5f5;
    .section_left {
      @include sc(0.7rem, #333);
      flex: 2;
      line-height: 2.5rem;
    }
    .section_right {
      flex: 5;
      .input_style {
        width: 100%;
        height: 2.5rem;
        @include sc(0.7rem, #999);
      }
      .choose_sex {
        display: flex;
        line-height: 2.5rem;
        border-top: 0.025rem solid #f5f5f5;
        .choose_option {
          @include sc(0.7rem, #333);
          display: flex;
          align-items: center;
          margin-right: 0.8rem;
          svg {
            margin-right: 0.3rem;
            @include wh(0.8rem, 0.8rem);
            fill: #ccc;
          }
          .choosed {
            fill: #4cd964;
          }
        }
      }
    }
  }
  .choose_address {
    font-size: 0.68rem;
    color: #333;
    font-family: Helvetica Neue,Tahoma,Arial;
    line-height: 2.5rem;
}
    .determine {
      background-color: #4cd964;
      @include sc(0.7rem, #fff);
      text-align: center;
      margin: 0 0.7rem;
      line-height: 1.8rem;
      border-radius: 0.2rem;
      margin-top: 0.6rem;
    }
</style>
