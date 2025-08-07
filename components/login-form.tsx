"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import type { AuthError, LoginFormProps, SocialProvider } from "@/types"

// Helper function to create AuthError from NextAuth error
function createAuthError(error: unknown, operation: string): AuthError {
  if (error instanceof Error) {
    return {
      type: 'Signin',
      message: error.message || `Failed to ${operation}`,
      code: 'SIGNIN_ERROR',
      details: { operation }
    }
  }
  
  return {
    type: 'UnknownError',
    message: `An unexpected error occurred during ${operation}`,
    code: 'UNKNOWN_ERROR',
    details: { error: String(error), operation }
  }
}

// Helper function to get user-friendly error messages
function getUserFriendlyErrorMessage(error: AuthError): string {
  switch (error.type) {
    case 'AccessDenied':
      return 'Access was denied. Please check your credentials or contact support.'
    case 'AccountNotLinked':
      return 'This account is not linked to your profile. Please use the correct sign-in method.'
    case 'OAuthAccountNotLinked':
      return 'This social account is already associated with another user. Please use a different account or contact support.'
    case 'OAuthCallback':
    case 'OAuthSignin':
      return 'There was an issue with social sign-in. Please try again or use a different method.'
    case 'Signin':
      return error.message || 'Sign-in failed. Please try again.'
    case 'Configuration':
      return 'There is a configuration issue. Please contact support.'
    default:
      return error.message || 'An unexpected error occurred. Please try again.'
  }
}

export function LoginForm({
  className,
  onSuccess,
  onError,
  redirectTo = "/dashboard",
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const searchParams = useSearchParams()
  
  // Check for authentication errors from URL params
  const urlError = searchParams?.get('error')
  
  const handleSignIn = useCallback(async (provider: SocialProvider = 'auth0') => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await signIn(provider, { 
        callbackUrl: redirectTo,
        redirect: false // Handle redirect manually to catch errors
      })
      
      if (result?.error) {
        const authError = createAuthError(new Error(result.error), `sign in with ${provider}`)
        setError(authError)
        onError?.(authError)
      } else if (result?.ok) {
        // Redirect manually on success
        window.location.href = result.url || redirectTo
      }
    } catch (err) {
      const authError = createAuthError(err, `sign in with ${provider}`)
      setError(authError)
      onError?.(authError)
    } finally {
      setIsLoading(false)
    }
  }, [redirectTo, onError])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome to PEAI</h1>
                <p className="text-muted-foreground text-balance">
                  Sign in to access your AI dashboard
                </p>
              </div>
              
              {/* Display authentication errors */}
              {(error || urlError) && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error ? getUserFriendlyErrorMessage(error) : `Authentication error: ${urlError}`}
                </div>
              )}
              
              {/* 
                Primary Auth0 Button - Uses Auth0 Universal Login
                This provides the most secure and feature-complete authentication flow
                as all authentication happens on Auth0's hosted login page
              */}
              <Button
                onClick={() => handleSignIn('auth0')}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Signing in..." : "Sign in with Auth0"}
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              
              {/* 
                Alternative Social Login Buttons
                Note: These still use Auth0 as the provider but could be configured
                to use specific social connections in Auth0 if needed. 
                For now, they all route through Auth0's Universal Login which 
                will show the appropriate social login options.
              */}
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSignIn('auth0')}
                  disabled={isLoading}
                  className="w-full"
                  title="Sign in with Google via Auth0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleSignIn('auth0')}
                  disabled={isLoading}
                  className="w-full"
                  title="Sign in with Apple via Auth0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Apple
                </Button>
              </div>
              
              <div className="text-center text-sm">
                New to PEAI?{" "}
                <button
                  onClick={() => handleSignIn('auth0')}
                  className="underline underline-offset-4 hover:text-primary"
                  disabled={isLoading}
                >
                  Create an account
                </button>
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">AI-Powered Insights</h2>
                <p className="text-lg opacity-90">
                  Transform your data into actionable intelligence
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By continuing, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
}
