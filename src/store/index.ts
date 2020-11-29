import { Config } from '@/domain/Config';
import { createStore, StoreOptions } from 'vuex';
import { deleteConfigByUuid, storeConfig } from '@/utils/localstorage.ts';

export const storeOptions: StoreOptions<any> = {
  state: {
    configs: [],
    selectedConfigUuid: '',
  },

  mutations: {
    storeConfigs(state, configs) {
      state.configs = configs;
    },

    deleteConfigByUuid(state, configUuid) {
      state.configs = [...state.configs].filter((config: Config) => {
        return config.uuid !== configUuid;
      });
    },

    storeSelectedConfigUuid(state, configUuid) {
      state.selectedConfigUuid = configUuid;
    },

    updateConfig(state, updatedConfig) {
      const selectedConfigIndex = state.configs.findIndex((config: Config) => config.uuid === state.selectedConfigUuid);
      state.configs.splice(selectedConfigIndex, 1, updatedConfig);
    },

    storeConfig(state, config) {
      state.configs.push(config);
    },
  },

  actions: {
    setConfigs({ commit }, configs) {
      commit('storeConfigs', configs);
    },

    deleteConfigByUuid({ commit }, configUuid) {
      // delete from localstorage
      deleteConfigByUuid(configUuid);

      commit('deleteConfigByUuid', configUuid);
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

      commit('updateConfig', updatedConfig);
    },

    saveConfig({ commit, getters }, configToSave) {
      // store in localstorage
      storeConfig(configToSave);

      // store in state if it doesn't already exist
      const doesAlreadyExist = getters.configByUuid(configToSave.uuid);
      if (!doesAlreadyExist) {
        commit('storeConfig', configToSave);
      }
    },
  },

  getters: {
    configs: state => state.configs,
    configByUuid: state => (configUuid: string) => state.configs.find((config: Config) => config.uuid === configUuid),
    selectedConfig: state => state.configs.find((config: Config) => config.uuid === state.selectedConfigUuid),
  },
};

export default createStore(storeOptions);
