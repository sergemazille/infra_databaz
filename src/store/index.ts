import { Config } from '@/domain/Config';
import { createStore, StoreOptions } from 'vuex';

export const storeOptions: StoreOptions<any> = {
  state: {
    configs: [],
    selectedConfigUuid: '',
  },

  mutations: {
    storeConfigs(state, configs) {
      state.configs = configs;
    },

    removeConfigByUuid(state, configUuid) {
      state.configs = [...state.configs].filter((config: Config) => {
        return config.uuid !== configUuid;
      });
    },

    storeSelectedConfigUuid(state, configUuid) {
      state.selectedConfigUuid = configUuid;
    },

    updateSelectedConfig(state, updatedConfig) {
      const selectedConfigIndex = state.configs.findIndex((config: Config) => config.uuid === state.selectedConfigUuid);
      state.configs.splice(selectedConfigIndex, 1, updatedConfig);
    },
  },

  actions: {
    setConfigs({ commit }, configs) {
      commit('storeConfigs', configs);
    },

    removeConfigByUuid({ commit }, configUuid) {
      commit('removeConfigByUuid', configUuid);
    },

    setSelectedConfigUuid({ commit }, configUuid) {
      commit('storeSelectedConfigUuid', configUuid);
    },

    patchSelectedConfig({ commit, getters }, property) {
      const { selectedConfig } = getters;

      const updatedConfig = {
        ...selectedConfig,
        ...property,
      };

      commit('updateSelectedConfig', updatedConfig);
    },
  },

  getters: {
    configs: state => state.configs,
    configByUuid: state => (configUuid: string) => state.configs.find((config: Config) => config.uuid === configUuid),
    selectedConfig: state => state.configs.find((config: Config) => config.uuid === state.selectedConfigUuid),
  },
};

export default createStore(storeOptions);
