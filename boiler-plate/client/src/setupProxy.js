const proxy = require("http-proxy-middleware");

/**
 * CROSS 이슈로 인해 proxy 사용
 * @param app
 */
module.exports = function (app) {
  app.use(
    "/api",
    proxy({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  )
}
