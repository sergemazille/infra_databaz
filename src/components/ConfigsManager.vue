<template>
  <div>
    <ul class="configs">
      <li :key="config.uuid" v-for="config in configs" class="config">
        <ConfigComponent
          v-bind="{ config }"
          :isSelected="isConfigSelected(config.uuid)"
          @selected="selectConfig(config.uuid)"
          @removed="removeConfig(config.uuid)"
        />
      </li>
    </ul>

    <ConfigEditor v-if="selectedConfig" :config="selectedConfig" :isPristine="isSelectedConfigPristine" @updated="patchSelectedConfig" />
  </div>
</template>

<script>
import ConfigComponent from '@/components/Config';
import ConfigEditor from '@/components/ConfigEditor';
import { Configs } from '@/domain/Config.ts';
import { mapGetters } from 'vuex';
import { recoverConfigByUuid } from '@/utils/localstorage';
import { isEqual } from 'lodash';

export default {
  components: {
    ConfigComponent,
    ConfigEditor,
  },

  props: {
    configs: {
      type: Configs,
      default: () => [],
    },
  },

  computed: {
    ...mapGetters(['selectedConfig']),

    recordedConfig() {
      return recoverConfigByUuid(this.selectedConfig.uuid);
    },

    isSelectedConfigPristine() {
      return isEqual(this.selectedConfig, this.recordedConfig);
    },
  },

  methods: {
    selectConfig(configUuid) {
      this.$store.dispatch('setSelectedConfigUuid', configUuid);
    },

    removeConfig(configUuid) {
      this.$store.dispatch('removeConfigByUuid', configUuid);
    },

    isConfigSelected(configUuid) {
      return this.selectedConfig?.uuid === configUuid;
    },

    patchSelectedConfig(property) {
      this.$store.dispatch('patchSelectedConfig', property);
    },
  },
};
</script>

<style lang="scss" scoped>
.configs {
  display: flex;
  margin-bottom: 24px;

  .config {
    margin-right: 12px;
  }
}
</style>
