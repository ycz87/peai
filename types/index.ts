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

// Authentication error types
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

export interface AuthError {
  type: AuthErrorType
  message: string
  code?: string
  details?: Record<string, unknown>
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

// Video-related interfaces
export interface Video {
  id: string
  title: string
  bvid: string
  cover: string
  duration: string
  description?: string
}

// Video card component props
export interface VideoCardProps {
  video: Video
}

// Bilibili player component props
export interface BilibiliPlayerProps {
  bvid: string
  page?: number
  autoplay?: boolean
  muted?: boolean
}