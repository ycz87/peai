/**
 * Validation utilities for type-safe operations
 * Provides runtime type checking and validation functions
 */

import type { Video, VideoPart, BilibiliPlayerProps } from '@/types'

/**
 * Validates if a string is a valid Bilibili BV ID
 * @param bvid - The BV ID to validate
 * @returns true if the BV ID is valid
 */
export function isValidBvid(bvid: unknown): bvid is string {
  if (typeof bvid !== 'string') return false
  
  // BV IDs should match the pattern: BV followed by 10 alphanumeric characters
  const bvidPattern = /^BV[1-9A-NP-Za-km-z]{10}$/
  return bvidPattern.test(bvid)
}

/**
 * Validates if a value is a valid page number
 * @param page - The page number to validate
 * @returns true if the page number is valid
 */
export function isValidPageNumber(page: unknown): page is number {
  return (
    typeof page === 'number' &&
    Number.isInteger(page) &&
    page >= 1 &&
    page <= 9999
  )
}

/**
 * Validates if an object is a valid VideoPart
 * @param obj - Object to validate
 * @returns true if obj is a valid VideoPart
 */
export function isValidVideoPart(obj: unknown): obj is VideoPart {
  if (!obj || typeof obj !== 'object') return false
  
  const part = obj as Record<string, unknown>
  return (
    isValidPageNumber(part.page) &&
    typeof part.title === 'string' &&
    part.title.length > 0 &&
    typeof part.duration === 'string' &&
    part.duration.length > 0
  )
}

/**
 * Validates if an object is a valid Video
 * @param obj - Object to validate
 * @returns true if obj is a valid Video
 */
export function isValidVideo(obj: unknown): obj is Video {
  if (!obj || typeof obj !== 'object') return false
  
  const video = obj as Record<string, unknown>
  return (
    typeof video.id === 'string' &&
    video.id.length > 0 &&
    typeof video.title === 'string' &&
    video.title.length > 0 &&
    isValidBvid(video.bvid) &&
    typeof video.cover === 'string' &&
    video.cover.length > 0 &&
    typeof video.duration === 'string' &&
    video.duration.length > 0 &&
    Array.isArray(video.parts) &&
    video.parts.length > 0 &&
    video.parts.every(isValidVideoPart) &&
    (video.description === undefined || typeof video.description === 'string')
  )
}

/**
 * Validates Bilibili player props
 * @param props - Props to validate
 * @returns Validation result with errors if any
 */
export function validateBilibiliPlayerProps(
  props: unknown
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!props || typeof props !== 'object') {
    errors.push('Props must be an object')
    return { isValid: false, errors }
  }
  
  const p = props as Record<string, unknown>
  
  if (!isValidBvid(p.bvid)) {
    errors.push('Invalid or missing bvid')
  }
  
  if (p.page !== undefined && !isValidPageNumber(p.page)) {
    errors.push('Invalid page number')
  }
  
  if (p.autoplay !== undefined && typeof p.autoplay !== 'boolean') {
    errors.push('autoplay must be a boolean')
  }
  
  if (p.muted !== undefined && typeof p.muted !== 'boolean') {
    errors.push('muted must be a boolean')
  }
  
  return { isValid: errors.length === 0, errors }
}

/**
 * Sanitizes and validates a BV ID
 * @param bvid - The BV ID to sanitize
 * @returns Sanitized BV ID or null if invalid
 */
export function sanitizeBvid(bvid: unknown): string | null {
  if (typeof bvid !== 'string') return null
  
  // Remove any whitespace and convert to uppercase
  const cleaned = bvid.trim().toUpperCase()
  
  // Validate the cleaned BV ID
  return isValidBvid(cleaned) ? cleaned : null
}

/**
 * Sanitizes and validates a page number
 * @param page - The page number to sanitize
 * @param maxPage - Optional maximum page number
 * @returns Sanitized page number or 1 if invalid
 */
export function sanitizePageNumber(page: unknown, maxPage?: number): number {
  let pageNum: number
  
  if (typeof page === 'string') {
    pageNum = parseInt(page, 10)
  } else if (typeof page === 'number') {
    pageNum = Math.floor(page)
  } else {
    return 1
  }
  
  if (isNaN(pageNum) || pageNum < 1) {
    return 1
  }
  
  if (maxPage && pageNum > maxPage) {
    return maxPage
  }
  
  return Math.min(pageNum, 9999)
}

/**
 * Creates a type-safe error object
 * @param type - The error type
 * @param message - The error message
 * @param details - Optional additional details
 * @returns Typed error object
 */
export function createTypedError(
  type: string,
  message: string,
  details?: Record<string, unknown>
) {
  return {
    type,
    message,
    details,
    timestamp: new Date()
  }
}

/**
 * Validates URL parameters for security
 * @param params - URL parameters to validate
 * @returns Validation result
 */
export function validateUrlParams(
  params: Record<string, unknown>
): { isValid: boolean; sanitized: Record<string, string> } {
  const sanitized: Record<string, string> = {}
  let isValid = true
  
  for (const [key, value] of Object.entries(params)) {
    // Only allow alphanumeric keys and values for security
    const keyPattern = /^[a-zA-Z0-9_-]+$/
    const valuePattern = /^[a-zA-Z0-9_.-]+$/
    
    if (!keyPattern.test(key)) {
      isValid = false
      continue
    }
    
    const stringValue = String(value)
    if (valuePattern.test(stringValue)) {
      sanitized[key] = stringValue
    } else {
      isValid = false
    }
  }
  
  return { isValid, sanitized }
}