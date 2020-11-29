<template>
  <div class="config" :class="{ isSelected }" @click="handleSelected">
    <span v-text="config.name" />
    <button v-text="'&times;'" @click.stop="handleDeleted" />
  </div>
</template>

<script>
import { Config } from '@/domain/Config';

export default {
  props: {
    config: {
      type: Config,
      required: true,
    },

    isSelected: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handleSelected() {
      this.$emit('selected');
    },

    handleDeleted() {
      this.$emit('deleted');
    },
  },
};
</script>

<style lang="scss" scoped>
.config {
  padding: 18px;
  border: 1px solid black;
  cursor: pointer;
  position: relative;
  width: 100px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.07s ease-in-out;
}

.isSelected {
  background-color: #3b9646;
  color: white;
  border-color: #022b07;
  transform: translate3d(-2px, -2px, 0);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.4);

  button {
    color: white;
  }
}

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 50%;
  border: 1px solid currentColor;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 6px;
  right: 6px;

  &:hover {
    background-color: lightgrey;
    color: black;
  }
}
</style>
