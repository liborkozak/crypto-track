<template>
  <v-card v-if="!loading">
    <v-card-title>
      <v-avatar
      size="60px"
      >
      <img
      v-if="currencyData.logo"
      :src="currencyData.logo"
      alt="Avatar"
      >
    </v-avatar>
    <h4 class="currency-name">{{currencyData.name}} ({{currencyData.symbol}})</h4>
    <p class="currency-description">{{currencyData.description}}</p>
  </v-card-title>
  <v-divider></v-divider>
  <v-list dense>
    <v-list-tile>
      <v-list-tile-content>{{locale.website}}:</v-list-tile-content>
      <v-list-tile-content class="align-end">
        <a :href="currencyData.website" target="_blank">{{currencyData.website}}</a>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile>
      <v-list-tile-content>{{locale.since}}:</v-list-tile-content>
      <v-list-tile-content class="align-end">{{currencyData.since}}</v-list-tile-content>
    </v-list-tile>
    <v-list-tile>
      <v-list-tile-content>{{locale.amountYouOwn}}:</v-list-tile-content>
      <v-list-tile-content class="align-end">{{currencyData.amount}}</v-list-tile-content>
    </v-list-tile>
    <v-list-tile>
      <v-list-tile-content>{{locale.valueOfCoin}}:</v-list-tile-content>
      <v-list-tile-content class="align-end">${{currencyData.valueOfCoin}}</v-list-tile-content>
    </v-list-tile>
  </v-list>
</v-card>
</template>

<script>
export default {
  name: 'currency',
  data() {
    let locale = this.$store.state.locale;
    return {
      currencyData: {},
      currencyId: null,
      loading: true,
      locale: locale
    };
  },
  created(){
    let currencyId = this.currencyId = this.$route.params.id;
    this.getCurrencyDetails(currencyId);
  },
  methods: {
    /**
    * Sends request to get currency details
    *
    * @param {Number} currencyId
    */
    getCurrencyDetails(id){
      Axios.get('/cryptocurrency?id=' + id)
      .then(this.getCurrencyDetailsSuccessfully.bind(this));
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
    * Get currency details successfully
    * Parses response and saves currency data
    *
    * @param {Object} response Get currency response
    */
    getCurrencyDetailsSuccessfully(response){
      let currencyId = this.currencyId;

      let data = response.data.data[currencyId];

      let currencyInfo = this.getCurrencyInfo(currencyId);
      let amount =  currencyInfo.amount;

      let currencyData = {
        amount: amount,
        name: data.name,
        website: data.urls.website[0],
        logo: data.logo,
        symbol: data.symbol,
        description: data.description,
        since: this.parseDate(data.date_added),
        valueOfCoin: this.getCurrencySum(currencyInfo)
      };

      this.currencyData = currencyData;
      this.loading = false;
    },
    /**
    * Parses date into readable format
    *
    * @param {String} date Date string
    */
    parseDate(date){
      let since = new Date(date).toDateString();
      return since;
    }
  }
};
</script>

<style scoped lang="scss">
.currency-name {
  margin-left: 10px;
}
.currency-description {
  margin: 15px 10px 10px 10px;
}
</style>
