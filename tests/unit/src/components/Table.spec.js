import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Table from '@/components/Table.vue';
import Axios from 'axios';
import Vuetify from 'vuetify';

window.Axios = Axios;


const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('Testing Table.vue', () => {
  let store = new Vuex.Store({
    state: {
      locale: {}
    }
  });
  const wrapper = shallowMount(Table, { store, localVue });

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
      let response = {
        data: {
          "data": [{"id":1,"name":"Bitcoin","symbol":"BTC","slug":"bitcoin","cmc_rank":5,"num_market_pairs":500,"circulating_supply":16950100,"total_supply":16950100,"max_supply":21000000,"last_updated":"2018-06-02T22:51:28.209Z","date_added":"2013-04-28T00:00:00.000Z","tags":["mineable"],"platform":null,"quote":{"USD":{"price":9283.92,"volume_24h":7155680000,"percent_change_1h":-0.152774,"percent_change_24h":-0.518894,"percent_change_7d":0.986573,"market_cap":158055024432,"last_updated":"2018-08-09T22:53:32.000Z"},"BTC":{"price":1,"volume_24h":772012,"percent_change_1h":0,"percent_change_24h":0,"percent_change_7d":0,"market_cap":17024600,"last_updated":"2018-08-09T22:53:32.000Z"}}},{"id":1,"name":"Bitcoin","symbol":"BTC","slug":"bitcoin","cmc_rank":5,"num_market_pairs":500,"circulating_supply":16950100,"total_supply":16950100,"max_supply":21000000,"last_updated":"2018-06-02T22:51:28.209Z","date_added":"2013-04-28T00:00:00.000Z","tags":["mineable"],"platform":null,"quote":{"USD":{"price":9283.92,"volume_24h":7155680000,"percent_change_1h":-0.152774,"percent_change_24h":0.518894,"percent_change_7d":0.986573,"market_cap":158055024432,"last_updated":"2018-08-09T22:53:32.000Z"},"BTC":{"price":1,"volume_24h":772012,"percent_change_1h":0,"percent_change_24h":0,"percent_change_7d":0,"market_cap":17024600,"last_updated":"2018-08-09T22:53:32.000Z"}}}],"status": {"timestamp": "2018-06-02T22:51:28.209Z","error_code": 0,"error_message": "","elapsed": 10,"credit_count": 1}
        }
      };
      expect(wrapper.vm.getCryptocurrenciesSuccessfully.bind(wrapper.vm, response)).not.toThrow();
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

  describe('Testing roundToTwoDecimals method', () => {
    it(' - method should throw when called - case no args', () => {
      expect(wrapper.vm.roundToTwoDecimals).toThrow();
    });

    it(' - method should return 0.00 - case arg value is 0', () => {
      let result = wrapper.vm.roundToTwoDecimals(0);
      expect(result).toBe(0.00);
    });

    it(' - method should return 0.00 - case arg value is 0.00', () => {
      let result = wrapper.vm.roundToTwoDecimals(0.00);
      expect(result).toBe(0.00);
    });

    it(' - method should throw when called - case arg value is "0.00"', () => {
      expect(wrapper.vm.roundToTwoDecimals.bind(wrapper.vm, '0.00')).toThrow();
    });

    it(' - method should return 1.00 - case arg value is 1', () => {
      let result = wrapper.vm.roundToTwoDecimals(1);
      expect(result).toBe(1.00);
    });

    it(' - method should return 1.00 - case arg value is 1.00', () => {
      let result = wrapper.vm.roundToTwoDecimals(1.00);
      expect(result).toBe(1.00);
    });

    it(' - method should throw when called - case arg value is "1.00"', () => {
      expect(wrapper.vm.roundToTwoDecimals.bind(wrapper.vm, '1.00')).toThrow();
    });

    it(' - method should return -1.00 - case arg value is -1', () => {
      let result = wrapper.vm.roundToTwoDecimals(-1);
      expect(result).toBe(-1.00);
    });

    it(' - method should return -1.00 - case arg value is -1.00', () => {
      let result = wrapper.vm.roundToTwoDecimals(-1.00);
      expect(result).toBe(-1.00);
    });

    it(' - method should throw when called - case arg value is "-1.00"', () => {
      expect(wrapper.vm.roundToTwoDecimals.bind(wrapper.vm, '-1.00')).toThrow();
    });

  });

});
