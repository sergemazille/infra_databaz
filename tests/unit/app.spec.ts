import '@testing-library/jest-dom';

import App from '@/App.vue';
import Notification from '@/components/Notification.vue';
import { Type as NotificationType } from '@/domain/Notification.ts';
import { shallowMount } from '@vue/test-utils';
import store from '@/store/index.ts';

jest.mock('@/utils/system.ts', () => {
  return {
    saveDb: jest.fn(),
    restoreDb: jest.fn(),
  };
});

jest.useFakeTimers();

const createWrapper = (opts = {}) => {
  return shallowMount(App, {
    global: {
      plugins: [store],
    },

    ...opts,
  });
};

describe('App', () => {
  it('should display a stored notification for the notification duration', async () => {
    expect.assertions(2);

    const wrapper = createWrapper();
    const notification = {
      message: 'Hello world!',
      type: NotificationType.SUCCESS,
    };
    store.dispatch('setNotification', notification);
    await wrapper.vm.$nextTick();
    const notificationEl = wrapper.findComponent(Notification).element;

    expect(notificationEl).toBeVisible();

    jest.runAllTimers();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(Notification).exists()).toBeFalsy();
  });
});
