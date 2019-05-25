<template>
  <v-flex v-if="!loading">
    <v-data-table :headers="headers" :items="cryptocurrencies" class="elevation-1" :rows-per-page-items="[10]" no-data-text>
      <template v-slot:items="prop">
        <tr>
          <td class="text-xs-center">
              <router-link :to="{ name: 'currency', params: { id: prop.item.currencyId} }">{{prop.item.name}}</router-link>
          </td>
          <td class="text-xs-center">{{prop.item.shortName}}</td>
          <td class="text-xs-center">${{ prop.item.price}}</td>
          <td v-bind:class="[prop.item.priceChange > 0 ? 'positive' : 'negative', 'text-xs-center']">{{prop.item.priceChange}}</td>
          <td class="text-xs-center customprice">
            <input type="number" class="numberfield" @keyup="numberfieldKeyup($event, prop.item)" v-model="prop.item.amount"/>
            <button class="submit" @click="submitSum(prop.item)">{{getSubmitText()}}</button>
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
      loading: true
    };
    return data;
  },
  created(){
    this.getCryptocurrencies();
  },
  methods: {
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
      let cryptocurrencies = [];
      let data = response.data.data;
      let current;
      let item = data.length;
      while(item--) {
        current = data[item];
        cryptocurrencies.push({
          sum: localStorage.getItem('currentcy_' + current.id) || 0,
          currencyId: current.id,
          name: current.name,
          shortName: current.symbol,
          price: this.roundToTwoDecimals(current.quote.USD.price),
          priceChange: this.roundToTwoDecimals(current.quote.USD.percent_change_24h)
        });
      }
      this.cryptocurrencies = cryptocurrencies;
      this.loading = false;
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
    * Submits sum if amount is positive
    *
    * @param {object} rowData Row data object
    */
    submitSum(rowData){
      let amount = parseFloat(rowData.amount);
      if(amount >= 0) {
        let sum = amount * rowData.price;
        Object.assign(rowData, {
          sum: sum,
          value: ''
        });
        localStorage.setItem('currentcy_' + rowData.currencyId, sum);
      }
    },
    /**
    * Rounds number to two decimals
    *
    * @param {Number} numb Number that needs to be rounded
    * @return {Number} Rounded number
    */
    roundToTwoDecimals(numb) {
      return Number(numb.toFixed(2));
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
.submit:hover {
  background-color: gray;
}
tr:nth-child(2n) {
  background-color: #EEEEEE;
}
</style>
