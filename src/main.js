import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueGtag from "vue-gtag";
import VueYouTubeEmbed from 'vue-youtube-embed'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'


Vue.use(VueGtag, {
  appName: 'Dhamma01.com',
  pageTrackerScreenviewEnabled: true,
  config: { id: "G-XFFXK5N9GH" }
}, router);
Vue.use(VueYouTubeEmbed)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
