<template>
  <div>
    <button data-selector="createButton" type="button" @click="handleCreate">Créer une configuration</button>

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

    <ConfigEditor
      v-if="selectedConfig"
      :config="selectedConfig"
      :isPristine="isSelectedConfigPristine"
      @updated="patchSelectedConfig"
      @saved="saveSelectedConfig"
    />
  </div>
</template>

<script>
import ConfigComponent from '@/components/Config';
import ConfigEditor from '@/components/ConfigEditor';
import { Configs } from '@/domain/Config.ts';
import { mapGetters } from 'vuex';
import { isEqual } from 'lodash';
import { createEmptyConfig } from '@/utils/configs.ts';
import { recoverConfigByUuid } from '@/utils/localstorage.ts';

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

  data() {
    return {
      recordedConfig: undefined,
    };
  },

  computed: {
    ...mapGetters(['selectedConfig']),

    isSelectedConfigPristine() {
      return isEqual(this.selectedConfig, this.recordedConfig);
    },
  },

  methods: {
    updateRecordedConfig() {
      this.recordedConfig = recoverConfigByUuid(this.selectedConfig.uuid);
    },

    selectConfig(configUuid) {
      this.$store.dispatch('setSelectedConfigUuid', configUuid);
      this.updateRecordedConfig();
    },

    saveSelectedConfig() {
      this.$store.dispatch('saveConfig', this.selectedConfig);
      this.updateRecordedConfig();
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

    handleCreate() {
      const newConfig = createEmptyConfig();
      this.$store.dispatch('saveConfig', newConfig);
      this.selectConfig(newConfig.uuid);
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
