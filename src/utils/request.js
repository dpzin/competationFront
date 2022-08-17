import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + '/bjss', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error, 'error---')
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    console.log('response', response)
    if (res.errorCode !== undefined && res.errorCode !== 'BattleInfoError') {
      console.log(res, '=====')
      Message({
        message: res.errorMessage,
        type: 'error',

        duration: 2 * 1000
      })
    } else {
      console.log('res', res)
      return res
    }
  },
  error => {
    if (error.message.includes('timeout')) {
      console.log(error, 'error')
      Message({
        message: '网络异常',
        type: 'error',
        duration: 2 * 1000
      })
    }
    if (error.response.data.errorCode === 'BattleInfoError') {
      return Promise.resolve(error.response.data)
    }
    Message({
      message: error.response.data.message || '出错啦',
      type: 'error',
      duration: 2 * 1000
    })

    return Promise.reject(error)
  }
)

export default service
