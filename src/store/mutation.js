import {
  SAVE_GEOHASH,
  RECORD_ADDRESS,
  ADD_CART,
  REDUCE_CART,
  CLEAR_CART,
  INIT_BUYCART,
  SAVE_SHOPID,
  CHOOSE_ADDRESS,
  CONFIRM_ADDRESS,
  RECORD_USERINFO,
  GET_USERINFO,
  CHOOSE_SEARCH_ADDRESS,
  SAVE_ORDER_PARAM,
  ORDER_SUCCESS,
  NEED_VALIDATION,
  OUT_LOGIN
} from './mutation-type.js'
import { setStore, getStore } from '../config/mUtil'

export default {
  // 保存geohash
  [SAVE_GEOHASH] (state, geohash) {
    state.geohash = geohash
  },
  // 保存经纬度
  [RECORD_ADDRESS] (state, {
    latitude,
    longitude
  }) {
    state.latitude = latitude
    state.longitude = longitude
  },
  // 加入购物车
  [ADD_CART] (state, {
    shopId,
    categoryId,
    itemId,
    foodId,
    name,
    price,
    specs,
    packingFee,
    skuId,
    stock
  }) {
    const cart = state.cartList
    const shop = cart[shopId] = (cart[shopId] || {})
    const category = shop[categoryId] = (shop[categoryId] || {})
    const item = category[itemId] = (category[itemId] || {})
    if (item[foodId]) {
      item[foodId].num++
    } else {
      item[foodId] = {
        num: 1,
        id: foodId,
        name: name,
        price: price,
        specs: specs,
        packing_fee: packingFee,
        sku_id: skuId,
        stock: stock
      }
    }
    state.cartList = { ...cart }
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 移除购物车
  [REDUCE_CART] (state, {
    shopId,
    categoryId,
    itemId,
    foodId
  }) {
    const cart = state.cartList
    const shop = (cart[shopId] || {})
    const category = (shop[categoryId] || {})
    const item = (category[itemId] || {})
    if (item && item[foodId]) {
      if (item[foodId].num > 0) {
        item[foodId].num--
        state.cartList = { ...cart }
        // 存入localStorage
        setStore('buyCart', state.cartList)
      } else {
        // 商品为零时，则清空当前商品信息
        item[foodId] = null
      }
    }
  },
  // 清空当前商品的购物车信息
  [CLEAR_CART] (state, shopid) {
    state.cartList[shopid] = null
    state.cartList = { ...state.cartList }
    setStore('buyCart', state.cartList)
  },
  // 网页初始化从本地缓存获取购物车数据
  [INIT_BUYCART] (state) {
    const initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  // 保存商铺ID
  [SAVE_SHOPID] (state, shopid) {
    state.shopid = shopid
  },
  // 选择地址
  [CHOOSE_ADDRESS] (state, {
    address,
    index
  }) {
    state.chooseAddress = address
    state.addressIndex = index
  },
  // 确认订单页添加新的地址
  [CONFIRM_ADDRESS] (state, newAddress) {
    state.newAddress.push(newAddress)
  },
  // 记录用户信息
  [RECORD_USERINFO] (state, info) {
    state.userInfo = info
    state.login = true
    setStore('user_id', info.user_id)
  },
  // 获取用户信息存入vuex
  [GET_USERINFO] (state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return false
    }
    if (!state.login) {
      return false
    }
    if (!info.message) {
      state.userInfo = { ...info }
    } else {
      state.userInfo = null
    }
  },
  // 选择搜索地址
  [CHOOSE_SEARCH_ADDRESS] (state, place) {
    state.searchAddress = place
  },
  // 保存下单参数，用户验证页面调用
  [SAVE_ORDER_PARAM] (state, orderParam) {
    state.orderParam = orderParam
  },
  // 保存下单参数，用户验证页面调用
  [NEED_VALIDATION] (state, needValidation) {
    state.needValidation = needValidation
  },
  // 保存下单参数，用户验证页面调用
  [ORDER_SUCCESS] (state, order) {
    state.cartPrice = null
    state.orderMessage = order
  },
  // 退出登录
  [OUT_LOGIN] (state) {
    state.userInfo = {}
    state.login = false
  }
}
