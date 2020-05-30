import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import VueGtag from "vue-gtag";

Vue.use(VueGtag, {
  config: { id: "G-XFFXK5N9GH" },
  appName: 'dhamma-luangpor-book',
  pageTrackerScreenviewEnabled: true
}, router);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
