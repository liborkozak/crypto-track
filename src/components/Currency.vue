<template>
  <v-card>
    <v-card-title><h4>121elkewjkdsjd;lsa</h4></v-card-title>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-tile>
        <v-list-tile-content>Calories:</v-list-tile-content>
        <v-list-tile-content class="align-end">1</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Fat:</v-list-tile-content>
        <v-list-tile-content class="align-end">2</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Carbs:</v-list-tile-content>
        <v-list-tile-content class="align-end">3</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Protein:</v-list-tile-content>
        <v-list-tile-content class="align-end">4</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Sodium:</v-list-tile-content>
        <v-list-tile-content class="align-end">5</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Calcium:</v-list-tile-content>
        <v-list-tile-content class="align-end">6</v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Iron:</v-list-tile-content>
        <v-list-tile-content class="align-end">7</v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
  export default {
    name: 'currency',
    created(){
      this.getCurrencyDetails();
    },
    methods: {
      getCurrencyDetails(){
        Axios.get('/cryptocurrency/1').then(console.log);
      }
    }
  };
</script>
