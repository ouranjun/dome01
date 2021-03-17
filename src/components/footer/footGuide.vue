<template>
  <div id="foot_guide">
    <div class="footer_item">
      <span class="iconfont icon-zhuye"></span>
      <span :class="{icon_active}">外卖</span>
    </div>
    <div class="footer_item">
      <span class="iconfont icon-faxian"></span>
      <span :class="{icon_active}">搜索</span>
    </div>
    <div class="footer_item">
      <span class="iconfont icon-dingdan"></span>
      <span>订单</span>
    </div>
    <div class="footer_item" >
      <span class="iconfont icon-kehu" ></span>
      <span>我的</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'footGuide',
  data () {
    return {
      icon_active: false
    }
  },
  mounted () {
    console.log(this.$route.path)
    console.log(this.$router)
  }
}
</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  #foot_guide {
    background: #fff;
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    @include wh(100%, 1.95rem);
    display: flex;
    box-shadow: 0 -0.0266667rem 0.053333rem rgba(0,0,0,0.1);
  }
  .footer_item {
    flex: 1;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon_active {
      color: #3190e8;
    }
    .iconfont {
      font-size: 0.85rem !important;
    }
    span {
      font-size: 0.55rem !important;
      color: #333;
    }
  }
</style>
