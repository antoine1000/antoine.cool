const path = require('path')
const sh = require('kool-shell')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.dev.js')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const historyApiFallbackMiddleware = require('connect-history-api-fallback')
const compiler = webpack(webpackConfig)

const browserSync = require('browser-sync').create()
const serverConfig = require('../config/devserver.config.js')
const paths = require('../config/paths.config.js')
const pjson = require('../package.json')
const tunnelDomain = pjson.name.replace(/[^0-9a-z]/gi, '').substring(0, 20)
const store = require('./utils/store')
let isInit = false

sh.step(1, 2, 'Running the webpack compiler...\n')
const templateMiddleware = require('./utils/templateMiddleware')
const hotMiddleware = webpackHotMiddleware(compiler)
const devMiddleware = webpackDevMiddleware(compiler, {
  contentBase: paths.src,
  stats: {
    colors: true,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    modules: false
  }
})
const defaultMiddlewares = [templateMiddleware, devMiddleware, hotMiddleware]
const bsMiddlewares = (serverConfig.historyAPIFallback)
  ? [historyApiFallbackMiddleware()].concat(defaultMiddlewares)
  : defaultMiddlewares

compiler.plugin('done', () => {
  // store hash to reuse it like a global variable
  store.hash = compiler.records.hash
  // init the browserSync server once a first build is ready
  if (!isInit) process.nextTick(init)
})

function init () {
  isInit = true
  sh.log().step(2, 2, 'Starting the browser-sync server...\n')
  browserSync.init({
    server: {
      baseDir: paths.static
    },
    open: false,
    reloadOnRestart: true,
    notify: false,
    offline: serverConfig.offline || false,
    port: serverConfig.port || 3000,
    xip: !serverConfig.offline ? serverConfig.xip : false,
    tunnel: !serverConfig.offline && serverConfig.tunnel ? tunnelDomain : false,
    minify: false,
    middleware: bsMiddlewares,
    files: [
      path.join(paths.layouts, '**/*'),
      path.join(paths.content, '**/*'),
      path.join(paths.static, '**/*')
    ]
  })
}
