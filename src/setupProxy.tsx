const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/traces',
    createProxyMiddleware({
      target: 'http://localhost:16686',
      changeOrigin: true,
      pathRewrite: {
        '^/api/traces': '/api/traces',
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error('[Proxy Error]', err);
      }
    })
  );
};