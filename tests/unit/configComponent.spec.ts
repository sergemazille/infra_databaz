import { Config } from '@/domain/Config';
import ConfigComponent from '@/components/Config.vue';
import { createFixtureConfig } from '@/utils/configs';
import { shallowMount } from '@vue/test-utils';

const config = (properties?: Partial<Config>): Config => {
  return createFixtureConfig({ ...properties });
};

const createWrapper = (opts: any = {}) => {
  return shallowMount(ConfigComponent, {
    props: {
      config: config(),
    },

    ...opts,
  });
};

describe('ConfigComponent', () => {
  it('should display config name', () => {
    const props = { config: config({ name: 'saved_database' }) };
    const wrapper = createWrapper({ props });

    expect(wrapper.text()).toMatch('saved_database');
  });

  it('should be emphasized when selected', () => {
    const props = { config: config(), isSelected: true };
    const wrapper = createWrapper({ props });

    expect(wrapper.classes()).toContain('isSelected');
  });

  it('should emit an event when selected', () => {
    const wrapper = createWrapper();
    wrapper.find('.config').trigger('click');

    expect(wrapper.emitted('selected')).toBeTruthy();
  });

  it('should emit an event when delete button has been clicked', () => {
    const wrapper = createWrapper();
    wrapper.find('button').trigger('click');

    expect(wrapper.emitted('deleted')).toBeTruthy();
  });
});
