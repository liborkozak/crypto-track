<template>
  <v-progress-linear
    v-if="this.loading"
    class="progress-bar"
    color="green"
    :indeterminate="true">
  </v-progress-linear>
</template>

<script>
export default {
  name: 'progress-bar',
  data(){
    return {
      loading: false
    };
  },
  created() {
    Axios.interceptors.request.use((config) => {
      this.loading = true;
      return config;
    }, (error) => {
      this.loading = false;
      return Promise.reject(error);
    });

    Axios.interceptors.response.use((response) => {
      this.loading = false;
      return response;
    }, (error) => {
      this.loading = false;
      return Promise.reject(error);
    });
  }
};
</script>
