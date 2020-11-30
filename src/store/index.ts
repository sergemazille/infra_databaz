import { StoreOptions, createStore } from 'vuex';
import { fetchConfigs, storeConfig, unstoreConfig } from '@/utils/localstorage.ts';
import { Config } from '@/domain/Config';

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

    loadConfigs({ commit }) {
      // fetch from localstorage
      const configs = fetchConfigs();

      commit('storeConfigs', configs);
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

    deleteConfigByUuid({ commit }, configUuid) {
      // delete from localstorage
      unstoreConfig(configUuid);

      commit('deleteConfigByUuid', configUuid);
    },
  },

  getters: {
    configs: state => state.configs,
    configByUuid: state => (configUuid: string) => state.configs.find((config: Config) => config.uuid === configUuid),
    selectedConfig: state => state.configs.find((config: Config) => config.uuid === state.selectedConfigUuid),
  },
};

export default createStore(storeOptions);
