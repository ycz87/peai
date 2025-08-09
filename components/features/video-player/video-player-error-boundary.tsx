"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error boundary component specifically designed for video player components
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
export class VideoPlayerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error, 
      errorInfo: null 
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('VideoPlayerErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call the optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div 
          className="w-full aspect-video bg-muted/50 border border-destructive/20 rounded-lg flex items-center justify-center"
          role="alert"
          aria-label="视频播放器错误"
        >
          <div className="text-center space-y-4 p-6">
            <div className="flex justify-center">
              <AlertTriangle 
                className="w-12 h-12 text-destructive" 
                aria-hidden="true" 
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                视频播放器出错
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                视频播放器遇到了意外错误。这可能是由于网络问题或视频格式不兼容导致的。
              </p>
            </div>
            
            {/* Error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left text-xs text-muted-foreground bg-muted p-3 rounded border max-w-md">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="whitespace-pre-wrap break-all">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
                aria-label="重试加载视频播放器"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                重试
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                aria-label="刷新页面"
              >
                刷新页面
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook-based error boundary wrapper for functional components
 * @param children - Child components to wrap
 * @param fallback - Optional custom fallback UI
 * @param onError - Optional error callback
 * @returns JSX element wrapped in error boundary
 */
export function withVideoPlayerErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  return function VideoPlayerWithErrorBoundary(props: P) {
    return (
      <VideoPlayerErrorBoundary>
        <Component {...props} />
      </VideoPlayerErrorBoundary>
    )
  }
}

/**
 * Lightweight error boundary hook for simple use cases
 */
export function useVideoPlayerErrorBoundary() {
  return {
    VideoPlayerErrorBoundary,
    withErrorBoundary: withVideoPlayerErrorBoundary
  }
}