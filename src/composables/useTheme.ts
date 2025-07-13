import { ref, computed, watch } from 'vue'
import { darkTheme, lightTheme, type GlobalTheme } from 'naive-ui'

/**
 * Theme Management Composable for Vue-Dhamma01
 * 
 * Provides consistent theme management across all V2 components
 * Supports light/dark modes with proper persistence
 */

// Theme storage key
const THEME_STORAGE_KEY = 'vue-dhamma01-theme'

// Global theme state
const isDarkMode = ref<boolean>(false)

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  try {
    // Check localStorage first
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
      return
    }
    
    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDarkMode.value = true
    }
  } catch (error) {
    console.warn('Failed to initialize theme:', error)
    isDarkMode.value = false
  }
}

// Initialize on first load
initializeTheme()

export const useTheme = () => {
  // Naive UI theme configuration
  const naiveTheme = computed<GlobalTheme | null>(() => {
    return isDarkMode.value ? darkTheme : null // null = light theme
  })
  
  // Theme colors for custom components
  const themeColors = computed(() => {
    if (isDarkMode.value) {
      return {
        // Dark theme colors
        primary: '#63e2b7',
        primaryHover: '#36ad6a',
        secondary: '#2080f0',
        success: '#18a058',
        warning: '#f0a020',
        error: '#d03050',
        info: '#2080f0',
        
        // Background colors
        background: '#101014',
        backgroundDeep: '#0c0c10',
        backgroundSoft: '#18181c',
        surface: '#24242a',
        surfaceDeep: '#1e1e24',
        
        // Text colors
        textPrimary: '#f2f2f2',
        textSecondary: '#c2c2c2',
        textTertiary: '#a2a2a2',
        textDisabled: '#82828a',
        
        // Border colors
        border: '#262626',
        borderDeep: '#1e1e1e',
        borderSoft: '#303030',
        
        // Creator-specific colors (Buddhism theme)
        creator1: '#63e2b7', // หลวงพ่อธัมมชโย - Green
        creator2: '#7fe7f0', // คุณยายอาจารย์ - Light Blue
        creator4: '#ffd93d', // พระมงคลเทพมุนี - Yellow
        
        // Card backgrounds
        cardBackground: '#24242a',
        cardHover: '#2e2e34'
      }
    } else {
      return {
        // Light theme colors
        primary: '#18a058',
        primaryHover: '#36ad6a',
        secondary: '#2080f0',
        success: '#18a058',
        warning: '#f0a020',
        error: '#d03050',
        info: '#2080f0',
        
        // Background colors
        background: '#ffffff',
        backgroundDeep: '#fafafa',
        backgroundSoft: '#f5f5f5',
        surface: '#ffffff',
        surfaceDeep: '#f8f8f8',
        
        // Text colors
        textPrimary: '#333333',
        textSecondary: '#555555',
        textTertiary: '#777777',
        textDisabled: '#999999',
        
        // Border colors
        border: '#e0e0e0',
        borderDeep: '#d0d0d0',
        borderSoft: '#f0f0f0',
        
        // Creator-specific colors (Buddhism theme)
        creator1: '#1976d2', // หลวงพ่อธัมมชโย - Blue
        creator2: '#42a5f5', // คุณยายอาจารย์ - Light Blue
        creator4: '#f57c00', // พระมงคลเทพมุนี - Orange
        
        // Card backgrounds
        cardBackground: '#ffffff',
        cardHover: '#f5f5f5'
      }
    }
  })
  
  // CSS variables for theme colors
  const cssVariables = computed(() => {
    const colors = themeColors.value
    return {
      '--theme-primary': colors.primary,
      '--theme-primary-hover': colors.primaryHover,
      '--theme-secondary': colors.secondary,
      '--theme-success': colors.success,
      '--theme-warning': colors.warning,
      '--theme-error': colors.error,
      '--theme-info': colors.info,
      
      '--theme-bg': colors.background,
      '--theme-bg-deep': colors.backgroundDeep,
      '--theme-bg-soft': colors.backgroundSoft,
      '--theme-surface': colors.surface,
      '--theme-surface-deep': colors.surfaceDeep,
      
      '--theme-text': colors.textPrimary,
      '--theme-text-secondary': colors.textSecondary,
      '--theme-text-tertiary': colors.textTertiary,
      '--theme-text-disabled': colors.textDisabled,
      
      '--theme-border': colors.border,
      '--theme-border-deep': colors.borderDeep,
      '--theme-border-soft': colors.borderSoft,
      
      '--theme-creator-1': colors.creator1,
      '--theme-creator-2': colors.creator2,
      '--theme-creator-4': colors.creator4,
      
      '--theme-card-bg': colors.cardBackground,
      '--theme-card-hover': colors.cardHover
    }
  })
  
  // Theme class for body element
  const themeClass = computed(() => {
    return isDarkMode.value ? 'theme-dark' : 'theme-light'
  })
  
  // Toggle theme function
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }
  
  // Set specific theme
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      // Use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDarkMode.value = true
      } else {
        isDarkMode.value = false
      }
    } else {
      isDarkMode.value = theme === 'dark'
    }
  }
  
  // Get current theme name
  const currentTheme = computed(() => {
    return isDarkMode.value ? 'dark' : 'light'
  })
  
  // Watch theme changes and persist to localStorage
  watch(isDarkMode, (newValue) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newValue ? 'dark' : 'light')
      
      // Apply theme class to document body
      document.body.classList.remove('theme-light', 'theme-dark')
      document.body.classList.add(themeClass.value)
      
      // Apply CSS variables to document root
      const root = document.documentElement
      Object.entries(cssVariables.value).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    } catch (error) {
      console.warn('Failed to persist theme:', error)
    }
  }, { immediate: true })
  
  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        isDarkMode.value = e.matches
      }
    })
  }
  
  // Creator-specific theme functions
  const getCreatorColor = (creatorId: number) => {
    const colors = themeColors.value
    switch (creatorId) {
      case 1: return colors.creator1 // หลวงพ่อธัมมชโย
      case 2: return colors.creator2 // คุณยายอาจารย์
      case 4: return colors.creator4 // พระมงคลเทพมุนี
      default: return colors.primary
    }
  }
  
  const getCreatorGradient = (creatorId: number) => {
    const baseColor = getCreatorColor(creatorId)
    if (isDarkMode.value) {
      return `linear-gradient(135deg, ${baseColor}20 0%, ${baseColor}40 100%)`
    } else {
      return `linear-gradient(135deg, ${baseColor}10 0%, ${baseColor}30 100%)`
    }
  }
  
  // Card theme utilities
  const getCardTheme = () => {
    const colors = themeColors.value
    return {
      backgroundColor: colors.cardBackground,
      borderColor: colors.border,
      textColor: colors.textPrimary,
      hoverBackgroundColor: colors.cardHover
    }
  }
  
  // Modal theme utilities
  const getModalTheme = () => {
    const colors = themeColors.value
    return {
      backgroundColor: colors.surface,
      maskColor: isDarkMode.value ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)'
    }
  }
  
  return {
    // Core theme state
    isDarkMode,
    currentTheme,
    naiveTheme,
    
    // Theme data
    themeColors,
    cssVariables,
    themeClass,
    
    // Theme controls
    toggleTheme,
    setTheme,
    
    // Creator utilities
    getCreatorColor,
    getCreatorGradient,
    
    // Component utilities
    getCardTheme,
    getModalTheme
  }
}

export type ThemeComposable = ReturnType<typeof useTheme>

// Global theme instance for use across the app
export const globalTheme = useTheme()

// Helper to inject theme into components
export const withTheme = <T extends Record<string, any>>(component: T) => {
  return {
    ...component,
    theme: globalTheme
  }
}