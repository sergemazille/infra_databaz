<template>
  <div>
    <button class="action harmless" data-selector="createButton" type="button" @click="createConfig">+ Créer une configuration</button>

    <ul class="configs">
      <li :key="config.uuid" v-for="config in configs" class="config">
        <ConfigComponent
          v-bind="{ config }"
          :isSelected="isConfigSelected(config.uuid)"
          @select="selectConfig(config.uuid)"
          @delete="deleteConfig(config.uuid)"
        />
      </li>
    </ul>

    <ConfigEditor
      v-if="selectedConfig"
      :config="selectedConfig"
      :isPristine="isSelectedConfigPristine"
      :showRollbackButton="showRollbackButton(selectedConfig.uuid)"
      @update="patchSelectedConfig"
      @save="saveSelectedConfig"
      @delete="deleteConfig(selectedConfig.uuid)"
      @savedb="saveDbWithSelectedConfig"
      @restoredb="restoreDbWithSelectedConfig"
      @rollback="rollbackWithSelectedConfig"
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
import { restoreDb, rollback, saveDb } from '@/utils/system.ts';

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
    ...mapGetters(['restoredDbs', 'selectedConfig']),

    isSelectedConfigPristine() {
      return isEqual(this.selectedConfig, this.recordedConfig);
    },
  },

  methods: {
    updateRecordedConfig() {
      if (!this.selectedConfig) {
        return;
      }

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

    deleteConfig(configUuid) {
      this.$store.dispatch('deleteConfigByUuid', configUuid);
    },

    isConfigSelected(configUuid) {
      return this.selectedConfig?.uuid === configUuid;
    },

    patchSelectedConfig(property) {
      this.$store.dispatch('patchSelectedConfig', property);
    },

    createConfig() {
      const newConfig = createEmptyConfig();
      this.$store.dispatch('saveConfig', newConfig);
      this.selectConfig(newConfig.uuid);
    },

    saveDbWithSelectedConfig() {
      if (!this.selectedConfig) {
        return;
      }

      saveDb(this.selectedConfig);
    },

    async restoreDbWithSelectedConfig() {
      if (!this.selectedConfig) {
        return;
      }

      const hasBeenRestored = await restoreDb(this.selectedConfig);
      if (hasBeenRestored) {
        this.$store.dispatch('addToRestoredDbs', this.selectedConfig.uuid);
      }
    },

    async rollbackWithSelectedConfig() {
      if (!this.selectedConfig) {
        return;
      }

      const hasBeenRollbacked = await rollback(this.selectedConfig);
      if (hasBeenRollbacked) {
        this.$store.dispatch('removeFromRestoredDbs', this.selectedConfig.uuid);
      }
    },

    showRollbackButton(configUuid) {
      return this.restoredDbs.includes(configUuid);
    },
  },

  created() {
    if (this.configs.length === 1) {
      this.selectConfig(this.configs[0].uuid);
    }
  },
};
</script>

<style lang="scss" scoped>
button {
  margin-bottom: 12px;
}

.configs {
  display: flex;
  margin-bottom: 24px;

  .config {
    margin-right: 12px;
  }
}

[data-selector='createButton'] {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
