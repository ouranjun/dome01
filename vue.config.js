module.exports = {
  devServer: {
    proxy: {
      'proxyApi': {
        target: '//elm.cangdu.org/img/',
        changeOrigin: true,
        pathRewrite: {
          'proxyApi': ''
        }
      }
    }
  }
}