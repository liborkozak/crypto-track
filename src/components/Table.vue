<template>
  <v-flex v-if="!loading">
    <v-spacer/>
    <h4 class="profit">{{locale.profit}}:
      <span v-bind:class="[profit > 0 ? 'positive' : 'negative']">{{Math.abs(profit)}}</span>
    </h4>
    <v-data-table :headers="headers" :items="cryptocurrencies" class="elevation-1" :rows-per-page-items="[10]" no-data-text>
      <template v-slot:items="prop">
        <tr>
          <td class="text-xs-center">
            <router-link :to="{ name: 'currency', params: { id: prop.item.currencyId} }">{{prop.item.name}}</router-link>
          </td>
          <td class="text-xs-center">{{prop.item.shortName}}</td>
          <td class="text-xs-center">${{prop.item.price}}</td>
          <td v-bind:class="[prop.item.priceChange > 0 ? 'positive' : 'negative', 'text-xs-center']">{{Math.abs(prop.item.priceChange)}}</td>
          <td class="text-xs-center customprice">
            <input type="number" class="numberfield" @keyup="numberfieldKeyup($event, prop.item)" v-model="prop.item.amount"/>
            <button class="submit" :disabled="!prop.item.amount" @click="submitSum(prop.item)">{{getSubmitText()}}</button>
          </td>
          <td class="text-xs-center">${{prop.item.sum}}</td>
        </tr>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
export default {
  data () {
    let locale = this.$store.state.locale;
    let data = {
      cryptocurrencies: [],
      headers: [{
        align: 'center',
        text: locale.name,
        value: 'name',
        width: '200px'
      },{
        align: 'center',
        text: locale.shortName,
        value: 'shortName'
      },{
        align: 'center',
        text: locale.price,
        value: 'price'
      }, {
        align: 'center',
        text: locale.priceChange,
        value: 'priceChange'
      }, {
        align: 'center',
        sortable: false,
        text: locale.amountYouOwn,
        value: 'amount'
      }, {
        align: 'center',
        text: locale.valueOfCoin,
        value: 'sum'
      }],
      intervalId: null,
      loading: true,
      locale: locale,
      profit: 0
    };
    return data;
  },
  created(){
    this.getCryptocurrencies();

    if(!this.intervalId){
      this.intervalId = setInterval(this.updateCryptocurrenciesData.bind(this), 60000);
    }
  },
  methods: {
    /**
    * Calculates profit since last user visit
    *
    * @param {Object[]} cryptocurrencies Array of cryptocurrencies data objects
    */
    calculateProfit(cryptocurrencies){
      let profit = 0;
      let storageKey = 'currency_';
      let storageData = localStorage;
      let current;
      let currentSum;
      let match;
      let matchSum;
      for(let item in storageData) {
        if(storageData.hasOwnProperty(item) && item.startsWith(storageKey)) {
          current = JSON.parse(storageData[item]);
          match = cryptocurrencies.find(this.findCurrencyById.bind(this, current.id));
          if(match){
            currentSum = this.getCurrencySum(current);
            matchSum = this.getCurrencySum(match);
            profit += matchSum - currentSum;
          }
        }
      }
      this.profit = profit;
    },
    /**
    * Array find callback function
    * Finds currency by id
    *
    * @param {Number} id Currency id
    * @param {Object} item Array item, currency data object
    * @return {Boolean} true if id matches any array item id
    */
    findCurrencyById(id, item){
      return id === item.currencyId;
    },
    /**
    * Sends the request to get cryptocurrencies
    */
    getCryptocurrencies(){
      Axios.get('/cryptocurrencies')
      .then(this.getCryptocurrenciesSuccessfully.bind(this));
    },
    /**
    * On get cryptocurrencies successfully
    *
    * @param {Object} response Cryptocurrencies response
    */
    getCryptocurrenciesSuccessfully(response){
      let data = response.data.data;
      let cryptocurrencies = [];
      let current;
      let storageData;
      let item = data.length;
      while(item--) {
        current = data[item];
        storageData = this.getCurrencyInfo(current.id);

        cryptocurrencies.push({
          amount: storageData.amount || '',
          sum: this.getCurrencySum(storageData),
          currencyId: current.id,
          name: current.name,
          shortName: current.symbol,
          price: current.quote.USD.price,
          priceChange: current.quote.USD.percent_change_24h
        });
      }

      this.cryptocurrencies = cryptocurrencies;
      this.loading = false;
      this.calculateProfit(cryptocurrencies);
    },
    /**
    * Get currency info from local storage
    *
    * @param {Number} id Currency id
    */
    getCurrencyInfo(id){
      let storageData = localStorage.getItem('currency_' + id);
      let currencyInfo = storageData ? JSON.parse(storageData) : {};
      return currencyInfo;
    },
    /**
    * Get currency sum
    *
    * @param {Object} info Currency info
    */
    getCurrencySum(info) {
      let result = 0;
      if(info.amount && info.price) {
        result = info.amount * info.price;
      }
      return result;
    },
    /**
    * Get submit button text form locale
    *
    * @return {String} Submit button text from locale
    */
    getSubmitText(){
      return this.$store.state.locale.submit;
    },
    /**
    * On numberfield keyup event listener
    * Submits amount on enter key pressed
    *
    * @param {Event} event Keyup Event
    * @param {Object} rowData Row data object
    */
    numberfieldKeyup(event, rowData) {
      // 13 = ENTER
      if(event.keyCode === 13) {
        this.submitSum(rowData);
      }
    },
    /**
    * Save currency info to localStorage
    *
    * @param {Number} id Currency id
    * @param {Number} price Currency price
    * @param {Number} amount Currency amount
    */
    saveCurrencyInfo(id, price, amount){
      let storageItemKey = 'currency_' + id;
      if(amount === 0) {
        localStorage.removeItem(storageItemKey);
      }else {
        localStorage.setItem(storageItemKey, JSON.stringify({
          amount,
          price,
          id
        }));
      }
    },
    /**
    * Submits sum if amount is positive
    *
    * @param {object} rowData Row data object
    */
    submitSum(rowData){
      let amount = parseFloat(rowData.amount);
      if(amount >= 0) {
        Object.assign(rowData, {
          sum: amount * rowData.price,
          value: ''
        });
        rowData.amount = amount || '';
        this.saveCurrencyInfo(rowData.currencyId, rowData.price, rowData.amount);
      }
    },
    /**
    * Manages update cryptocurrencies data interval
    */
    updateCryptocurrenciesData(){
      if(this.$route.name === 'home') {
        this.getCryptocurrencies();
      } else {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.customprice {
  display: grid;
  margin: 10px;
}
.negative {
  color: red;
}
.numberfield {
  -moz-appearance: textfield;
  text-align: center;
  text-decoration: none;
  margin: 0;
  padding: 5px;
  outline: none;
  border: 1px solid black;
  &::-webkit-outer-spin-button,&::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
.positive {
  color: green;
}
.profit {
  margin: 15px;
}
.submit {
  background-color: darkgray;
  color: white;
  text-align: center;
  text-decoration: none;
  margin: 5px 0 0 0;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  padding: 3px;
}
.submit:disabled {
  background-color: lightgray;
  cursor: default;
}
.submit:disabled:hover {
  background-color: lightgray;
}
.submit:hover {
  background-color: gray;
}
tr:nth-child(2n) {
  background-color: #EEEEEE;
}
</style>
