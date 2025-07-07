import { createVuetify } from 'vuetify'
import { th } from 'vuetify/locale'
import { mdi } from 'vuetify/iconsets/mdi'

// Material Design 3 theme configuration
export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          // Preserve original Buddhist theme colors
          primary: '#ff3e66',
          'primary-darken-1': '#d12654',
          secondary: '#424242',
          'secondary-darken-1': '#1B1B1B',
          accent: '#9A213A',
          error: '#FF5252',
          info: '#FED7DC',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#FFFFFF',
          surface: '#FFFFFF'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#ff3e66',
          'primary-darken-1': '#d12654',
          secondary: '#424242',
          accent: '#9A213A',
          error: '#FF5252',
          info: '#FED7DC',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
  },
  locale: {
    locale: 'th',
    messages: { th }
  },
  defaults: {
    // Global component defaults for consistency
    VBtn: {
      color: 'primary',
      variant: 'elevated'
    },
    VCard: {
      variant: 'elevated'
    }
  }
})
