const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    host: '0.0.0.0', // 直接指定，不使用环境变量
    port: 12011,     // 直接指定端口
    proxy: {
      '/': {
        target: process.env.VUE_APP_API_SERVER_URL,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}