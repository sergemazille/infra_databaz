import ConfigEditor from '@/components/ConfigEditor.vue';
import { shallowMount } from '@vue/test-utils';
import { createConfig } from '@tests/fixtures/configs.ts';

const createWrapper = (opts = {}) => {
  return shallowMount(ConfigEditor, {
    ...opts,
  });
};

describe('ConfigEditor', () => {
  it('should disable submit button if all required fields are not filled', () => {
    const props = { config: createConfig({ serverIp: '', dbName: '' }) };
    const wrapper = createWrapper({ props });
    const submitButtonEl = wrapper.find('button[type="submit"]').element as HTMLButtonElement;

    expect(submitButtonEl.disabled).toBeTruthy();
  });

  it('should enable submit button if all required fields are filled', () => {
    const props = { config: createConfig({ serverIp: '1.2.3.4', dbName: 'superbase' }) };
    const wrapper = createWrapper({ props });
    const submitButtonEl = wrapper.find('button[type="submit"]').element as HTMLButtonElement;

    expect(submitButtonEl.disabled).toBeFalsy();
  });

  it('should emit an event for each field updated', async () => {
    expect.assertions(2);

    const props = { config: createConfig() };
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

    expect(wrapper.emitted().updated.length).toBe(9);
    expect(wrapper.emitted().updated).toEqual([
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
    const props = { config: createConfig() };
    const wrapper = createWrapper({ props });
    const saveButtonEl = wrapper.find('[data-selector="saveButton"]').element as HTMLButtonElement;

    expect(saveButtonEl.disabled).toBeTruthy();
  });

  it('should enable "update config" button when config is dirty', async () => {
    const props = { config: createConfig(), isPristine: false };
    const wrapper = createWrapper({ props });
    const saveButtonEl = wrapper.find('[data-selector="saveButton"]').element as HTMLButtonElement;

    expect(saveButtonEl.disabled).toBeFalsy();
  });

  it('should emit an event when config needs to be saved', async () => {
    const props = { config: createConfig(), isPristine: false };
    const wrapper = createWrapper({ props });
    const saveButtonWrapper = wrapper.find('[data-selector="saveButton"]');
    saveButtonWrapper.trigger('click');

    expect(wrapper.emitted().saved).toBeTruthy();
  });

  it('should emit an event when config is deleted', async () => {
    const props = { config: createConfig() };
    const wrapper = createWrapper({ props });
    const deleteButtonWrapper = wrapper.find('[data-selector="deleteButton"]');
    deleteButtonWrapper.trigger('click');

    expect(wrapper.emitted().deleted).toBeTruthy();
  });

  it('should emit an event when form is submitted', async () => {
    const props = { config: createConfig() };
    const wrapper = createWrapper({ props });
    wrapper.find('form').trigger('submit');

    expect(wrapper.emitted().submitted).toBeTruthy();
  });
});
