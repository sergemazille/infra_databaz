import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

describe('Home', () => {
  it('sanity test', () => {
    const wrapper = shallowMount(Home);

    expect(wrapper.text()).toContain('Home');
  });
});
