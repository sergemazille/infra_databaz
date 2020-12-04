<template>
  <div class="config" :class="{ isSelected }" @click="handleSelectConfig">
    <span v-text="config.name" />
    <button v-text="'&times;'" @click.stop="handleDeleteConfig" />
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
    handleSelectConfig() {
      this.$emit('select');
    },

    handleDeleteConfig() {
      this.$emit('delete');
    },
  },
};
</script>

<style lang="scss" scoped>
.config {
  padding: 18px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  color: grey;
  cursor: pointer;
  position: relative;
  width: 100px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.07s ease-in-out;
  user-select: none;

  &:hover {
    background-color: #dcdfec;
  }
}

.isSelected,
.isSelected:hover {
  background-color: #94a4db;
  color: white;
  border-color: #022b07;
  transform: translate3d(-2px, -2px, 0);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);

  button {
    color: white;

    &:hover {
      background-color: #fa8e22;
      color: black;
    }
  }
}

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 50%;
  border: 1px solid currentColor;
  color: grey;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 6px;
  right: 6px;

  &:hover {
    background-color: #fa8e22;
    color: black;
  }
}
</style>
