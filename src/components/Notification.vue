<template>
  <div :class="notification.type">{{ notification.message }}</div>
</template>

<script>
import { Notification } from '@/domain/Notification.ts';

export default {
  props: {
    notification: {
      type: Notification,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  color: white;

  .SUCCESS {
    background-color: green;
  }

  .ERROR {
    background-color: red;
  }
}
</style>
