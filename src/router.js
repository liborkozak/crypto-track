import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Currency from './views/Currency.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/currency/:id',
      name: 'currency',
      component: Currency
    }
  ]
});
