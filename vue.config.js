const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    host: process.env.VUE_APP_DEV_SERVER_HOST || '0.0.0.0',
    port: parseInt(process.env.VUE_APP_DEV_SERVER_PORT) || 12011,
    hot: true,
    allowedHosts: ['all'],
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'  // 关键：解决HMR连接问题
    },
    proxy: {
      '^/(?!.*\\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot))': {
        target: process.env.VUE_APP_API_SERVER_URL,
        changeOrigin: true,
        ws: true,
        logLevel: 'debug'  // 查看代理日志
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