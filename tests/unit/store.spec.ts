import { storeOptions } from '@/store/index';
import { createConfig } from '@tests/fixtures/configs';
import { createStore } from 'vuex';

const createVuexStore = () => createStore({ ...storeOptions });

describe('Store', () => {
  it('should store Configs', () => {
    const firstConfig = createConfig({ uuid: '1' });
    const secondConfig = createConfig({ uuid: '2' });
    const configs = [firstConfig, secondConfig];
    const store = createVuexStore();

    store.dispatch('setConfigs', [firstConfig, secondConfig]);

    expect(store.getters.configs).toStrictEqual(configs);
  });

  it('should store selected config uuid', () => {
    const randomConfig = createConfig();
    const testConfig = createConfig({ uuid: '54321' });
    const configs = [randomConfig, testConfig];
    const store = createVuexStore();

    store.dispatch('setConfigs', configs);
    store.dispatch('setSelectedConfigUuid', testConfig.uuid);

    expect(store.getters.selectedConfig.uuid).toBe('54321');
  });

  it('should fetch config by id', () => {
    const firstConfig = createConfig({ uuid: '1' });
    const secondConfig = createConfig({ uuid: '2' });
    const configs = [firstConfig, secondConfig];
    const store = createVuexStore();

    store.commit('storeConfigs', configs);
    const expectedConfig = store.getters.configByUuid(secondConfig.uuid);

    expect(expectedConfig.uuid).toBe('2');
  });

  it('should remove config by id', () => {
    const firstConfig = createConfig({ uuid: '1' });
    const secondConfig = createConfig({ uuid: '2' });
    const configs = [firstConfig, secondConfig];
    const store = createVuexStore();

    store.commit('storeConfigs', configs);
    store.dispatch('removeConfigByUuid', firstConfig.uuid);

    expect(store.state.configs.length).toBe(1);
  });

  it('should patch selected config', () => {
    const testConfig = createConfig({ name: "Config d'origine" });
    const store = createVuexStore();

    store.commit('storeConfigs', [testConfig]);
    store.commit('storeSelectedConfigUuid', testConfig.uuid);

    const updatedProperty = { name: 'Config renommée' };
    store.dispatch('patchSelectedConfig', updatedProperty);

    expect(store.getters.selectedConfig.name).toBe('Config renommée');
  });
});
