import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Enhanced mobile detection hook with SSR support to prevent hydration mismatches
 * @returns boolean indicating if the screen width is below the mobile breakpoint
 */
export function useIsMobile(): boolean {
  // Initialize with null to avoid hydration mismatches
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    // Mark as hydrated on client-side
    setIsHydrated(true)
    
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      return mobile
    }

    // Initial check
    checkMobile()

    // Create media query for better performance
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    // Use the modern addEventListener if available, fallback to addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaQueryChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleMediaQueryChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaQueryChange)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleMediaQueryChange)
      }
    }
  }, [])

  // Return false during SSR and initial hydration to prevent layout shift
  // Once hydrated, return the actual mobile state
  if (!isHydrated || isMobile === null) {
    return false
  }

  return isMobile
}

/**
 * Hook that returns true only after the component has hydrated
 * Useful for preventing hydration mismatches when showing different content on client vs server
 * @returns boolean indicating if the component has hydrated
 */
export function useIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}
