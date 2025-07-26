import { createApp, configureCompat } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import vuetify from './plugins/vuetify'
import VueGtag from "vue-gtag"
import VueYouTubeEmbed from 'vue-youtube-embed'

// Vuetify 3 styles
import 'vuetify/styles'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

// Naive UI setup for V2 routes
import naive from 'naive-ui'

// Configure Vue 3 compatibility mode
configureCompat({
  COMPONENT_ASYNC: false,
  GLOBAL_PROTOTYPE: 'suppress-warning',
  COMPONENT_V_MODEL: 'suppress-warning',
  INSTANCE_ATTRS_CLASS_STYLE: 'suppress-warning',
  WATCH_ARRAY: 'suppress-warning',
  COMPILER_V_BIND_OBJECT_ORDER: 'suppress-warning',
  RENDER_FUNCTION: false
})

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(vuetify)
app.use(naive)
app.use(VueGtag, {
  appName: 'Dhamma01.com',
  pageTrackerScreenviewEnabled: true,
  config: { id: "G-XFFXK5N9GH" }
}, router)
app.use(VueYouTubeEmbed)

app.mount('#app')
