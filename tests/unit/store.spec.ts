import { storeOptions } from '@/store/index';
import { createFixtureConfig } from '@/utils/configs';
import { createStore } from 'vuex';
import { storeConfig } from '@/utils/localstorage.ts';

jest.mock('@/utils/localstorage.ts', () => {
  return {
    storeConfig: jest.fn(),
  };
});

const createVuexStore = () => createStore({ ...storeOptions });

describe('Store', () => {
  it('should store Configs', () => {
    const firstConfig = createFixtureConfig({ uuid: '1' });
    const secondConfig = createFixtureConfig({ uuid: '2' });
    const configs = [firstConfig, secondConfig];
    const store = createVuexStore();

    store.dispatch('setConfigs', [firstConfig, secondConfig]);

    expect(store.getters.configs).toStrictEqual(configs);
  });

  it('should store selected config uuid', () => {
    const randomConfig = createFixtureConfig();
    const testConfig = createFixtureConfig({ uuid: '54321' });
    const configs = [randomConfig, testConfig];
    const store = createVuexStore();

    store.dispatch('setConfigs', configs);
    store.dispatch('setSelectedConfigUuid', testConfig.uuid);

    expect(store.getters.selectedConfig.uuid).toBe('54321');
  });

  it('should fetch config by id', () => {
    const firstConfig = createFixtureConfig({ uuid: '1' });
    const secondConfig = createFixtureConfig({ uuid: '2' });
    const configs = [firstConfig, secondConfig];
    const store = createVuexStore();

    store.commit('storeConfigs', configs);
    const expectedConfig = store.getters.configByUuid(secondConfig.uuid);

    expect(expectedConfig.uuid).toBe('2');
  });

  it('should remove config by id', () => {
    const firstConfig = createFixtureConfig({ uuid: '1' });
    const secondConfig = createFixtureConfig({ uuid: '2' });
    const configs = [firstConfig, secondConfig];
    const store = createVuexStore();

    store.commit('storeConfigs', configs);
    store.dispatch('removeConfigByUuid', firstConfig.uuid);

    expect(store.state.configs.length).toBe(1);
  });

  it('should patch selected config', () => {
    const testConfig = createFixtureConfig({ name: "Config d'origine" });
    const store = createVuexStore();

    store.commit('storeConfigs', [testConfig]);
    store.commit('storeSelectedConfigUuid', testConfig.uuid);

    const updatedProperty = { name: 'Config renommée' };
    store.dispatch('patchSelectedConfig', updatedProperty);

    expect(store.getters.selectedConfig.name).toBe('Config renommée');
  });

  it('should save a config', () => {
    const configToSave = createFixtureConfig();
    const store = createVuexStore();

    store.dispatch('saveConfig', configToSave);

    expect(storeConfig).toHaveBeenCalledTimes(1);
    expect(storeConfig).toHaveBeenCalledWith(configToSave);
  });
});
