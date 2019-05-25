import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    locale: {
      amountYouOwn: 'Amount you own',
      back: '< Back',
      name: 'Name',
      price: '$ Value',
      priceChange: 'last 24h',
      shortName: 'Short name',
      submit: 'Submit',
      since: 'Since',
      valueOfCoin: '$ value of your coin',
      website: 'Website'
    }
  },
  mutations: {

  },
  actions: {

  }
});
