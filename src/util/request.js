import axios from 'axios'
import { Notification } from 'element-ui'
import consts from '@/util/consts'

const msgSet = new Set()

// 根据环境决定API基础URL
let baseURL
if (process.env.NODE_ENV === 'development') {
  // 开发环境：优先使用环境变量，如果没有则使用代理路径
  if (process.env.VUE_APP_BASE_URL) {
    baseURL = process.env.VUE_APP_BASE_URL
  } else {
    // 使用当前访问的host + /api，通过开发服务器代理转发
    baseURL = window.location.protocol + '//' + window.location.host + '/api'
  }
} else {
  // 生产环境
  baseURL = process.env.VUE_APP_BASE_URL || 'http://106.54.214.94:12010'
}

console.log('API Base URL:', baseURL) // 用于调试

const service = axios.create({
  baseURL: baseURL,
  timeout: 30000
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const status = error.response.status
    if (consts.SELF_HANDLE_ERROR_CODE.indexOf(data.code) >= 0) {
      return Promise.reject(data)
    }
    if (status === 400 || status === 403 || status === 500) {
      msgSet.add(data.msg ? data.msg : '服务器发生错误')
      setTimeout(() => {
        msgSet.forEach((item) => {
          Notification.error({
            title: '错误提示',
            message: item
          })
        })
        msgSet.clear()
      }, 500)
    }
    return Promise.reject(data)
  }
  return Promise.reject(error)
}

// 响应拦截器
service.interceptors.response.use((response) => {
  return response.data
}, err)

export { service as axios }
