import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

// global style
import './style/reset.css';
import './style/main.scss';

// initialize configs
store.dispatch('loadConfigs');

createApp(App)
  .use(store)
  .mount('#app');
