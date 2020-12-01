<template>
  <div id="app">
    <h1>DataBaZ</h1>
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
