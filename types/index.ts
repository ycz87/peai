// User interface for Auth0 data
export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

// Extended session interface
export interface ExtendedSession {
  user: User
  accessToken?: string
  expires: string
}

// Auth provider props
export interface AuthProviderProps {
  children: React.ReactNode
  session?: ExtendedSession | null
}

// Enhanced authentication error types
export type AuthErrorType = 
  | 'AccessDenied'
  | 'AccountNotLinked'
  | 'AdapterError'
  | 'CallbackError'
  | 'Callback'
  | 'Configuration'
  | 'EmailCreateError'
  | 'EmailSignin'
  | 'OAuthAccountNotLinked'
  | 'OAuthCallback'
  | 'OAuthCreateAccount'
  | 'OAuthProfile'
  | 'OAuthSignin'
  | 'SessionRequired'
  | 'Signin'
  | 'SignOut'
  | 'UnknownError'
  | 'Verification'
  | 'VideoPlayerError' // Added for video-specific errors
  | 'NetworkError'
  | 'ValidationError'

export interface AuthError {
  type: AuthErrorType
  message: string
  code?: string
  details?: Record<string, unknown>
  timestamp?: Date
}

// Authentication loading states
export interface AuthLoadingState {
  isLoading: boolean
  isSigningIn: boolean
  isSigningOut: boolean
  operation?: 'signin' | 'signout' | 'session' | null
}

// Navigation items
export interface NavItem {
  title: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
  items?: NavItem[]
}

// Team data structure
export interface Team {
  name: string
  logo: React.ComponentType<{ className?: string }>
  plan: string
}

// Project data structure
export interface Project {
  name: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

// Dashboard data structure
export interface DashboardData {
  teams: Team[]
  navMain: NavItem[]
  projects: Project[]
}

// Enhanced authentication state
export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  error?: AuthError | null
  loadingState: AuthLoadingState
}

// Social provider types
export type SocialProvider = 'auth0' | 'google' | 'apple' | 'github'

// Login form props
export interface LoginFormProps extends Omit<React.ComponentProps<"div">, 'onError'> {
  onSuccess?: (user: User) => void
  onError?: (error: AuthError) => void
  redirectTo?: string
}

// Enhanced Video-related interfaces with validation
export interface VideoPart {
  readonly page: number
  readonly title: string
  readonly duration: string
}

export interface Video {
  readonly id: string
  readonly title: string
  readonly bvid: string
  readonly cover: string
  readonly duration: string
  readonly description?: string
  readonly parts: readonly VideoPart[]
}

// Type guards for runtime validation
export type VideoPartValidator = (obj: unknown) => obj is VideoPart
export type VideoValidator = (obj: unknown) => obj is Video

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number | boolean | null | undefined>
}

// Video card component props
export interface VideoCardProps {
  video: Video
}

// Video parts button component props
export interface VideoPartButtonProps {
  part: VideoPart
  videoId: string
  isActive?: boolean
  onClick?: () => void
}

// Video parts sidebar component props
export interface VideoPartsSidebarProps {
  video: Video
  currentPage: number
  onPartSelect: (page: number) => void
}

// Enhanced Bilibili player component props with validation
export interface BilibiliPlayerProps {
  readonly bvid: string
  readonly page?: number
  readonly autoplay?: boolean
  readonly muted?: boolean
  readonly onError?: (error: Error) => void
  readonly onLoad?: () => void
  readonly className?: string
  readonly 'aria-label'?: string
}

// Player URL configuration
export interface PlayerUrlConfig {
  readonly baseUrl: string
  readonly requiredParams: readonly string[]
  readonly optionalParams: readonly string[]
  readonly maxPageNumber: number
}

// Mobile detection hook types
export interface MobileHookOptions {
  breakpoint?: number
  defaultValue?: boolean
  ssr?: boolean
}

export interface MobileHookReturn {
  isMobile: boolean
  isHydrated: boolean
  breakpoint: number
}