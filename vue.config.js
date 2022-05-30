module.exports = {
  publicPath: './',
  // 开启代理服务器
  devServer: {
    proxy: {
      '/api': {
        headers: {
          Referer: 'https://www.bilibili.com/'
        },
        target: 'https://api.bilibili.com/',
        pathRewrite: {
          '^/api': ''
        }, // 重写请求路径，因为带了前缀，还需要再把前缀去掉再转发到服务器
        changeOrigin: true //用于控制请求头中host值
      },
      '/dy': {
        headers: {
          Referer: 'https://www.bilibili.com/'
        },
        target: 'https://api.vc.bilibili.com/',
        pathRewrite: {
          '^/dy': ''
        }, // 重写请求路径，因为带了前缀，还需要再把前缀去掉再转发到服务器
        changeOrigin: true //用于控制请求头中host值
      }
    }
  },
}