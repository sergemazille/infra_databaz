<template>
  <div id="app">
    <transition name="fade">
      <Notification v-if="notification" v-bind="{ notification }" />
    </transition>

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

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
