<template>
  <div id="app">
    <Notification v-if="notification" v-bind="{ notification }" />
    <h1>DataBaZ</h1>
    <Controller v-bind="{ configs }" />
  </div>
</template>

<script>
import Controller from '@/components/Controller';
import Notification from '@/components/Notification';
import { mapGetters } from 'vuex';

export default {
  components: {
    Controller,
    Notification,
  },

  computed: {
    ...mapGetters(['configs', 'notification']),
  },
};
</script>
