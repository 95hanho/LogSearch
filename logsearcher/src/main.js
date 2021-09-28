import Vue from "vue";
import App from "./App.vue";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import router from "./router";
//import axios from 'axios'
import axios from "./service/axios";
//import {store} from './store'
import { store } from "./store/store";
import VueCookies from "vue-cookies";

Vue.use(BootstrapVue);
Vue.use(VueCookies);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
