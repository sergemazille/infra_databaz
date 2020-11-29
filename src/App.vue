<template>
  <div id="app">
    <h1>DataBaZ</h1>
  </div>
  <router-view />
</template>

<script>
import { fetchConfigs } from '@/utils/localstorage.ts';

export default {
  async created() {
    const configs = await fetchConfigs();
    this.$store.dispatch('setConfigs', configs);
  },
};
</script>

<style lang="scss">
@import 'style/reset.css';
@import 'style/common.scss';
</style>
