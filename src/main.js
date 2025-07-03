import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'
import './assets/global.css'
import './assets/theme.css'
import consts from '@/util/consts'

if (process.env.NODE_ENV === 'development') {
  require('./mock') // 引入 mock/index.js 文件（你现在已有）
}
require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
// require('echarts/lib/component/legend')
// require('echarts/lib/component/legendScroll')

Vue.config.productionTip = false
Vue.prototype.$consts = consts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
