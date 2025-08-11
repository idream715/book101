import { computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'

/**
 * Responsive Layout Composable for Vue-Dhamma01
 * 
 * Provides consistent breakpoint management across all V2 components
 * Based on design requirements from MIGRATE.md
 */

// Standard breakpoints used across the application
export const BREAKPOINTS = {
  mobile: 640,   // 0-640px: Mobile devices
  tablet: 768,   // 641-768px: Tablet devices
  desktop: 1024, // 769-1024px: Small desktop
  large: 1200,   // 1025-1200px: Large desktop
  xlarge: 1440   // 1201px+: Extra large screens
} as const

export const useResponsiveLayout = () => {
  // VueUse breakpoints setup
  const breakpoints = useBreakpoints(BREAKPOINTS)
  
  // Core breakpoint checks
  const isMobile = breakpoints.smaller('tablet')
  const isTablet = breakpoints.between('mobile', 'desktop')
  const isDesktop = breakpoints.greater('tablet')
  const isLarge = breakpoints.greater('desktop')
  const isXLarge = breakpoints.greater('large')
  
  // Combined checks for common use cases
  const isMobileOrTablet = breakpoints.smaller('desktop')
  const isTabletOrDesktop = breakpoints.between('tablet', 'xlarge')
  
  // Current screen size category
  const screenSize = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    if (isDesktop.value && !isLarge.value) return 'desktop'
    if (isLarge.value && !isXLarge.value) return 'large'
    return 'xlarge'
  })
  
  // Grid columns based on screen size (common pattern in Vue-Dhamma01)
  const getGridCols = (config: {
    mobile?: number
    tablet?: number
    desktop?: number
    large?: number
    xlarge?: number
  }) => {
    return computed(() => {
      if (isMobile.value) return config.mobile || 1
      if (isTablet.value) return config.tablet || config.mobile || 2
      if (isDesktop.value && !isLarge.value) return config.desktop || config.tablet || 3
      if (isLarge.value && !isXLarge.value) return config.large || config.desktop || 4
      return config.xlarge || config.large || config.desktop || 6
    })
  }
  
  // Common grid configurations used in Books, Cards, etc.
  const booksGridCols = getGridCols({
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4,
    xlarge: 6
  })
  
  const cardsGridCols = getGridCols({
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4,
    xlarge: 4
  })
  
  const homeMenuCols = getGridCols({
    mobile: 1,
    tablet: 2,
    desktop: 2,
    large: 3,
    xlarge: 3
  })
  
  // Container padding based on screen size
  const containerPadding = computed(() => {
    if (isMobile.value) return '16px'
    if (isTablet.value) return '24px'
    if (isDesktop.value) return '32px'
    return '40px'
  })
  
  // Content max width based on screen size
  const contentMaxWidth = computed(() => {
    if (isMobile.value) return '100%'
    if (isTablet.value) return '768px'
    if (isDesktop.value) return '1024px'
    if (isLarge.value) return '1200px'
    return '1440px'
  })
  
  // Font size adjustments for different screens
  const getFontSize = (config: {
    mobile?: string
    tablet?: string
    desktop?: string
    large?: string
  }) => {
    return computed(() => {
      if (isMobile.value) return config.mobile || '14px'
      if (isTablet.value) return config.tablet || config.mobile || '15px'
      if (isDesktop.value) return config.desktop || config.tablet || '16px'
      return config.large || config.desktop || '16px'
    })
  }
  
  // Navigation-specific responsive logic
  const showMobileNav = isMobile
  const showTabletNav = isTablet
  const showDesktopNav = isDesktop
  
  // Navigation layout configuration
  const navLayout = computed(() => {
    if (isMobile.value) return 'vertical'
    if (isTablet.value) return 'horizontal-compact'
    return 'horizontal-full'
  })
  
  // Sidebar configuration for navigation
  const sidebarConfig = computed(() => ({
    width: isMobile.value ? '280px' : '320px',
    placement: isMobile.value ? 'left' : 'left',
    showMask: isMobileOrTablet.value,
    autoClose: isMobile.value
  }))
  
  // Card spacing based on screen size
  const cardSpacing = computed(() => {
    if (isMobile.value) return { x: 8, y: 12 }
    if (isTablet.value) return { x: 12, y: 16 }
    if (isDesktop.value) return { x: 16, y: 20 }
    return { x: 20, y: 24 }
  })
  
  // Image sizes for different components
  const getImageSize = (component: 'book' | 'card' | 'avatar' | 'logo') => {
    const sizes = {
      book: {
        mobile: { width: 120, height: 168 },
        tablet: { width: 140, height: 196 },
        desktop: { width: 160, height: 224 },
        large: { width: 180, height: 252 }
      },
      card: {
        mobile: { width: 200, height: 120 },
        tablet: { width: 240, height: 144 },
        desktop: { width: 280, height: 168 },
        large: { width: 320, height: 192 }
      },
      avatar: {
        mobile: { width: 32, height: 32 },
        tablet: { width: 36, height: 36 },
        desktop: { width: 40, height: 40 },
        large: { width: 44, height: 44 }
      },
      logo: {
        mobile: { width: 80, height: 80 },
        tablet: { width: 100, height: 100 },
        desktop: { width: 120, height: 120 },
        large: { width: 140, height: 140 }
      }
    }
    
    return computed(() => {
      const config = sizes[component]
      if (isMobile.value) return config.mobile
      if (isTablet.value) return config.tablet
      if (isDesktop.value && !isLarge.value) return config.desktop
      return config.large
    })
  }
  
  // Modal configuration based on screen size
  const modalConfig = computed(() => ({
    width: isMobile.value ? '95vw' : isTablet.value ? '80vw' : '70vw',
    maxWidth: isMobile.value ? '400px' : isTablet.value ? '600px' : '800px',
    padding: isMobile.value ? '16px' : '24px'
  }))
  
  // Scroll behavior configuration
  const scrollConfig = computed(() => ({
    distance: isMobile.value ? 200 : 300,
    throttle: isMobile.value ? 100 : 50
  }))
  
  return {
    // Core breakpoint checks
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    isXLarge,
    isMobileOrTablet,
    isTabletOrDesktop,
    
    // Screen info
    screenSize,
    
    // Grid configurations
    getGridCols,
    booksGridCols,
    cardsGridCols,
    homeMenuCols,
    
    // Layout properties
    containerPadding,
    contentMaxWidth,
    getFontSize,
    
    // Navigation
    showMobileNav,
    showTabletNav,
    showDesktopNav,
    navLayout,
    sidebarConfig,
    
    // Component configurations
    cardSpacing,
    getImageSize,
    modalConfig,
    scrollConfig,
    
    // Raw breakpoints for custom use
    breakpoints
  }
}

export type ResponsiveLayout = ReturnType<typeof useResponsiveLayout>

// Helper function to get responsive class names
export const getResponsiveClasses = (
  baseClass: string,
  modifiers: {
    mobile?: string
    tablet?: string
    desktop?: string
    large?: string
  }
) => {
  const { screenSize } = useResponsiveLayout()
  
  return computed(() => {
    const currentSize = screenSize.value
    const modifier = modifiers[currentSize as keyof typeof modifiers]
    
    return modifier ? `${baseClass} ${baseClass}--${modifier}` : baseClass
  })
}

// Utility for responsive values
export const useResponsiveValue = <T>(values: {
  mobile?: T
  tablet?: T
  desktop?: T
  large?: T
  xlarge?: T
}) => {
  const { isMobile, isTablet, isDesktop, isLarge, isXLarge } = useResponsiveLayout()
  
  return computed(() => {
    if (isMobile.value && values.mobile !== undefined) return values.mobile
    if (isTablet.value && values.tablet !== undefined) return values.tablet
    if (isDesktop.value && !isLarge.value && values.desktop !== undefined) return values.desktop
    if (isLarge.value && !isXLarge.value && values.large !== undefined) return values.large
    if (isXLarge.value && values.xlarge !== undefined) return values.xlarge
    
    // Fallback logic
    return values.desktop || values.tablet || values.mobile || values.large || values.xlarge
  })
}