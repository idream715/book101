// Main type exports for the application

// API types
export type {
  Book,
  BookChapter,
  Card,
  Short,
  SearchParams,
  SearchResult,
  SelectOption,
  MenuItem,
  Creator,
  BooksState,
  SearchState,
  ApiResponse,
  PaginatedResponse,
  AnalyticsEvent,
  BookParams,
  CreatorParams
} from './api'

// Component types
export type {
  BaseComponentProps,
  BookCardProps,
  ContentCardProps,
  NavbarProps,
  DrawerProps,
  SearchInputProps,
  SearchResultProps,
  ResponsiveGridProps,
  InfiniteScrollProps,
  ModalProps,
  CarouselProps,
  FormSelectProps,
  FormInputProps,
  LayoutProps,
  HeaderProps,
  SiderProps,
  ThemeConfig,
  ResponsiveConfig,
  ComponentEvents,
  ComponentRef,
  Size,
  Status,
  Placement,
  TransitionProps,
  LoadingConfig
} from './components'

// Vue 3 + Naive UI augmentation
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $gtag: (command: string, config: any) => void
  }
}

// Global type augmentations
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void
  }
}

// Utility types for the application
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type Nullable<T> = T | null
export type ValueOf<T> = T[keyof T]
export type Keys<T> = keyof T
export type Values<T> = T[Keys<T>]

// Function types
export type AsyncFunction<T = any, R = any> = (...args: T[]) => Promise<R>
export type VoidFunction = () => void
export type EventHandler<T = Event> = (event: T) => void

// Router types
export interface RouteMetaCustom {
  title?: string
  requiresAuth?: boolean
  creator?: number
  layout?: 'default' | 'minimal'
}

declare module 'vue-router' {
  interface RouteMeta extends RouteMetaCustom {}
}

// Store types (for Pinia)
export interface StoreState {
  loading: boolean
  error: string | null
}

export interface StoreActions {
  setLoading(loading: boolean): void
  setError(error: string | null): void
  clearError(): void
}

// Environment variables
export interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_GA_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}