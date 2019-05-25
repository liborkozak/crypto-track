<template>
  <div id="app">
    <ProgressBar class="progress-bar"/>
    <div id="nav">
      <router-link
        to="/"
        v-if="this.$router.currentRoute.name !== 'home'"
        >
        {{this.$store.state.locale.back}}
      </router-link>
    </div>
    <router-view class="router-view"/>
  </div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar.vue';

export default {
  name: 'app',
  components: {
      ProgressBar
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 20px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.router-view {
  margin: 20px;
}
.progress-bar {
  bottom: 0;
  position: absolute !important;
  margin: 0 !important;
}
</style>
