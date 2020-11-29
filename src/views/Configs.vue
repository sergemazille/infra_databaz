<template>
  <div>
    <h2>Configurations</h2>
    <ConfigsManager v-bind="{ configs }" />
  </div>
</template>

<script>
import ConfigsManager from '@/components/ConfigsManager';
import { mapGetters } from 'vuex';

export default {
  components: {
    ConfigsManager,
  },

  computed: {
    ...mapGetters(['configs']),
  },
};
</script>
