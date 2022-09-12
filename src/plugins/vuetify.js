import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import th from 'vuetify/es5/locale/th';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#ff3e66',
        secondary: '#424242',
        accent: '#9A213A',
        error: '#FF5252',
        info: '#FED7DC',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
    lang: {
      locales: { th },
      current: 'th',
    },
});
