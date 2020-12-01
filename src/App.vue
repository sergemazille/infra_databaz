<template>
  <div id="app">
    <h1>DataBaZ</h1>
    <Controller v-bind="{ configs }" />
  </div>
</template>

<script>
import Controller from '@/components/Controller';
import { mapGetters } from 'vuex';

export default {
  components: {
    Controller,
  },

  computed: {
    ...mapGetters(['configs']),
  },
};
</script>
