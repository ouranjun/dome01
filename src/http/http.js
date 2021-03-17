import axios from 'axios'

const baseURL = ''
let imgBaseUrl = '//elm.cangdu.org/img/'
if (process.env.NODE_ENV === 'development') {
  axios.defaults.imgBaseUrl = '/proxyApi'
  axios.defaults.baseURL = '//elm.cangdu.org'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = '//elm.cangdu.org'
  axios.defaults.imgBaseUrl = '//elm.cangdu.org/img/'
  imgBaseUrl = '//elm.cangdu.org/img/'
}

export {
  baseURL,
  imgBaseUrl
}

axios.defaults.timeout = 10000
// 请求头信息为post请求设置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 请求拦截器
/*
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况，此处token一般是用户完成登录后储存到localstorage里的
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.error(error)
  }) */

// 响应拦截器
axios.interceptors.response.use(response => {
  // 如果返回的状态码为200， 说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  if (response.status === 200) {
    if (response.data.code === 511) {
      // 未授权调取授权接口
    } else if (response.data.code === 510) {
      // 未登录跳转登录页
    } else {
      return Promise.resolve(response)
    }
  } else {
    return Promise.reject(response)
  }
}, error => {
  if (error.response.status) {
    // 处理请求失败的情况
    // 对不同返回码对响应处理
    return Promise.reject(error.response)
  }
})

// get 请求
export function httpGet ({
  url,
  params = {}
}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params
    }).then((res) => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// post 请求
export function httpPost ({
  url,
  data = {}
}) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'post',
      // 发送的数据
      data
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
