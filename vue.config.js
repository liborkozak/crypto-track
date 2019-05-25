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
      }
    }
  }
};
