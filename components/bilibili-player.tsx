"use client"

import { useState, useEffect, useMemo, memo } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import type { BilibiliPlayerProps } from "@/types"
import { isValidBvid, sanitizePageNumber, validateUrlParams } from "@/lib/validation"

/**
 * Validates and sanitizes a BV ID to prevent URL injection attacks
 * @param bvid - The BV ID to validate
 * @returns The sanitized BV ID or null if invalid
 */
function validateBvid(bvid: string): string | null {
  if (!isValidBvid(bvid)) {
    console.warn(`Invalid BVID format: ${bvid}`)
    return null
  }
  return bvid
}

/**
 * Validates and sanitizes page number to prevent injection
 * @param page - The page number to validate
 * @returns The sanitized page number
 */
function validatePage(page: number): number {
  return sanitizePageNumber(page)
}

/**
 * Creates a secure Bilibili player URL with proper parameter encoding
 * @param bvid - The validated BV ID
 * @param page - The validated page number
 * @param autoplay - Whether to enable autoplay
 * @param muted - Whether to start muted
 * @returns The secure player URL
 */
function createSecurePlayerUrl(
  bvid: string,
  page: number,
  autoplay: boolean,
  muted: boolean
): string {
  const baseUrl = 'https://player.bilibili.com/player.html'
  
  // Create parameters object for validation
  const params = {
    bvid,
    p: page.toString(),
    as_wide: '1',
    high_quality: '1',
    danmaku: '0'
  }

  if (autoplay) {
    params['autoplay'] = '1'
  }
  if (muted) {
    params['muted'] = '1'
  }

  // Validate parameters before creating URL
  const { isValid, sanitized } = validateUrlParams(params)
  if (!isValid) {
    console.warn('Some URL parameters were invalid and were sanitized')
  }

  const urlParams = new URLSearchParams(sanitized)
  return `${baseUrl}?${urlParams.toString()}`
}

export const BilibiliPlayer = memo(function BilibiliPlayer({ 
  bvid, 
  page = 1, 
  autoplay = false, 
  muted = true 
}: BilibiliPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Validate inputs and create secure URL
  const playerUrl = useMemo(() => {
    const validatedBvid = validateBvid(bvid)
    if (!validatedBvid) {
      return null
    }
    const validatedPage = validatePage(page)
    return createSecurePlayerUrl(validatedBvid, validatedPage, autoplay, muted)
  }, [bvid, page, autoplay, muted])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    console.error(`Failed to load Bilibili video: ${bvid}, page: ${page}`)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
  }

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [bvid, page])

  // Handle invalid BVID
  if (!playerUrl) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center"
           role="alert"
           aria-label="视频参数错误">
        <div className="text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">无效的视频参数</p>
          <p className="text-xs text-muted-foreground">请检查视频BV号是否正确</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center"
           role="alert"
           aria-label="视频加载失败">
        <div className="text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">视频加载失败</p>
          <button 
            onClick={handleRetry}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleRetry()
              }
            }}
            className="text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            aria-label="重新加载视频"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
         role="region"
         aria-label={`Bilibili视频播放器 - ${bvid}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10"
             role="status"
             aria-label="视频加载中">
          <div className="text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">加载视频中...</p>
          </div>
        </div>
      )}
      <iframe
        src={playerUrl}
        className="w-full h-full border-0"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        title={`Bilibili Video ${bvid} - Page ${page}`}
        aria-label={`Bilibili视频播放器，视频ID: ${bvid}，第${page}页`}
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
})