<template>
  <div>
    <ConfigList />
  </div>
</template>

<script>
import ConfigList from './ConfigList.vue';

export default {
  components: { ConfigList },
  // created() {
  //   const config = createConfig();
  //   console.log('=== config ===>', config);
  //   saveConfig(config);
  // },
};
</script>

<style lang="scss" scoped></style>
