<template>
  <div v-text="config.name" class="config-pill" />
</template>

<script>
import { Config } from '@/domain/Config';

export default {
  props: {
    config: {
      type: Config,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.config-pill {
  padding: 18px;
  border: 1px solid black;
}
</style>
