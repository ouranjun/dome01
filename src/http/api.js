import { getStore } from '../config/mUtil'
import { httpGet, httpPost } from './http'
/**
 * 获取首页默认地址
 */
export const cityGuess = (params = {}) => httpGet({ url: '/v1/cities', params })

/**
 * 获取首页热门城市
 */
export const hotcity = (params = {}) => httpGet({ url: '/v1/cities', params })

/**
 * 获取所有城市列表
 */
export const groupcity = (params = {}) => httpGet({ url: '/v1/cities', params })

/**
 * 获取当前城市名字
 */
export const currentcity = number => httpGet({ url: '/v1/cities/' + number })

/**
 * 获取搜索地址
 */
export const searchplace = (params = {}) => httpGet({ url: '/v1/pois', params })

/**
 * 获取msite页面地址信息
 */
export const msiteAddress = geohash => httpGet({ url: '/v2/pois/' + geohash })

/**
 * 获取msite页面食品分类列表
 */
export const msiteFoodTypes = (params = {}) => httpGet({ url: '/v2/index_entry', params })

/**
 * 获取msite商铺信息
 */
export const shopList = (
  params = {}
) => {
  return httpGet({ url: '/shopping/restaurants', params })
}

/**
 * 获取Restaurant搜索信息
 */
export const searchRestaurant = (
  params = {}
) => {
  return httpGet({ url: '/v4/restaurants', params })
}

/**
 * 获取Restaurant信息
 */
export const shopDetails = (
  shopid, latitude, longitude
) => {
  return httpGet({
    url: '/shopping/restaurant/' + shopid,
    params: {
      latitude,
      longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
    }
  })
}

/**
 * 获取Restaurant信息
 */
export const foodMenu = (
  shopId
) => {
  return httpGet({
    url: '/shopping/v2/menu',
    params: {
      restaurant_id: shopId
    }
  })
}

/**
 * 获取Restaurant信息
 */
export const checkout = (
  geohash,
  entities,
  shopId
) => {
  return httpPost({
    url: '/v1/carts/checkout',
    data: {
      come_from: 'web',
      geohash,
      entities,
      restaurant_id: shopId
    }
  })
}

/**
 * 获取图片验证码
 */
export const getcaptchas = () => {
  return httpPost({
    url: '/v1/captchas',
    data: {}
  })
}

/**
 * 获取账号密码登录
 */
export const accountLogin = (
  username,
  password,
  captchaCode
) => {
  return httpPost({
    url: '/v2/login',
    data: {
      username,
      password,
      captcha_code: captchaCode
    }
  })
}

/**
 * 获取用户信息
 */
export const getUser = () => {
  return httpGet({
    url: '/v1/user',
    params: {
      user_id: getStore('user_id')
    }
  })
}

/**
 * A个人中心编辑地址
 */
export const getAddressList = (userId) => {
  return httpGet({
    url: '/v1/users/' + userId + '/addresses'
  })
}

/**
 * 搜索地址
 */
export const searchNearby = (keyword) => {
  return httpGet({
    url: '/v1/pois',
    params: {
      type: 'nearby',
      keyword
    }
  })
}

/**
 * 添加地址
 */
export const postAddAddress = (
  userId,
  address,
  addressDetail,
  geohash,
  name,
  phone,
  phoneBk,
  poiType,
  sex,
  tag,
  tagType
) => {
  return httpPost({
    url: '/v1/users/' + userId + '/addresses',
    data: {
      address,
      address_detail: addressDetail,
      geohash,
      name,
      phone,
      phone_bk: phoneBk,
      poi_type: poiType,
      sex,
      tag,
      tag_type: tagType
    }
  })
}

/**
 * 下订单
 */
export const placeOrders = (
  userId,
  cartId,
  addressId,
  description,
  entities,
  geohash,
  sig
) => {
  return httpPost({
    url: '/v1/users/' + userId + '/carts/' + cartId + '/orders',
    data: {
      address_id: addressId,
      come_from: 'mobile_web',
      deliver_time: '',
      description,
      entities,
      geohash,
      paymethod_id: 1,
      sig
    }
  })
}

/**
 * 退出
 */
export const signout = () => {
  return httpGet({
    url: '/v2/signout'
  })
}

/**
 * 获取订单列表
 */
export const getOrderList = (userId, offset) => {
  return httpGet({
    url: '/bos/v2/users/' + userId + '/orders',
    params: {
      limit: 10,
      offset
    }
  })
}
