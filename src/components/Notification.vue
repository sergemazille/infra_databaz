<template>
  <div :class="notification.type">{{ notification.message }}</div>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  color: white;
  position: fixed;
  display: flex;
  padding: 20px;
  border-radius: 5px;

  .SUCCESS {
    background-color: #32c232;
  }

  .ERROR {
    background-color: #cf2929;
  }

  .INFO {
    background-color: #3c3cbd;
  }
}
</style>
