import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// global style
import './style/reset.css';
import './style/common.scss';

// initialize configs
store.dispatch('retrieveConfigs');

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
