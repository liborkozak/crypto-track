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
    }
  },
  created(){
    let currencyId = this.currencyId = this.$route.params.id;
    this.getCurrencyDetails(currencyId);
  },
  methods: {
    getCoinValue() {
        return Number(localStorage.getItem('currentcy_' + this.currencyId)) || 0;
    },
    getCurrencyDetails(id){
      Axios.get('/cryptocurrency?id=' + id)
      .then(this.getCurrencyDetailsSuccessfully.bind(this));
    },
    getCurrencyDetailsSuccessfully(response){
      let data = response.data.data[this.currencyId];
      let currencyData = {
        name: data.name,
        website: data.urls.website[0],
        logo: data.logo,
        symbol: data.symbol,
        description: data.description,
        since: this.parseDate(data.date_added),
        valueOfCoin: this.getCoinValue()
      }
      this.currencyData = currencyData;
      this.loading = false;
    },
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
