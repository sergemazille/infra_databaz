import { StoreOptions, createStore } from 'vuex';
import { fetchConfigs, storeConfig, unstoreConfig } from '@/utils/localstorage.ts';
import { Config } from '@/domain/Config';
import { displayDurationInMs } from '@/domain/Notification.ts';

export const storeOptions: StoreOptions<any> = {
  state: {
    configs: [],
    selectedConfigUuid: '',
    notification: null,
    restoredDbs: [],
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

    storeNotification(state, notification) {
      state.notification = notification;
    },

    removeNotification(state) {
      state.notification = null;
    },

    addToRestoredDbs(state, configUuid) {
      state.restoredDbs.push(configUuid);
    },

    removeFromRestoredDbs(state, configUuid) {
      const uuidIndex = state.restoredDbs.findIndex((item: string) => item === configUuid);
      state.restoredDbs.splice(uuidIndex, 1);
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

    setNotification({ commit }, notification) {
      commit('storeNotification', notification);

      setTimeout(() => {
        commit('removeNotification');
      }, displayDurationInMs);
    },

    addToRestoredDbs({ commit }, configUuid) {
      commit('addToRestoredDbs', configUuid);
    },

    removeFromRestoredDbs({ commit }, configUuid) {
      commit('removeFromRestoredDbs', configUuid);
    },
  },

  getters: {
    configs: state => state.configs,
    configByUuid: state => (configUuid: string) => state.configs.find((config: Config) => config.uuid === configUuid),
    selectedConfig: state => state.configs.find((config: Config) => config.uuid === state.selectedConfigUuid),
    notification: state => state.notification,
    restoredDbs: state => state.restoredDbs,
  },
};

export default createStore(storeOptions);
