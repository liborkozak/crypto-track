module.exports = {
  devServer: {
    proxy: {
      '/cryptocurrencies': {
        target: 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=50&convert=USD&CMC_PRO_API_KEY=63c5f483-1133-4268-9f30-f22ada807c90',
        changeOrigin: true,
        headers: {
          'X-CMC_PRO_API_KEY': '63c5f483-1133-4268-9f30-f22ada807c90'
        },
        ws: true
      },
      '/cryptocurrency/*': {
        target: 'https://sandbox-api.coinmarketcap.com',
        changeOrigin: true,
        headers: {
          'X-CMC_PRO_API_KEY': '63c5f483-1133-4268-9f30-f22ada807c90'
        },
        ws: true,
        pathRewrite: function (path, req) {
          let id = path.split('?id=')[1];
          return path.replace('/cryptocurrency?id=' + id, '/v1/cryptocurrency/info?id=' + id + '&CMC_PRO_API_KEY=63c5f483-1133-4268-9f30-f22ada807c90');
        }
      }
    }
  }
};
