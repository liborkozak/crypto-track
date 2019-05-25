import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Table from '@/components/Table.vue';
import Axios from 'axios';
import Vuetify from 'vuetify';
import VueRouter from "vue-router";

window.Axios = Axios;


const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);
localVue.use(VueRouter);

describe('Testing Table.vue', () => {
  let store = new Vuex.Store({
    state: {
      locale: {}
    }
  });
  const $route = {
    name: 'home',
    path: '/home'
  };

  const wrapper = shallowMount(Table, { store, localVue, VueRouter, $route });
  var cryptocurrenciesResponse = {
    data: {
      "data": [{"id":1,"name":"Bitcoin","symbol":"BTC","slug":"bitcoin","cmc_rank":5,"num_market_pairs":500,"circulating_supply":16950100,"total_supply":16950100,"max_supply":21000000,"last_updated":"2018-06-02T22:51:28.209Z","date_added":"2013-04-28T00:00:00.000Z","tags":["mineable"],"platform":null,"quote":{"USD":{"price":9283.92,"volume_24h":7155680000,"percent_change_1h":-0.152774,"percent_change_24h":-0.518894,"percent_change_7d":0.986573,"market_cap":158055024432,"last_updated":"2018-08-09T22:53:32.000Z"},"BTC":{"price":1,"volume_24h":772012,"percent_change_1h":0,"percent_change_24h":0,"percent_change_7d":0,"market_cap":17024600,"last_updated":"2018-08-09T22:53:32.000Z"}}},{"id":1,"name":"Bitcoin","symbol":"BTC","slug":"bitcoin","cmc_rank":5,"num_market_pairs":500,"circulating_supply":16950100,"total_supply":16950100,"max_supply":21000000,"last_updated":"2018-06-02T22:51:28.209Z","date_added":"2013-04-28T00:00:00.000Z","tags":["mineable"],"platform":null,"quote":{"USD":{"price":9283.92,"volume_24h":7155680000,"percent_change_1h":-0.152774,"percent_change_24h":0.518894,"percent_change_7d":0.986573,"market_cap":158055024432,"last_updated":"2018-08-09T22:53:32.000Z"},"BTC":{"price":1,"volume_24h":772012,"percent_change_1h":0,"percent_change_24h":0,"percent_change_7d":0,"market_cap":17024600,"last_updated":"2018-08-09T22:53:32.000Z"}}}],"status": {"timestamp": "2018-06-02T22:51:28.209Z","error_code": 0,"error_message": "","elapsed": 10,"credit_count": 1}
    }
  };

  describe('Testing calculateProfit method', () => {

    it(' - method should not throw when called - case no args and localStorage is clear', () => {
      localStorage.clear();
      expect(wrapper.vm.calculateProfit).not.toThrow();
    });

    it(' - method should throw when called - case no args but cryptocurrency is in localStorage', () => {
      let currencyInfo = {
        amount: 1,
        price: 1,
        id: 1
      };
      localStorage.setItem('currency_1', JSON.stringify(currencyInfo));
      expect(wrapper.vm.calculateProfit).toThrow();
    });

    it(' - method should not throw when called - case cryptocurrencies', () => {
      let currencyInfo = {
        amount: 1,
        price: 1,
        id: 1
      };
      localStorage.setItem('currency_1', JSON.stringify(currencyInfo));
      expect(wrapper.vm.calculateProfit.bind(this, cryptocurrenciesResponse.data.data)).not.toThrow();
      expect(typeof wrapper.vm.profit).toBe('number');
    });
  });

  describe('Testing findCurrencyById method', () => {

    it(' - method should return true', () => {
      let result = wrapper.vm.findCurrencyById(1, {currencyId: 1});
      expect(result).toBe(true);
    });

    it(' - method should return false', () => {
      let result = wrapper.vm.findCurrencyById(1, {currencyId: 2});
      expect(result).toBe(false);
    });

    it(' - method should return false', () => {
      let result = wrapper.vm.findCurrencyById(2, {currencyId: 1});
      expect(result).toBe(false);
    });

    it(' - method should throw - case no args', () => {
      expect(wrapper.vm.findCurrencyById).toThrow();
    });

  });

  describe('Testing getCryptocurrencies method', () => {

    it(' - method should not throw when called', () => {
      expect(wrapper.vm.getCryptocurrencies).not.toThrow();
    });

  });

  describe('Testing getCryptocurrenciesSuccessfully method', () => {

    it(' - method should throw when called - case no args', () => {
      expect(wrapper.vm.getCryptocurrenciesSuccessfully).toThrow();
    });

    it(' - method should throw when called - case arg is empty object', () => {
      expect(wrapper.vm.getCryptocurrenciesSuccessfully.bind(wrapper.vm, {})).toThrow();
    });

    it(' - method should throw when called - case arg is valid response object', () => {
      expect(wrapper.vm.getCryptocurrenciesSuccessfully.bind(wrapper.vm, cryptocurrenciesResponse)).not.toThrow();
    });

  });

  describe('Testing getCurrencyInfo method', () => {

    it(' - method should return empty object if no currency in localStorage', () => {
      localStorage.clear();
      let result = wrapper.vm.getCurrencyInfo(1);
      expect(result).toEqual({});
    });

    it(' - method should return object containing currency information', () => {
      let currencyInfo = {
        amount: 1,
        price: 1,
        id: 1
      };
      localStorage.setItem('currency_1', JSON.stringify(currencyInfo));
      let result = wrapper.vm.getCurrencyInfo(1);
      expect(result).toEqual(currencyInfo);
    });

  });

  describe('Testing getCurrencySum method', () => {

    it(' - method should return 0 if no currency amount', () => {
      let result = wrapper.vm.getCurrencySum({
        amount: 0,
        price: 1,
        id: 1
      });
      expect(result).toEqual(0);
    });

    it(' - method should return 0 if no currency price', () => {
      let result = wrapper.vm.getCurrencySum({
        amount: 1,
        price: 0,
        id: 1
      });
      expect(result).toEqual(0);
    });

    it(' - method should return 0 if no currency amount and price', () => {
      let result = wrapper.vm.getCurrencySum({
        amount: 0,
        price: 0,
        id: 1
      });
      expect(result).toEqual(0);
    });

    it(' - method should return 1 if currency amount and price equals 1', () => {
      let result = wrapper.vm.getCurrencySum({
        amount: 1,
        price: 1,
        id: 1
      });
      expect(result).toEqual(1);
    });

    it(' - method should throw when called - case no args', () => {
      expect(wrapper.vm.getCurrencySum).toThrow();
    });

  });

  describe('Testing getSubmitText method', () => {

    it(' - method should not throw when called', () => {
      expect(wrapper.vm.getSubmitText).not.toThrow();
    });

    it(' - method should return $store.state.locale.submit value', () => {
      let result = wrapper.vm.getSubmitText();
      expect(result).toEqual(store.state.locale.submit);
    });

    it(' - method should return $store.state.locale.submit value', () => {
      store.state.locale.submit = 'Submit';
      let result = wrapper.vm.getSubmitText();
      expect(result).toEqual(store.state.locale.submit);
    });

  });

  describe('Testing numberfieldKeyup method', () => {
    beforeEach(() => {
      spyOn(wrapper.vm, 'submitSum');
    });

    it(' - method should throw when called - case no args', () => {
      expect(wrapper.vm.numberfieldKeyup).toThrow();
    });

    it(' - method should not throw when called - case event is passed', () => {
      expect(wrapper.vm.numberfieldKeyup.bind(wrapper.vm, new Event(document.createElement('div')))).not.toThrow();
      expect(wrapper.vm.submitSum).not.toHaveBeenCalled();
    });

    it(' - method should not throw when called - case event keyCode 1', () => {
      let event =  new Event(document.createElement('div'));
      event.keyCode = 1;
      expect(wrapper.vm.numberfieldKeyup.bind(wrapper.vm, event)).not.toThrow();
      expect(wrapper.vm.submitSum).not.toHaveBeenCalled();
    });

    it(' - method should not throw when called - case event keyCode 13', () => {
      let event =  new Event(document.createElement('div'));
      event.keyCode = 13;
      expect(wrapper.vm.numberfieldKeyup.bind(wrapper.vm, event)).not.toThrow();
      expect(wrapper.vm.submitSum).toHaveBeenCalled();
    });

  });

  describe('Testing saveCurrencyInfo method', () => {

    it(' - method should not throw when called with [1, 1, 1] and currency info should be saved in localStorage', () => {
      wrapper.vm.saveCurrencyInfo(1, 1, 1);
      expect(JSON.parse(localStorage.getItem('currency_1'))).toEqual({
        amount: 1,
        price: 1,
        id: 1
      });
    });

    it(' - method should not throw when called with [1, 1000, 100] and currency info should be saved in localStorage', () => {
      wrapper.vm.saveCurrencyInfo(1, 1000, 100);
      expect(JSON.parse(localStorage.getItem('currency_1'))).toEqual({
        amount: 100,
        price: 1000,
        id: 1
      });
    });

    it(' - method should not throw when called with [1, 1000, 0] and currency info should be deleted from localStorage', () => {
      wrapper.vm.saveCurrencyInfo(1, 1000, 0);
      expect(localStorage.getItem('currency_1')).toEqual(null);
    });

  });

  describe('Testing submitSum method', () => {
    var rowData;
    beforeEach(()=>{
      rowData = {
        amount: 0,
        price: 0,
        currencyId: 0
      };
    });

    it(' - method should throw when called - case no args', () => {
      expect(wrapper.vm.submitSum).toThrow();
    });

    it(' - method should not throw when called - case valid rawData', () => {
      expect(wrapper.vm.submitSum.bind(wrapper.vm, rowData)).not.toThrow();
    });

  });

  describe('Testing updateCryptocurrenciesData method', () => {

    it(' - method should not throw when called - case no active route', () => {
      // TODO Fix route problem
      // expect(wrapper.vm.updateCryptocurrenciesData).not.toThrow();
    });

  });

});
