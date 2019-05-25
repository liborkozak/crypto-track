module.exports = {
  devServer: {
    proxy: {
      '/cryptocurrencies': {
        target: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=50&convert=USD&CMC_PRO_API_KEY=7f43ecd8-d8a2-48d5-ad64-097572f639e6',
        changeOrigin: true,
        headers: {
          'X-CMC_PRO_API_KEY': '7f43ecd8-d8a2-48d5-ad64-097572f639e6'
        },
        ws: true
      },
      '/cryptocurrency/*': {
        target: 'https://pro-api.coinmarketcap.com',
        changeOrigin: true,
        headers: {
          'X-CMC_PRO_API_KEY': '7f43ecd8-d8a2-48d5-ad64-097572f639e6'
        },
        ws: true,
        pathRewrite: function (path) {
          let id = path.split('?id=')[1];
          return path.replace('/cryptocurrency?id=' + id, '/v1/cryptocurrency/info?id=' + id + '&CMC_PRO_API_KEY=7f43ecd8-d8a2-48d5-ad64-097572f639e6');
        }
      }
    }
  }
};
