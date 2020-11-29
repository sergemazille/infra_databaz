import * as configUtils from '@/utils/configs';
import ConfigComponent from '@/components/Config.vue';
import ConfigEditor from '@/components/ConfigEditor.vue';
import ConfigsManager from '@/components/ConfigsManager.vue';
import { createFixtureConfig, refFixtureConfig } from '@/utils/configs';
import { shallowMount } from '@vue/test-utils';
import store from '@/store/index';

jest.mock('@/utils/system.ts', () => {
  return {
    browseForSshPrivateKeyPath: jest.fn(),
  };
});

jest.spyOn(configUtils, 'createEmptyConfig').mockImplementation(() => {
  return refFixtureConfig;
});

const createWrapper = (opts: any = {}) => {
  return shallowMount(ConfigsManager, {
    global: {
      plugins: [store],
    },

    ...opts,
  });
};

describe('ConfigsManager', () => {
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

  it("should dispatch selected config's uuid", () => {
    const firstConfig = createFixtureConfig({ uuid: '12345' });
    const secondConfig = createFixtureConfig({ uuid: '54321' });
    const props = {
      configs: [firstConfig, secondConfig],
    };
    const wrapper = createWrapper({ props });
    jest.spyOn(wrapper.vm.$store, 'dispatch');

    const firstConfigWrapper = wrapper.findComponent(ConfigComponent);
    firstConfigWrapper.trigger('selected');

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
    firstConfigWrapper.trigger('deleted');

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith('deleteConfigByUuid', '1');
  });

  it('should give selected config component the correct isSelected props', async () => {
    expect.assertions(1);

    const testConfig = createFixtureConfig({ uuid: '12345' });
    const randomConfig = createFixtureConfig();
    const configs = [testConfig, randomConfig];

    const props = { configs };
    const wrapper = createWrapper({ props });
    store.commit('storeConfigs', configs);
    store.commit('storeSelectedConfigUuid', '12345');
    await wrapper.vm.$nextTick();
    const testConfigWrapper = wrapper.findComponent(ConfigComponent);

    expect(testConfigWrapper.vm.isSelected).toBe(true);
  });

  it('should give config editor correct selected config properties', async () => {
    expect.assertions(2);

    const wrapper = createWrapper();
    const testConfig = createFixtureConfig({ uuid: '12345', dbPort: '3307', dbUsername: 'luke' });
    store.commit('storeConfigs', [testConfig]);
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
    const configToDelete = createFixtureConfig({ uuid: '12345' });
    const props = { configs: [configToDelete] };
    const wrapper = createWrapper({ props });
    store.commit('storeConfigs', [configToDelete]);
    jest.spyOn(wrapper.vm.$store, 'dispatch');

    await wrapper.vm.$nextTick();

    const editorWrapper = wrapper.findComponent(ConfigEditor);
    editorWrapper.trigger('deleted');

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(2); // set default selected + delete event
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('deleteConfigByUuid', '12345');
  });
});
