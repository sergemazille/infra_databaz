import * as configUtils from '@/utils/configs';
import { createFixtureConfig, refFixtureConfig } from '@/utils/configs';
import { restoreDb, rollback, saveDb } from '@/utils/system.ts';
import ConfigComponent from '@/components/Config.vue';
import ConfigEditor from '@/components/ConfigEditor.vue';
import Controller from '@/components/Controller.vue';
import { shallowMount } from '@vue/test-utils';
import store from '@/store/index';
import { mocked } from 'ts-jest/utils';

jest.mock('@/utils/system.ts', () => {
  return {
    browseForSshPrivateKey: jest.fn(),
    saveDb: jest.fn(),
    restoreDb: jest.fn(),
    rollback: jest.fn(),
  };
});

jest.spyOn(configUtils, 'createEmptyConfig').mockImplementation(() => {
  return refFixtureConfig;
});

const createWrapper = (opts: any = {}) => {
  return shallowMount(Controller, {
    global: {
      plugins: [store],
    },

    ...opts,
  });
};

describe('Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
    store.commit('storeConfigs', []);
    store.commit('storeSelectedConfigUuid', '');
  });

  it('should display configs', () => {
    const props = {
      configs: [createFixtureConfig(), createFixtureConfig()],
    };
    const wrapper = createWrapper({ props });

    const configsWrappers = wrapper.findAllComponents(ConfigComponent);

    expect(configsWrappers.length).toEqual(2);
  });

  it('should have no selected config by default', () => {
    const props = {
      configs: [createFixtureConfig()],
    };
    const wrapper = createWrapper({ props });

    expect(wrapper.vm.selectedConfigUuid).toBeFalsy();
  });

  it("should dispatch selected config's uuid", async () => {
    expect.assertions(2);

    const firstConfig = createFixtureConfig({ uuid: '12345' });
    const secondConfig = createFixtureConfig({ uuid: '54321' });
    const props = { configs: [firstConfig, secondConfig] };
    const wrapper = createWrapper({ props });
    await wrapper.vm.$nextTick();
    jest.spyOn(wrapper.vm.$store, 'dispatch');

    const firstConfigWrapper = wrapper.findComponent(ConfigComponent);
    firstConfigWrapper.trigger('select');
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('setSelectedConfigUuid', '12345');
  });

  it('should delete specified config', () => {
    const firstConfig = createFixtureConfig({ uuid: '1' });
    const secondConfig = createFixtureConfig({ uuid: '2' });
    const props = { configs: [firstConfig, secondConfig] };
    const wrapper = createWrapper({ props });
    jest.spyOn(wrapper.vm.$store, 'dispatch');

    const firstConfigWrapper = wrapper.findComponent(ConfigComponent);
    firstConfigWrapper.trigger('delete');

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith('deleteConfigByUuid', '1');
  });

  it('should give selected config component the correct isSelected props', async () => {
    expect.assertions(1);

    const selectedConfig = createFixtureConfig({ uuid: '12345' });
    const randomConfig = createFixtureConfig();
    const configs = [selectedConfig, randomConfig];

    const props = { configs };
    const wrapper = createWrapper({ props });
    store.commit('storeConfigs', configs);
    store.commit('storeSelectedConfigUuid', '12345');
    await wrapper.vm.$nextTick();
    const selectedConfigWrapper = wrapper.findComponent(ConfigComponent);

    expect(selectedConfigWrapper.vm.isSelected).toBe(true);
  });

  it('should give config editor correct selected config properties', async () => {
    expect.assertions(2);

    const wrapper = createWrapper();
    const selectedConfig = createFixtureConfig({ uuid: '12345', dbPort: '3307', dbUsername: 'luke' });
    store.commit('storeConfigs', [selectedConfig]);
    store.commit('storeSelectedConfigUuid', '12345');
    await wrapper.vm.$nextTick();
    const configEditorWrapper = wrapper.findComponent(ConfigEditor);

    expect(configEditorWrapper.vm.config.dbPort).toBe('3307');
    expect(configEditorWrapper.vm.config.dbUsername).toBe('luke');
  });

  it('should not display config editor if there is no selected config', async () => {
    expect.assertions(1);

    const wrapper = createWrapper();
    const testConfig = createFixtureConfig({ uuid: '12345' });
    store.commit('storeConfigs', [testConfig]);
    await wrapper.vm.$nextTick();
    const configEditorWrapper = wrapper.findComponent(ConfigEditor);

    expect(configEditorWrapper.exists()).toBeFalsy();
  });

  it('should dispatch updated selected config', () => {
    const wrapper = createWrapper();
    jest.spyOn(wrapper.vm.$store, 'dispatch');
    wrapper.vm.patchSelectedConfig(['name', 'ma super config']);

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('patchSelectedConfig', ['name', 'ma super config']);
  });

  it('should dispatch save selected config', () => {
    const configToSave = createFixtureConfig({ uuid: '12345' });
    const props = { configs: [configToSave] };
    const wrapper = createWrapper({ props });
    jest.spyOn(wrapper.vm.$store, 'dispatch');

    store.commit('storeConfigs', [configToSave]);
    store.commit('storeSelectedConfigUuid', '12345');
    wrapper.vm.saveSelectedConfig();

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('saveConfig', configToSave);
  });

  it('should dispatch create new config and set it as selected config', () => {
    const wrapper = createWrapper({ props: { configs: [] } });
    jest.spyOn(wrapper.vm.$store, 'dispatch');

    wrapper.vm.createConfig();

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('saveConfig', refFixtureConfig);
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('setSelectedConfigUuid', refFixtureConfig.uuid);
  });

  it('should select a lone config by default', () => {
    const testConfig = createFixtureConfig({ uuid: '12345' });
    const props = { configs: [testConfig] };
    const wrapper = createWrapper({ props });
    store.commit('storeConfigs', [testConfig]);

    expect(wrapper.vm.selectedConfig).toStrictEqual(testConfig);
  });

  it('should dispatch delete selected config', async () => {
    expect.assertions(2);

    const configToDelete = createFixtureConfig({ uuid: '12345' });
    const props = { configs: [configToDelete] };
    const wrapper = createWrapper({ props });
    store.commit('storeConfigs', [configToDelete]);
    jest.spyOn(wrapper.vm.$store, 'dispatch');

    await wrapper.vm.$nextTick();

    const editorWrapper = wrapper.findComponent(ConfigEditor);
    editorWrapper.trigger('delete');

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(2); // set default selected + delete event
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('deleteConfigByUuid', '12345');
  });

  it('should not call system method to save db if no config is selected', () => {
    const wrapper = createWrapper();
    wrapper.vm.saveDbWithSelectedConfig();

    expect(saveDb).not.toHaveBeenCalled();
  });

  it('should call system method to save db with selected config', async () => {
    expect.assertions(2);

    const wrapper = createWrapper();
    const selectedConfig = createFixtureConfig({ uuid: '12345' });
    store.commit('storeConfigs', [selectedConfig]);
    store.commit('storeSelectedConfigUuid', '12345');
    await wrapper.vm.$nextTick();
    const editorWrapper = wrapper.findComponent(ConfigEditor);
    editorWrapper.trigger('savedb');

    expect(saveDb).toHaveBeenCalledTimes(1);
    expect(saveDb).toHaveBeenCalledWith(selectedConfig);
  });

  it('should not call system method to restore db if no config is selected', () => {
    const wrapper = createWrapper();
    wrapper.vm.restoreDbWithSelectedConfig();

    expect(restoreDb).not.toHaveBeenCalled();
  });

  it('should call system method to restore db with selected config', async () => {
    expect.assertions(2);

    const wrapper = createWrapper();
    const selectedConfig = createFixtureConfig({ uuid: '12345' });
    store.commit('storeConfigs', [selectedConfig]);
    store.commit('storeSelectedConfigUuid', '12345');
    await wrapper.vm.$nextTick();
    const editorWrapper = wrapper.findComponent(ConfigEditor);
    editorWrapper.trigger('restoredb');

    expect(restoreDb).toHaveBeenCalledTimes(1);
    expect(restoreDb).toHaveBeenCalledWith(selectedConfig);
  });

  it('should call system method to rollback with selected config', async () => {
    expect.assertions(2);

    const wrapper = createWrapper();
    const selectedConfig = createFixtureConfig({ uuid: '12345' });
    store.commit('storeConfigs', [selectedConfig]);
    store.commit('storeSelectedConfigUuid', '12345');
    await wrapper.vm.$nextTick();
    const editorWrapper = wrapper.findComponent(ConfigEditor);
    editorWrapper.trigger('rollback');

    expect(rollback).toHaveBeenCalledTimes(1);
    expect(rollback).toHaveBeenCalledWith(selectedConfig);
  });

  it("should store config's id of a database that has been restored", async () => {
    expect.assertions(2);

    mocked(restoreDb, true).mockResolvedValue(true);
    const wrapper = createWrapper();
    jest.spyOn(wrapper.vm.$store, 'dispatch');
    const selectedConfig = createFixtureConfig({ uuid: '12345' });
    store.commit('storeConfigs', [selectedConfig]);
    store.commit('storeSelectedConfigUuid', '12345');
    await wrapper.vm.$nextTick();
    const editorWrapper = wrapper.findComponent(ConfigEditor);
    editorWrapper.trigger('restoredb');
    await new Promise(resolve => setTimeout(resolve));

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(1);
    expect(restoreDb).toHaveBeenCalledWith(selectedConfig);
  });

  it("should not store config's id of a database that failed from being restored", async () => {
    expect.assertions(1);

    mocked(restoreDb, true).mockResolvedValue(false);
    const wrapper = createWrapper();
    jest.spyOn(wrapper.vm.$store, 'dispatch');
    const selectedConfig = createFixtureConfig({ uuid: '12345' });
    store.commit('storeConfigs', [selectedConfig]);
    store.commit('storeSelectedConfigUuid', '12345');
    await wrapper.vm.$nextTick();
    const editorWrapper = wrapper.findComponent(ConfigEditor);
    editorWrapper.trigger('restoredb');
    await new Promise(resolve => setTimeout(resolve));

    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled();
  });

  it('should showRollbackButton return true for the config of a database that has been restored', () => {
    const wrapper = createWrapper();
    store.commit('addToRestoredDbs', '6841328');

    expect(wrapper.vm.showRollbackButton('6841328')).toBeTruthy();
  });

  it('should emit an event when a database has been rollbacked', async () => {
    expect.assertions(2);

    mocked(rollback, true).mockResolvedValue(true);
    const wrapper = createWrapper();
    jest.spyOn(wrapper.vm.$store, 'dispatch');
    const selectedConfig = createFixtureConfig({ uuid: '3615863' });
    store.commit('storeConfigs', [selectedConfig]);
    store.commit('storeSelectedConfigUuid', '3615863');

    wrapper.vm.rollbackWithSelectedConfig();
    await new Promise(resolve => setTimeout(resolve));

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('removeFromRestoredDbs', '3615863');
  });

  it('should not emit an event when a database rollback has failed', async () => {
    expect.assertions(1);

    mocked(rollback, true).mockResolvedValue(false);
    const wrapper = createWrapper();
    jest.spyOn(wrapper.vm.$store, 'dispatch');
    const selectedConfig = createFixtureConfig({ uuid: '456123' });
    store.commit('storeConfigs', [selectedConfig]);
    store.commit('storeSelectedConfigUuid', '456123');

    wrapper.vm.rollbackWithSelectedConfig();
    await new Promise(resolve => setTimeout(resolve));

    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled();
  });

  it('should showRollbackButton return false for the config of a database that has been rollbacked', () => {
    const wrapper = createWrapper();
    store.commit('addToRestoredDbs', '4578963');
    store.commit('removeFromRestoredDbs', '4578963');

    expect(wrapper.vm.showRollbackButton('4578963')).toBeFalsy();
  });
});
