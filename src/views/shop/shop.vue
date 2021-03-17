<template>
  <div>
    <section class="shop_container" v-if="!showLoading">
      <nav class="goback" @click="goback">
          <svg width="4rem" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:3"/>
          </svg>
      </nav>
      <header class="shop_detail_header" ref="shopheader" :style="{zIndex: showActivities ? '14' : '10'}">
        <div class="header_cover_img_con">
          <img :src="imgBaseUrl + shopDetailData.image_path" class="header_cover_img" alt="">
        </div>
        <section class="description_header">
          <router-link to="/shop/shopDetail" class="description_top">
            <section class="description_left">
              <img :src="imgBaseUrl + shopDetailData.image_path" alt="">
            </section>
            <section class="description_right">
              <h4 class="description_title ellpsis">{{shopDetailData.name}}</h4>
              <p class="description_text">商家配送/{{shopDetailData.order_lead_time}}分钟送达/配送费￥{{shopDetailData.float_delivery_fee}}</p>
              <p class="description_promotion ellipsis">公告： {{shopDetailData.promotion_info}}</p>
            </section>
            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
              <path d="M0 0 L8 7 L0 14"  stroke="#fff" stroke-width="1" fill="none"/>
            </svg>
          </router-link>
            <footer class="description_footer" v-if="shopDetailData.activities.length" @click="showActivitiesFun">
            <p class="ellpsis">
              <span class="tip_icon" :style="{backgroundColor: '#' +shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}">{{shopDetailData.activities[0].icon_name}}</span>
              <span>{{shopDetailData.activities[0].description}}（APP专享）</span>
            </p>
            <p>{{shopDetailData.activities.length}}个活动</p>
            <svg class="footer_arrow">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use>
            </svg>
          </footer>
        </section>
      </header>
      <transition name="fade">
        <section class="activities_detials" v-if="showActivities">
          <h2 class="activities_shoptitle">{{shopDetailData.name}}</h2>
          <h3 class="activities_ratingstar">
            <rating-star :rating="shopDetailData.rating"></rating-star>
          </h3>
          <section class="activities_list">
            <header class="activities_title_style"><span>优惠信息</span></header>
            <ul>
              <li v-for="item in shopDetailData.activities" :key="item.id">
                <span class="activities_icon" :style="{backgroundColor: '#' + item.icon_color, borderColor: '#' + item.icon_color}">{{item.icon_name}}</span>
                <span>{{item.description}}(APP专享)</span>
              </li>
            </ul>
          </section>
          <section class="activities_shopinfo">
            <header class="activities_title_style"><span>商家公告</span></header>
            <p>{{shopDetailData.promotion_info}}</p>
          </section>
          <svg width="60" height="60" class="close_activities" @click.stop="showActivitiesFun">
            <circle cx="30" cy="30" r="25" stroke="#555" stroke-width="1" fill="none"/>
            <line x1="22" y1="38" x2="38" y2="22" style="stroke:#999;stroke-width:2"/>
            <line x1="22" y1="22" x2="38" y2="38" style="stroke:#999;stroke-width:2"/>
          </svg>
        </section>
      </transition>
      <!-- 切换栏 -->
      <section class="change_show_type" ref="chooseType">
        <div>
          <span :class="{activity_show: changeShowType == 'food'}" @click="changeShowType = 'food'">商品</span>
        </div>
        <div>
          <span :class="{activity_show: changeShowType == 'rating'}" @click="changeShowType = 'rating'">评价</span>
        </div>
      </section>
      <transition name="fade-choose">
        <section v-show="changeShowType == 'food'" class="food_container">
          <section class="menu_container">
            <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
              <ul>
                <li v-for="(item, index) in menuList" :key="index" :class="{activity_menu: index == menuIndex}" @click="chooseMenu(index)">
                  <span>{{item.name}}</span>
                  <span class="category_num" v-if="categoryNum[index] && item.type == 1">{{categoryNum[index]}}</span>
                </li>
              </ul>
            </section>
            <section class="menu_right" ref="menuFoodList">
               <ul v-if="menuList.length > 0">
                <li v-for="(item, index) in menuList" :key="index">
                  <header class="menu_detail_header">
                    <section class="menu_detail_header_left">
                      <strong class="menu_item_title">{{item.name}}</strong>
                      <span class="menu_item_description">{{item.description}}</span>
                    </section>
                    <span class="menu_detail_header_right" @click="showTitleDetail(index)"></span>
                    <p class="description_tip" v-if="index == TitleDetailIndex">
                      <span>{{item.name}}</span>
                      {{item.description}}
                    </p>
                  </header>
                   <section v-for="(foods, foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                    <router-link :to="{ path: 'shop/foodDetail', query: {image_path:foods.image_path, description: foods.description, month_sales: foods.month_sales, name: foods.name, rating: foods.rating, rating_count: foods.rating_count, satisfy_rate: foods.satisfy_rate, foods, shopId}}" tag="div" class="menu_detail_link">
                    <section class="menu_food_img">
                        <img :src="imgBaseUrl + foods.image_path" alt="">
                    </section>
                      <section class="menu_food_description">
                        <h3 class="food_description_head">
                          <strong class="description_foodname">{{foods.name}}</strong>
                        </h3>
                        <p class="food_description_content">{{foods.description}}</p>
                        <p class="food_description_sale_rating">
                          <span>月售{{foods.month_sales}}份</span>
                          <span>好评率{{foods.satisfy_rate}}%</span>
                        </p>
                        <p v-if="foods.activity" class="food_activity">
                          <span :style="{color: '#' + foods.activity.image_text_color,borderColor:'#' +foods.activity.icon_color}">{{foods.activity.image_text}}</span>
                        </p>
                      </section>
                    </router-link>
                    <footer class="menu_detail_footer">
                      <section class="food_price">
                        <span>￥</span>
                        <span>{{foods.specfoods[0].price}}</span>
                        <span v-if="foods.specifications.length">起</span>
                      </section>
                      <buycart :shopId="shopId" :foods="foods" @moveInCart='listenIncart' @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buycart>
                    </footer>
                  </section>
                </li>
              </ul>
            </section>
          </section>
          <section class="buy_cart_container">
            <section @click="toggleCartList" class="cart_icon_num">
              <div class="cart_icon_container" :class="{cart_icon_activity: totalPrice > 0, move_in_cart: receiveInCart}" ref="cartContainer">
                <span v-if="totalNum" class="cart_list_length">
                  {{totalNum}}
                </span>
                <svg class="cart_icon">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
                </svg>
              </div>
              <div class="cart_num">
                <div>￥{{totalPrice}}</div>
                <div>配送费￥{{deliverFee}}</div>
              </div>
            </section>
            <section class="gotopay" :class="{gotopay_activity: minimumOrderAmount <= 0}">
              <span class="gotopay_button_style" v-if="minimumOrderAmount > 0">还差￥{{minimumOrderAmount}}元起送</span>
              <router-link v-else :to="{path: '/confirmOrder', query: {geohash, shopId}}" class="gotopay_button_style">去结算</router-link>
            </section>
          </section>
          <transition name="toggle-cart">
            <section class="cart_food_list" v-show="showCartList && cartFoodList.length">
              <header>
                <h4>购物车</h4>
                <div @click="clearCart">
                  <svg>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
                  </svg>
                  <span class="clear_cart">清空</span>
                </div>
              </header>
              <section class="cart_food_details" id="cartFood">
                <ul>
                  <li v-for="(item, index) in cartFoodList" :key="index" class="cart_food_li">
                    <div class="cart_list_num">
                      <p class="ellipsis">{{item.name}}</p>
                      <p class="ellipsis">{{item.specs}}</p>
                    </div>
                    <div class="cart_list_price">
                      <span>¥</span>
                      <span>{{item.price}}</span>
                    </div>
                    <section class="cart_list_control">
                      <span @click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                        <svg>
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                        </svg>
                      </span>
                      <span class="cart_num">{{item.num}}</span>
                      <svg class="cart_add" @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                      </svg>
                    </section>
                  </li>
                </ul>
              </section>
            </section>
          </transition>
          <transition name="fade">
            <div class="screen_cover" v-show="showCartList && cartFoodList.length" @click="toggleCartList"></div>
          </transition>
        </section>
      </transition>
    </section>
    <section>
      <transition name="fade">
        <div class="specs_cover" @click="showChooseList" v-if="showSpecs"></div>
      </transition>
      <transition name="fadeBounce">
        <div class="specs_list" v-if="showSpecs">
          <header class="specs_list_header">
            <h4 class="ellipsis">{{choosedFoods.name}}</h4>
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1" class="specs_cancel" @click="showChooseList">
                <line x1="0" y1="0" x2="16" y2="16"  stroke="#666" stroke-width="1.2"/>
                <line x1="0" y1="16" x2="16" y2="0"  stroke="#666" stroke-width="1.2"/>
              </svg>
          </header>
          <section class="specs_details">
            <h5 class="specs_details_title">{{choosedFoods.specifications[0].name}}</h5>
            <ul>
              <li v-for="(item, itemIndex) in choosedFoods.specifications[0].values" :key="itemIndex" :class="{specs_activity: itemIndex == specsIndex}" @click="chooseSpecs(itemIndex)">
                {{item}}
              </li>
            </ul>
          </section>
          <footer class="specs_footer">
            <div class="specs_price">
              <span>￥</span>
              <span>{{choosedFoods.specfoods[specsIndex].price}}</span>
            </div>
            <div class="specs_addto_cart" @click="addSpecs(choosedFoods.category_id, choosedFoods.item_id, choosedFoods.specfoods[specsIndex].food_id, choosedFoods.specfoods[specsIndex].name, choosedFoods.specfoods[specsIndex].price, choosedFoods.specifications[0].values[specsIndex], choosedFoods.specfoods[specsIndex].packing_fee, choosedFoods.specfoods[specsIndex].sku_id, choosedFoods.specfoods[specsIndex].stock)">加入购物车</div>
          </footer>
        </div>
      </transition>
    </section>
    <loading v-show="showLoading || loadRatings"></loading>
  </div>
</template>

<script>
import { imgBaseUrl } from '@/http/http'
import { msiteAddress, shopDetails, foodMenu } from '@/http/api'
import { mapState, mapMutations } from 'vuex'
import RatingStar from '../../components/shoplist/ratingStar.vue'
import Buycart from '../../components/common/buyCart/buycart.vue'
import Loading from '../../components/common/loading/loading.vue'
import BScroll from 'better-scroll'
import { Toast } from 'vant'
export default {
  name: 'shop',
  data () {
    return {
      geohash: '', // 地址信息
      shopId: null, // 商店id值
      showLoading: true, // 加载动画
      loadRatings: false, // 加载更多评论
      imgBaseUrl, // 图片地址
      showActivities: false, // 是否展示活动详情
      shopDetailData: null, // 店铺详情
      menuList: [], // 食品列表
      showCartList: false, // 显示购物车列表
      receiveInCart: false, // 购物车组件下落的圆点是否到达目标位置
      TitleDetailIndex: null, // 点击显示列表头部详情
      changeShowType: 'food', // 切换显示商品或者评价
      menuIndexChange: true, // 解决选中index，scroll监听事件重复判断设置index的bug
      menuIndex: 0, // 已选菜单索引值，默认为0
      shopListTop: [], // 商品列表高度集合
      foodScroll: null, // 食品列表scroll
      chooseedFoods: null, // 当前选中的食品数据
      showMoveDot: [], // 控制下落的小圆点显示隐藏
      elLeft: 0, // 当前点击加按钮在网页中的绝对top值
      elBottom: 0, // 当前点击加按钮在网页中的绝对left值
      choosedFoods: null, // 当前选中的商品数据
      showSpecs: false, // 控制显示食品规格
      specsIndex: 0, // 当前选中的规格索引值
      totalPrice: 0, // 总价格
      cartFoodList: [], // 购物车商品列表
      showDeleteTip: false, // 多规格商品点击减按钮，弹出提示框
      categoryNum: [] // 商品类型右上角已加入购物车的数量
    }
  },
  components: {
    RatingStar,
    Buycart,
    Loading
  },
  computed: {
    // 位置信息
    ...mapState([
      'latitude', 'longitude', 'cartList'
    ]),
    // 配送费
    deliverFee: function () {
      if (this.shopDetailData) {
        return this.shopDetailData.float_delivery_fee
      } else {
        return null
      }
    },
    // 当前购物车信息
    shopcart: function () {
      return { ...this.cartList[this.shopId] }
    },
    // g购物车总共商品的数量
    totalNum: function () {
      let num = 0
      this.cartFoodList.forEach(item => {
        num += item.num
      })
      return num
    },
    // 还差多少元起送 为负数时显示结算按钮
    minimumOrderAmount () {
      if (this.shopDetailData) {
        return this.shopDetailData.float_minimum_order_amount - this.totalPrice
      } else {
        return null
      }
    }
  },
  created () {
    this.geohash = this.$route.query.geohash
    this.shopId = this.$route.query.id
  },
  mounted () {
    this.initData()
  },
  methods: {
    ...mapMutations([
      'RECORD_ADDRESS',
      'CLEAR_CART',
      'ADD_CART',
      'REDUCE_CART'
    ]),
    // 获取食品列表的高度，存入shopListTop
    getFoodListHeight () {
      const listContainer = this.$refs.menuFoodList
      if (listContainer) {
        const listArr = Array.from(listContainer.children[0].children)
        listArr.forEach((item, index) => {
          this.shopListTop[index] = item.offsetTop
        })
        this.listenScroll(listContainer)
      }
    },
    // 滑动食品列表时，监听其scrollTop值来设定对应的食品列表标题
    listenScroll (element) {
      this.foodScroll = new BScroll(element, {
        probeType: 3,
        deceleration: 0.001,
        bounce: false,
        swipeTime: 2000,
        click: true
      })
      const wrapperMenu = new BScroll('#wrapper_menu', {
        click: true
      })
      const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight
      this.foodScroll.on('scroll', (pos) => {
        if (!this.$refs.wrapperMenu) {
          return
        }
        this.shopListTop.forEach((item, index) => {
          if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
            this.menuIndex = index
            const menuList = this.$refs.wrapperMenu.querySelectorAll('.activity_menu')
            const el = menuList[0]
            wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight / 2 - 50))
          }
        })
      })
    },
    // 返回
    goback () {
      this.$router.go(-1)
    },
    // 初始化时获取基本信息
    async initData () {
      if (!this.latitude) {
        // 获取位置信息
        const res = await msiteAddress(this.geohash)
        // 再次存入vuex
        this.RECORD_ADDRESS(res)
      }
      // 获取商铺信息
      this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude)
      this.menuList = await foodMenu(this.shopId)
      // 隐藏动画
      this.hideLoading()
    },
    // 控制活动详情页的显示隐藏
    showActivitiesFun () {
      this.showActivities = !this.showActivities
    },
    // 把索引值赋值给menuIndex
    chooseMenu (index) {
      this.menuIndex = index
      this.menuIndexChange = false
      this.foodScroll.scrollTo(0, -this.shopListTop[index], 400)
      this.foodScroll.on('scrollEnd', () => {
        this.menuIndexChange = true
      })
    },
    // 点击显示列表详情
    showTitleDetail (index) {
      if (this.TitleDetailIndex === index) {
        this.TitleDetailIndex = null
      } else {
        this.TitleDetailIndex = index
      }
    },
    // 监听圆点是否进入购物车
    listenIncart () {
      if (!this.receiveIncart) {
        this.receiveInCart = true
      }
    },
    // 隐藏动画
    hideLoading () {
      this.showLoading = false
    },
    // 多规格商品加入购物车
    addSpecs (categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock) {
      this.ADD_CART({ shopId: this.shopId, categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock })
      this.showChooseList()
    },
    // 记录当前规格索引值
    chooseSpecs (index) {
      this.specsIndex = index
    },
    // 多规格列表显示
    showChooseList (foods) {
      if (foods) {
        this.choosedFoods = foods
      }
      this.showSpecs = !this.showSpecs
      this.specsIndex = 0
    },
    // 显示提示，无法减去商品
    showReduceTip () {
      this.showDeleteTip = true
      Toast('请到购物车删除')
    },
    // 显示下落圆球
    showMoveDotFun (showMoveDot, elLeft, elBottom) {
      this.showMoveDot = [...this.showMoveDot, ...showMoveDot]
      this.elLeft = elLeft
      this.elBottom = elBottom
    },
    /**
      * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
    */
    initCategoryNum () {
      const newArr = []
      let cartFoodNum = 0
      this.totalPrice = 0
      this.cartFoodList = []
      this.menuList.forEach((item, index) => {
        if (this.shopcart && this.shopcart[item.foods[0].category_id]) {
          let num = 0
          Object.keys(this.shopcart[item.foods[0].category_id]).forEach(itemid => {
            Object.keys(this.shopcart[item.foods[0].category_id][itemid]).forEach(foodid => {
              const foodItem = this.shopcart[item.foods[0].category_id][itemid][foodid]
              num += foodItem.num
              if (item.type === 1) {
                this.totalPrice += foodItem.num * foodItem.price
                if (foodItem.num > 0) {
                  this.cartFoodList[cartFoodNum] = {}
                  this.cartFoodList[cartFoodNum].category_id = item.foods[0].category_id
                  this.cartFoodList[cartFoodNum].item_id = itemid
                  this.cartFoodList[cartFoodNum].food_id = foodid
                  this.cartFoodList[cartFoodNum].num = foodItem.num
                  this.cartFoodList[cartFoodNum].name = foodItem.name
                  this.cartFoodList[cartFoodNum].specs = foodItem.specs
                  this.cartFoodList[cartFoodNum].price = foodItem.price
                  cartFoodNum++
                }
              }
            })
          })
          newArr[index] = num
        } else {
          newArr[index] = 0
        }
      })
      this.totalPrice = this.totalPrice.toFixed(2)
      this.categoryNum = [...newArr]
    },
    // 控制购物车列表是否显示
    toggleCartList () {
      if (this.cartFoodList.length) {
        this.showCartList = !this.showCartList
      } else {
        return true
      }
    },
    // 清空购物车
    clearCart () {
      this.toggleCartList()
      this.CLEAR_CART(this.shopId)
    },
    // 加入购物车
    addToCart (categoryId, itemId, foodId, name, price, specs) {
      this.ADD_CART({ shopId: this.shopId, categoryId, itemId, foodId, name, price, specs })
    },
    // 移除购物车
    removeOutCart (categoryId, itemId, foodId, name, price, specs) {
      this.REDUCE_CART({ shopId: this.shopId, categoryId, itemId, foodId, name, price, specs })
    }
  },
  watch: {
    showLoading: function (value) {
      if (!value) {
        this.$nextTick(() => {
          this.initCategoryNum()
          this.getFoodListHeight()
        })
      }
    },
    shopcart: function (value) {
      this.initCategoryNum()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';
    @keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    @-moz-keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    @-webkit-keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    @-o-keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
  .shop_container {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    left: 0;
    height: 100vh;
  }
  .goback {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2rem;
    z-index: 11;
    padding-top: 0.2rem;
    padding-left: 0.2rem;
  }
  .shop_detail_header {
    position: relative;
    width: 100%;
    background: #fff;
    .header_cover_img_con {
      height: 100%;
      overflow: hidden;
      position: absolute;
      width: 100%;
      .header_cover_img {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        filter: blur(10px);
      }
    }
    .description_header {
      position: relative;
      z-index: 10;
      background: rgba(119,103,137,0.43);
      padding: 0.4rem 0 0.4rem 0.4rem;
      width: 100%;
      overflow: hidden;
      .description_top {
        display: flex;
        .description_left {
          margin-right: 0.3rem;
          img {
            @include wh(2.9rem, 2.9rem);
            display: block;
            border-radius: 0.15rem;
          }
        }
        .description_right {
          flex: 1;
          .description_title {
            @include sc(0.8rem, #fff);
            font-weight: bold;
            width: 100%;
            margin-bottom: 0.3rem;
          }
          .description_text {
            @include sc (0.5rem, #fff);
            margin-bottom: 0.3rem;
          }
          .description_promotion {
            @include sc(0.5rem, #fff);
            width: 11.5rem
          }
        }
      }
        .description_footer {
          @include fj;
          margin-top: 0.5rem;
          padding-right: 1rem;
          p {
            @include sc (0.5rem, #fff);
            span {
              color: #fff;
            }
            .tip_icon {
              padding: 0 0.04rem;
              border: 0.025rem solid #fff;
              border-radius: 0.1rem;
              font-size: 0.4rem;
              display: inline-block;
            }
          }
          .ellipsis {
            width: 84%;
          }
          .footer_arrow {
            @include wh(0.45rem, 0.45rem);
            position: absolute;
            right: 0.3rem;
          }
        }
    }
  }
  .activities_detials {
    background: rgb(0, 0, 0, 0.9);
    position: fixed;
    @include wh(100%,100%);
    padding: 0 2rem;
    z-index: 20;
    text-align: center;
    .activities_shoptitle {
      @include sc(0.9rem, #fff);
      margin: 2rem 0 1rem 0;
    }
    .activities_ratingstar {
      display: flex;
      justify-content: center;
      transform: scale(2.2);
      margin-top: 0.7rem;
      margin-bottom: 2rem;
    }
    .activities_list {
      @include sc(0.5rem, #fff);
      margin-bottom: 1rem;
      li {
        text-align: left;
      }
    }
    .activities_shopinfo {
      p {
        text-align: left;
        line-height: 0.7rem;
        @include sc(0.5rem, #fff)
      }
    }
    .activities_title_style {
      color: #fff;
      margin-bottom: 1rem;

      span{
        @include sc(0.5rem, #fff);
        border: 0.025rem #555 solid;
        padding: 0.2rem 0.4rem;
        border-radius: 0.5rem;
      }
    }
    .close_activities{
      position: absolute;
      bottom: 1rem;
      @include cl;
    }
  }
  .change_show_type {
    display: flex;
    background: #fff;
    padding: 0.3rem 0.6rem;
    border-bottom: 1px solid #ebebeb;
    div {
      flex: 1;
      text-align: center;
      span {
        @include sc(0.65rem, #666);
        padding: 0.2rem 0.1rem;
        border-bottom: 0.12rem solid #fff;
      }
      .activity_show {
        color: #3190e8;
        border-color: #3190e8;
      }
    }
  }
  .food_container {
    display: flex;
    flex: 1;
    padding-bottom: 2rem;
    overflow: hidden;
    .menu_container {
      display: flex;
      position: relative;
      overflow-y: hidden;
      flex: 1;
      .menu_left {
        width: 3.8rem;
        li {
          padding: 0.7rem 0.3rem;
          border-bottom: 0.025rem solid #ededed;
          box-sizing: border-box;
          border-left: 0.15rem solid #f8f8f8;
          position: relative;
          overflow: hidden;
          span {
            font-size: 0.67rem;
          }
          .category_num {
            position: absolute;
            top: 0.1rem;
            right: 0.1rem;
            background-color: #ff461d;
            line-height: 0.6rem;
            text-align: center;
            border-radius: 50%;
            border: 0.025rem solid #ff461d;
            min-width: 0.6rem;
            height: 0.6rem;
            font-size: 0.5rem;
            color: #fff;
            font-family: Helvetica Neue,Tahoma,Arial;
          }
        }
        li:last-child {
          margin-bottom: 3rem;
        }
        .activity_menu {
          border-left: 0.15rem solid #3190e8;
          background: #fff;
        }
      }
      .menu_right {
        width: 100%;
        overflow-y: auto;
        .menu_detail_header {
          width: 100%;
          padding: 0.4rem;
          position: relative;
          display: flex;
          display: -webkit-flex;
          justify-content: space-between;
          align-items: center;
          .menu_detail_header_left {
            width: 11rem;
            white-space: nowrap;
            overflow: hidden;
            .menu_item_title {
              font-size: 0.7rem;
              color: #666;
              font-weight: bold;
            }
            .menu_item_description {
              font-size: 0.5rem;
              color: #ccc;
              margin-left: 0.35rem;
            }
          }
          .menu_detail_header_right {
            @include wh(0.5rem, 1rem);
            display: block;
            @include bis('../../images/icon_point.png');
            background-size: 100% .4rem;
            background-position: left center;
          }
          .description_tip {
            background-color: #39373a;
            opacity: 0.95;
            @include sc(0.5rem, #fff);
            position: absolute;
            top: 1.5rem;
            z-index: 14;
            width: 8rem;
            right: 0.2rem;
            padding: 0.5rem 0.4rem;
            border: 1px;
            border-radius: 0.2rem;
            span {
              color: #fff;
              line-height: 0.6rem;
              font-size: 0.55rem;
            }
          }
          .description_tip::after {
            content: '';
            position: absolute;
            @include wh(0.4rem, 0.4rem);
            background: #39373a;
            top: -0.5rem;
            right: 0.7rem;
            transform: rotate(-45deg) translateY(0.41rem);
          }
        }
        .menu_detail_list {
          background-color: #fff;
          padding: 0.6rem 0.4rem;
          border-bottom: 1px solid #f8f8f8;
          position: relative;
          overflow: hidden;
          .menu_detail_link {
            display: flex;
            .menu_food_img {
              margin-right: 0.4rem;
              img {
                width: 2rem;
                height: 2rem;
                display: block;
              }
            }
            .menu_food_description {
              width: 100%;
              .food_description_head {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.2rem;
                .description_foodname {
                  font-size: 0.7rem;
                  color: #333;
                }
              }
              .food_description_content {
                font-size: .5rem;
                color: #999;
                line-height: 0.6rem;
              }
              .food_description_sale_rating {
                line-height: 0.8rem;
                span {
                  font-size: 0.5rem;
                  color: #333;
                  margin-right: 0.5rem;
                }
              }
              .food_activity {
                line-height: 0.4rem;
                span {
                  font-size: 0.3rem;
                  border: 1px solid currentColor;
                  border-radius: 0.3rem;
                  padding: 0.08rem;
                  display: inline-block;
                  transform: scale(0.8);
                  margin-left: -0.35rem;
                }
              }
            }
          }
          .menu_detail_footer {
            margin-left: 2.4rem;
            font-size: 0;
            margin-top: 0.3rem;
            display: flex;
            justify-content: space-between;
            .food_price {
              span:nth-of-type(1) {
                font-size: 0.5rem;
                color: #f60;
                margin-right: 0.05rem;
              }
              span:nth-of-type(2) {
                font-size: 0.7rem;
                color: #f60;
                font-weight: bold;
                margin-right: 0.3rem;
              }
              span:nth-of-type(3) {
                @include sc(0.5rem, #666)
              }
            }
          }
        }
      }
    }
  }
      .buy_cart_container {
        position: fixed;
        background-color: #3d3d3f;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        @include wh(100%, 2rem);
        .cart_icon_num {
          flex: 1;
          .cart_icon_container {
            display: flex;
            background-color: #3d3d3f;
            position: absolute;
            padding: 0.4rem;
            border: 0.18rem solid #444;
            border-radius: 50%;
            left: 0.5rem;
            top: -0.7rem;
            .cart_icon {
              @include wh(1.2rem, 1.2rem)
            }
            .cart_list_length {
              position: absolute;
              top: -0.25rem;
              right: 0.25rem;
              background-color: #ff461d;
              line-height: 0.7rem;
              text-align: 0.7rem;
              text-align: center;
              border-radius: 50%;
              border: 0.025rem sloid #ff461d;
              min-width: 0.7rem;
              height: 0.7rem;
              @include sc(0.5rem, #fff);
              font-family: Helvetica Neue,Tahoma,Arial;
            }
          }
          .move_in_cart {
            animation: mymove 0.5s ease-in-out;
          }
          .cart_icon_ativity {
            background-color: #3190e8;
          }
          .cart_num {
            @include ct;
            left: 3.5rem;
            div {
              color: #fff;
            }
            div:nth-of-type(1) {
              font-size: 0.8rem;
              font-weight: bold;
              margin-bottom: 0.1rem;
            }
            div:nth-of-type(2) {
              font-size: 0.4rem;
            }
          }
        }
        .gotopay {
          position: absolute;
          right: 0;
          background-color: #535356;
          @include wh(5rem, 100%);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          .gotopay_button_style {
            @include sc(0.6rem, #fff);
            font-weight: bold;
          }
        }
        .gotopay_activity {
          background-color: #4cd964;
        }
      }
    .cart_food_list {
      position: fixed;
      width: 100%;
      padding-bottom: 2rem;
      z-index: 12;
      bottom: 0;
      left: 0;
      background-color: #fff;
      header {
        @include fj;
        align-items: center;
        padding: 0.4rem 0.6rem;
        background-color: #eceff1;
        svg {
          @include wh(0.6rem, 0.6rem);
          vertical-align: middle;
        }
        h4 {
          @include sc(0.7rem, #666);
        }
        .clear_cart {
          @include sc(0.6rem, #666)
        }
      }
      .cart_food_details {
        background-color: #fff;
        max-height: 20rem;
        overflow-y: auto;
        .cart_food_li {
          @include fj;
          padding: 0.6rem 0.5rem;
          .cart_list_num {
            width: 55%;
            p:nth-of-type(1) {
              @include sc(0.7rem, #666);
              font-weight: bold;
            }
            p:nth-of-type(2) {
              @include sc(0.4rem, #666)
            }
          }
          .cart_list_price {
            font-size: 0;
            span:nth-of-type(1){
              @include sc(0.6rem, #f60);
              font-family: Helvetica Neue,Tahoma;
            }
            span:nth-of-type(2){
              @include sc(0.7rem, #f60);
              font-family: Helvetica Neue,Tahoma;
              font-weight: bold;
            }
          }
          .cart_list_control {
            display: flex;
            align-items: center;
            span {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            svg {
              @include wh(0.9rem, 0.9rem);
              fill: #3190e8;
            }
            .specs_reduce_icon {
              fill:#999
            }
            .cart_num {
              @include sc(0.65rem, #666);
              min-width: 1rem;
              text-align: center;
              font-family: Helvetica Neue,Tahoma;
            }
          }
        }
      }
    }
    .screen_cover {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0,0,0,0.3);
      z-index: 11;
    }
    .specs_cover {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.4);
      z-index: 14;
    }
    .specs_list {
      position: fixed;
      top: 35%;
      left: 15%;
      width: 70%;
      background-color: #fff;
      z-index: 18;
      border: 1px;
      border-radius: 0.2rem;
      .specs_list_header {
        h4 {
          @include sc(0.7rem, #222);
          font-weight: normal;
          text-align: center;
          padding: 0.5rem;
        }
        .specs_cancel {
          position: absolute;
          right: 0.5rem;
          top: 0.5rem;
        }
      }
      .specs_details {
        padding: 0.5rem;
        .specs_details_title {
          @include sc(0.6rem, #666)
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          padding: 0.4rem 0;
          li {
            font-size: 0.6rem;
            padding: 0.3rem 0.5rem;
            border-radius: 0.2rem;
            margin-right: 0.5rem;
            margin-bottom: 0.2rem;
          }
          .specs_activity {
            border: #3199e9 1px solid;
            color: #3190e8;
          }
        }
      }
      .specs_footer {
        @include fj;
        align-items: center;
        background-color: #f9f9f9;
        padding: 0.5rem;
        border: 1px;
        border-radius: 0 0 0.2rem 0.2rem;
        .specs_price {
          span {
            color: #ff6000;
          }
          span:nth-of-type(1) {
            font-size: 0.5rem;
          }
          span:nth-of-type(2) {
            font-size: 0.8rem;
            font-weight: bold;
            font-family: Helvetica Neue,Tahoma;;
          }
        }
        .specs_addto_cart {
          @include wh(4rem, 1.3rem);
          background-color: #3199e8;
          border: 1px;
          border-radius: 0.15rem;
          @include sc(0.6rem, #fff);
          text-align: center;
          line-height: 1.3rem;
        }
      }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .fade-choose-enter-active, .fade-choose-leave-active {
        transition: opacity .5s;
    }
    .fade-choose-leave, .fade-choose-leave-active {
        display: none;
    }
    .fade-choose-enter, .fade-choose-leave-active {
        opacity: 0;
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
    .toggle-cart-enter-active, .toggle-cart-leave-active {
        transition: all .3s ease-out;
    }
    .toggle-cart-enter, .toggle-cart-leave-active {
        transform: translateY(100%);
    }
</style>
