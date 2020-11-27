<template>
  <div>
    <h2>Configurations enregistrées</h2>
    <ul class="configs">
      <li :key="config.uuid" v-for="config in configs" class="config">
        <Config v-bind="{ config }" />
      </li>
    </ul>
  </div>
</template>

<script>
import { recoverConfigs } from '@/utils/localstorage';
import Config from '@/components/ConfigPill';

export default {
  components: {
    Config,
  },

  data() {
    return {
      configs: [],
    };
  },

  async created() {
    this.configs = await recoverConfigs();
  },
};
</script>

<style lang="scss" scoped>
.configs {
  display: flex;

  .config {
    margin-right: 12px;
  }
}
</style>
