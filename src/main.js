import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'
import './assets/global.css'
import './assets/theme.css'
import consts from '@/util/consts'
// 在开发环境启用Mock数据
// if (process.env.NODE_ENV === 'development') {
//   require('./mock')
// }
require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
// require('echarts/lib/component/legend')
// require('echarts/lib/component/legendScroll')

Vue.config.productionTip = false
Vue.prototype.$consts = consts

// 添加全局错误处理
Vue.config.errorHandler = function (err, vm, info) {
  console.error('Vue全局错误:', err, info)
  // 如果是$options相关错误，不让它影响应用运行
  if (err.message && err.message.includes('$options')) {
    console.warn('捕获到$options错误，已忽略')
    return false
  }
  // 其他错误继续抛出
  throw err
}

// 初始化用户状态
store
  .dispatch('InitializeUserState')
  .then((result) => {
    if (result.success) {
      console.log('用户状态已恢复')
    }
  })
  .catch((error) => {
    console.warn('初始化用户状态失败:', error)
  })

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
