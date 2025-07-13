// Component prop types and UI-specific interfaces

import type { Component, ComponentPublicInstance } from 'vue'

// Generic component props
export interface BaseComponentProps {
  loading?: boolean
  disabled?: boolean
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

// Card component props
export interface BookCardProps extends BaseComponentProps {
  book: import('./api').Book
  clickable?: boolean
  showCategory?: boolean
  maxWidth?: string
}

export interface ContentCardProps extends BaseComponentProps {
  title: string
  content: string
  imageUrl?: string
  tags?: string[]
  copyable?: boolean
}

// Navigation props
export interface NavbarProps {
  currentCreator?: number
  showSearch?: boolean
  mobileBreakpoint?: number
}

export interface DrawerProps {
  open: boolean
  creators: import('./api').Creator[]
  currentRoute?: string
}

// Search component props
export interface SearchInputProps extends BaseComponentProps {
  modelValue: string[]
  placeholder?: string
  maxKeywords?: number
  filterable?: boolean
  clearable?: boolean
}

export interface SearchResultProps {
  result: import('./api').SearchResult
  highlightKeywords?: string[]
  showSource?: boolean
  copyable?: boolean
}

// Grid and layout props
export interface ResponsiveGridProps {
  cols: string
  gap?: string | number
  responsive?: 'screen' | 'self'
}

export interface InfiniteScrollProps {
  loading?: boolean
  finished?: boolean
  distance?: number
  onLoad?: () => void
}

// Modal and dialog props
export interface ModalProps {
  show: boolean
  title?: string
  width?: string
  height?: string
  closable?: boolean
  maskClosable?: boolean
}

export interface CarouselProps {
  items: any[]
  currentIndex?: number
  showArrows?: boolean
  showDots?: boolean
  autoplay?: boolean
  interval?: number
}

// Form component props
export interface FormSelectProps extends BaseComponentProps {
  options: import('./api').SelectOption[]
  multiple?: boolean
  filterable?: boolean
  clearable?: boolean
  placeholder?: string
}

export interface FormInputProps extends BaseComponentProps {
  type?: 'text' | 'password' | 'email' | 'number'
  placeholder?: string
  clearable?: boolean
  showWordLimit?: boolean
  maxlength?: number
}

// Layout component types
export interface LayoutProps {
  hasSider?: boolean
  embedded?: boolean
}

export interface HeaderProps {
  bordered?: boolean
  inverted?: boolean
  height?: string
}

export interface SiderProps {
  bordered?: boolean
  width?: string
  collapsedWidth?: string
  collapsed?: boolean
  showTrigger?: boolean
}

// Theme and styling types
export interface ThemeConfig {
  primaryColor: string
  errorColor: string
  warningColor: string
  successColor: string
  infoColor: string
}

export interface ResponsiveConfig {
  xs?: number
  s?: number
  m?: number
  l?: number
  xl?: number
  xxl?: number
}

// Event handler types
export interface ComponentEvents {
  onClick?: (event: MouseEvent) => void
  onDoubleClick?: (event: MouseEvent) => void
  onHover?: (hovering: boolean) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

// Ref types for component instances
export type ComponentRef<T = ComponentPublicInstance> = InstanceType<Component> & T

// Common utility types
export type Size = 'small' | 'medium' | 'large'
export type Status = 'default' | 'success' | 'warning' | 'error' | 'info'
export type Placement = 'top' | 'bottom' | 'left' | 'right'

// Animation and transition types
export interface TransitionProps {
  name?: string
  duration?: number
  delay?: number
  appear?: boolean
}

export interface LoadingConfig {
  spinning: boolean
  size?: Size
  tip?: string
}