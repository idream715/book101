module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
      '/api1': {
        target: 'https://api3.rgtcenter.com:2053',
        changeOrigin: true,
        pathRewrite: {
          '^/api1': '/dm01'
        }
      },
      '/api2': {
        target: 'https://dm01.code-th.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api2': '/books'
        }
      }
    }
  }
}