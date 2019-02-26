import '@fortawesome/fontawesome-free/css/all.css';
import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue';
import Vuetify from 'vuetify';

export function IntializeVuetify() {
  Vue.use(Vuetify, {
    iconfont: 'fa',
  });
}
