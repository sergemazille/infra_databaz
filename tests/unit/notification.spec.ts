import '@testing-library/jest-dom';
import Notification from '@/components/Notification.vue';
import { Type as NotificationStatus } from '@/domain/Notification.ts';
import { shallowMount } from '@vue/test-utils';

const createWrapper = () => {
  const notification = {
    message: 'Hello world!',
    type: NotificationStatus.SUCCESS,
  };

  return shallowMount(Notification, {
    props: { notification },
  });
};

describe('Notification', () => {
  it('should display props message', () => {
    const wrapper = createWrapper();

    expect(wrapper.text()).toContain('Hello world!');
  });

  it('should set notification type props as class', () => {
    const wrapperEl = createWrapper().element;

    expect(wrapperEl).toHaveClass(NotificationStatus.SUCCESS);
  });
});
