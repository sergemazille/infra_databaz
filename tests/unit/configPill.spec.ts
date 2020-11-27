import { Config } from '@/domain/Config';
import ConfigPill from '@/components/ConfigPill.vue';
import { createConfig } from '@tests/fixtures/configs';
import { shallowMount } from '@vue/test-utils';

const config = (properties?: Partial<Config>): Config => {
  return createConfig({ ...properties });
};

const createWrapper = () => {
  return shallowMount(ConfigPill, {
    props: {
      config: config(),
    },
  });
};

describe('ConfigPill', () => {
  it('should display config name', () => {
    const wrapper = createWrapper();

    expect(wrapper.text()).toMatch('');
  });
});
