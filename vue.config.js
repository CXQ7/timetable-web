module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 12011,
    disableHostCheck: true, // 允许外部访问
    proxy: {
      '/api': {
        // 只代理/api开头的请求
        target: 'http://106.54.214.94:12010',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // 移除前缀
        logLevel: 'debug' // 打印详细代理日志
      }
    }
  }
}
