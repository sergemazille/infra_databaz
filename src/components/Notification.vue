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

  .SUCCESS {
    background-color: green;
  }

  .ERROR {
    background-color: red;
  }
}
</style>
