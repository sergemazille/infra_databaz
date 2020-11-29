import ConfigComponent from '@/components/Config.vue';
import ConfigEditor from '@/components/ConfigEditor.vue';
import ConfigsManager from '@/components/ConfigsManager.vue';
import { createConfig } from '@tests/fixtures/configs';
import { shallowMount } from '@vue/test-utils';
import store from '@/store/index';

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
      configs: [createConfig(), createConfig()],
    };
    const wrapper = createWrapper({ props });

    const configsWrappers = wrapper.findAllComponents(ConfigComponent);

    expect(configsWrappers.length).toEqual(2);
  });

  it('should have no selected config by default', () => {
    const props = {
      configs: [createConfig()],
    };
    const wrapper = createWrapper({ props });

    expect(wrapper.vm.selectedConfigUuid).toBeFalsy();
  });

  it("should dispatch selected config's uuid", () => {
    const firstConfig = createConfig({ uuid: '12345' });
    const secondConfig = createConfig({ uuid: '54321' });
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

  it('should remove specified config', () => {
    const firstConfig = createConfig({ uuid: '1' });
    const secondConfig = createConfig({ uuid: '2' });
    const props = { configs: [firstConfig, secondConfig] };
    const wrapper = createWrapper({ props });
    jest.spyOn(wrapper.vm.$store, 'dispatch');

    const firstConfigWrapper = wrapper.findComponent(ConfigComponent);
    firstConfigWrapper.trigger('removed');

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith('removeConfigByUuid', '1');
  });

  it('should give selected config component the correct isSelected props', async () => {
    expect.assertions(1);

    const testConfig = createConfig({ uuid: '12345' });
    const randomConfig = createConfig();
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
    // expect.assertions(2);

    const wrapper = createWrapper();
    const testConfig = createConfig({ uuid: '12345', dbPort: '3307', dbUsername: 'luke' });
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
    const testConfig = createConfig({ uuid: '12345' });
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

  // suppression d'une config du localstorage
  // CREATION D'UNE CONFIG
  // si une seule config alors elle est selectionnée par défaut
});
