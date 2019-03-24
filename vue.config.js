process.env.VUE_APP_USER = process.env.USER
process.env.VUE_APP_BUILD_DATETIME = new Date()

const config = {
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: './',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  baseUrl: '/',
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    proxy: {
      '/api': {
        target: 'http://47.99.180.157:3001/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}

module.exports = config
