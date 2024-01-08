const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Reading in syllables',
    short_name: 'RIS',
    themeColor: '#FFFFFF',
    msTileColor: '#000000',
    background_color: '#FFFFFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/readinsyllables/'
    : '/'
})
