import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

// global style
import './style/reset.css';
import './style/common.scss';

// initialize configs
store.dispatch('loadConfigs');

createApp(App)
  .use(store)
  .mount('#app');
