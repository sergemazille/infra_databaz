import ConfigEditor from '@/components/ConfigEditor.vue';
import { createFixtureConfig } from '@/utils/configs';
import { shallowMount } from '@vue/test-utils';

jest.mock('@/utils/system.ts', () => {
  return {
    browseForSshPrivateKeyPath: jest.fn(),
  };
});

const createWrapper = (opts = {}) => {
  return shallowMount(ConfigEditor, {
    ...opts,
  });
};

describe('ConfigEditor', () => {
  it('should disable save db button if all required fields are not filled', () => {
    const props = { config: createFixtureConfig({ serverIp: '', dbName: '' }) };
    const wrapper = createWrapper({ props });
    const saveDbButtonEl = wrapper.find('[data-selector="saveDbButton"]').element as HTMLButtonElement;

    expect(saveDbButtonEl.disabled).toBeTruthy();
  });

  it('should disable restore db button if all required fields are not filled', () => {
    const props = { config: createFixtureConfig({ serverIp: '', dbName: '' }) };
    const wrapper = createWrapper({ props });
    const restoreDbButtonEl = wrapper.find('[data-selector="restoreDbButton"]').element as HTMLButtonElement;

    expect(restoreDbButtonEl.disabled).toBeTruthy();
  });

  it('should enable save db button if all required fields are filled', () => {
    const props = { config: createFixtureConfig({ serverIp: '1.2.3.4', dbName: 'superbase' }) };
    const wrapper = createWrapper({ props });
    const saveDbButtonEl = wrapper.find('[data-selector="saveDbButton"]').element as HTMLButtonElement;

    expect(saveDbButtonEl.disabled).toBeFalsy();
  });

  it('should enable restore db button if all required fields are filled', () => {
    const props = { config: createFixtureConfig({ serverIp: '1.2.3.4', dbName: 'superbase' }) };
    const wrapper = createWrapper({ props });
    const restoreDbButtonEl = wrapper.find('[data-selector="restoreDbButton"]').element as HTMLButtonElement;

    expect(restoreDbButtonEl.disabled).toBeFalsy();
  });

  it('should emit an event for each field updated', async () => {
    expect.assertions(2);

    const props = { config: createFixtureConfig() };
    const wrapper = createWrapper({ props });

    const nameWrapper = wrapper.find('[data-selector="name"]');
    const serverIpWrapper = wrapper.find('[data-selector="serverIp"]');
    const serverUsernameWrapper = wrapper.find('[data-selector="serverUsername"]');
    const serverPasswordWrapper = wrapper.find('[data-selector="serverPassword"]');
    const sshPrivateKeyPathWrapper = wrapper.find('[data-selector="sshPrivateKeyPath"]');
    const dbPortWrapper = wrapper.find('[data-selector="dbPort"]');
    const dbNameWrapper = wrapper.find('[data-selector="dbName"]');
    const dbUsernameWrapper = wrapper.find('[data-selector="dbUsername"]');
    const dbPasswordWrapper = wrapper.find('[data-selector="dbPassword"]');

    await nameWrapper.setValue('abcd');
    await serverIpWrapper.setValue('1.2.3.4');
    await serverUsernameWrapper.setValue('john');
    await serverPasswordWrapper.setValue('pathW0rd');
    await sshPrivateKeyPathWrapper.setValue('/id_rsa');
    await dbPortWrapper.setValue('3306');
    await dbNameWrapper.setValue('db_name');
    await dbUsernameWrapper.setValue('db_username');
    await dbPasswordWrapper.setValue('db_password');

    expect(wrapper.emitted('update-config').length).toBe(9);
    expect(wrapper.emitted('update-config')).toEqual([
      [{ name: 'abcd' }],
      [{ serverIp: '1.2.3.4' }],
      [{ serverUsername: 'john' }],
      [{ serverPassword: 'pathW0rd' }],
      [{ sshPrivateKeyPath: '/id_rsa' }],
      [{ dbPort: '3306' }],
      [{ dbName: 'db_name' }],
      [{ dbUsername: 'db_username' }],
      [{ dbPassword: 'db_password' }],
    ]);
  });

  it('should disable "update config" button when config is pristine', async () => {
    const props = { config: createFixtureConfig() };
    const wrapper = createWrapper({ props });
    const saveConfigButtonEl = wrapper.find('[data-selector="saveConfigButton"]').element as HTMLButtonElement;

    expect(saveConfigButtonEl.disabled).toBeTruthy();
  });

  it('should enable "update config" button when config is dirty', async () => {
    const props = { config: createFixtureConfig(), isPristine: false };
    const wrapper = createWrapper({ props });
    const saveConfigButtonEl = wrapper.find('[data-selector="saveConfigButton"]').element as HTMLButtonElement;

    expect(saveConfigButtonEl.disabled).toBeFalsy();
  });

  it('should emit an event when config is saved', async () => {
    const props = { config: createFixtureConfig(), isPristine: false };
    const wrapper = createWrapper({ props });
    const saveConfigButtonWrapper = wrapper.find('[data-selector="saveConfigButton"]');
    saveConfigButtonWrapper.trigger('click');

    expect(wrapper.emitted('save')).toBeTruthy();
  });

  it('should emit an event when config is deleted', async () => {
    const props = { config: createFixtureConfig() };
    const wrapper = createWrapper({ props });
    const deleteConfigButtonWrapper = wrapper.find('[data-selector="deleteConfigButton"]');
    deleteConfigButtonWrapper.trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
  });

  it('should emit an event when db has to be saved', async () => {
    const props = { config: createFixtureConfig() };
    const wrapper = createWrapper({ props });
    wrapper.find('[data-selector="saveDbButton"]').trigger('click');

    expect(wrapper.emitted('save')).toBeTruthy();
  });

  it('should emit an event when db has to be restored', async () => {
    const props = { config: createFixtureConfig() };
    const wrapper = createWrapper({ props });
    wrapper.find('[data-selector="restoreDbButton"]').trigger('click');

    expect(wrapper.emitted('restore')).toBeTruthy();
  });

  it('should not display clear password as default', () => {
    const props = { config: createFixtureConfig() };
    const wrapper = createWrapper({ props });

    const serverPasswordInputWrapper = wrapper.find('input[data-selector="serverPassword"]');
    const dbPasswordInputWrapper = wrapper.find('input[data-selector="dbPassword"]');

    expect(serverPasswordInputWrapper.attributes('type')).toBe('password');
    expect(dbPasswordInputWrapper.attributes('type')).toBe('password');
  });

  it('should allow the display of clear server password', async () => {
    const props = { config: createFixtureConfig() };
    const wrapper = createWrapper({ props });
    const serverPasswordVisibilityToggleWrapper = wrapper.find('.icon[data-selector="serverPasswordVisibilityToggle"]');

    serverPasswordVisibilityToggleWrapper.trigger('click');
    await wrapper.vm.$nextTick();
    const serverPasswordInputWrapper = wrapper.find('input[data-selector="serverPassword"]');

    expect(serverPasswordInputWrapper.attributes('type')).toBe('text');
  });

  it('should allow the display of clear database password', async () => {
    const props = { config: createFixtureConfig() };
    const wrapper = createWrapper({ props });
    const dbPasswordVisibilityToggleWrapper = wrapper.find('.icon[data-selector="dbPasswordVisibilityToggle"]');

    dbPasswordVisibilityToggleWrapper.trigger('click');
    await wrapper.vm.$nextTick();
    const dbPasswordInputWrapper = wrapper.find('input[data-selector="dbPassword"]');

    expect(dbPasswordInputWrapper.attributes('type')).toBe('text');
  });
});
