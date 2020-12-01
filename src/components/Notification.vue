<template>
  <div :class="type">{{ message }}</div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
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
