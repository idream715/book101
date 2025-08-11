import { createApp, configureCompat } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import VueGtag from "vue-gtag"
import VueYouTubeEmbed from 'vue-youtube-embed'

// Naive UI setup
import naive from 'naive-ui'

// Global typography and fonts
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import './assets/styles/typography.css'
import './assets/styles/responsive.css'

// Configure Vue 3 compatibility mode
configureCompat({
  COMPONENT_ASYNC: false,
  GLOBAL_PROTOTYPE: 'suppress-warning',
  COMPONENT_V_MODEL: 'suppress-warning',
  INSTANCE_ATTRS_CLASS_STYLE: 'suppress-warning',
  WATCH_ARRAY: 'suppress-warning',
  COMPILER_V_BIND_OBJECT_ORDER: 'suppress-warning',
  RENDER_FUNCTION: false,
  ATTR_FALSE_VALUE: false
})

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(naive)
app.use(VueGtag, {
  appName: 'Dhamma01.com',
  pageTrackerScreenviewEnabled: true,
  config: { id: import.meta.env.VITE_GA_ID || "G-XFFXK5N9GH" }
}, router)
app.use(VueYouTubeEmbed)

app.mount('#app')
