import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'
import actions from './action'

Vue.use(Vuex)

const state = {
  latitude: '', // 当前位置纬度
  longitude: '', // 当前位置经度
  cartList: {}, // 加入购物车的商品信息
  shopid: null, // 商铺id
  userInfo: null, // 用户信息
  login: true, // 是否登录
  remarkText: null, // 可备注内容
  inputText: '', // 输入备注内容
  invoice: false, // 开发票
  orderParam: null, // 下单数据
  newAddress: [], // 确认订单的新地址
  chooseAddress: null, // 选择地址
  searchAddress: null, // 搜索并选择地址
  addressIndex: null, // 选择地址的索引值
  cartPrice: null, // 会员价格
  orderMessage: null, // 订单返回值
  needValidation: null, // 是否需要验证
  geohash: '' // 地址geohash
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
