/**
 * Security utility functions for input validation and sanitization
 */

/**
 * Sanitize search input to prevent XSS and injection attacks
 */
export const sanitizeSearchInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    .replace(/[<>'"&]/g, '') // Remove potential XSS characters
    .replace(/[(){}[\]]/g, '') // Remove brackets that could be used for injection
    .substring(0, 100) // Limit length to prevent DoS
}

/**
 * Validate creator ID to ensure it's within allowed values
 */
export const validateCreatorId = (id: string | number): number => {
  const parsed = typeof id === 'string' ? parseInt(id, 10) : id
  
  if (isNaN(parsed) || ![1, 2, 4].includes(parsed)) {
    throw new Error('Invalid creator ID')
  }
  
  return parsed
}

/**
 * Validate and sanitize tag names
 */
export const sanitizeTagName = (tag: string): string => {
  if (!tag || typeof tag !== 'string') {
    return ''
  }

  return tag
    .trim()
    .replace(/[<>'"&]/g, '')
    .substring(0, 50)
}

/**
 * Validate offset and limit parameters for pagination
 */
export const validatePagination = (offset: number, limit: number) => {
  const validOffset = Math.max(0, Math.floor(offset || 0))
  const validLimit = Math.min(100, Math.max(1, Math.floor(limit || 10)))
  
  return { offset: validOffset, limit: validLimit }
}

/**
 * Sanitize URL parameters
 */
export const sanitizeUrlParam = (param: string): string => {
  if (!param || typeof param !== 'string') {
    return ''
  }

  return param
    .trim()
    .replace(/[<>'"&=]/g, '')
    .substring(0, 200)
}

/**
 * Validate search keywords array
 */
export const validateSearchKeywords = (keywords: string[]): string[] => {
  if (!Array.isArray(keywords)) {
    return []
  }

  return keywords
    .filter(keyword => keyword && typeof keyword === 'string')
    .slice(0, 5) // Limit to 5 keywords max
    .map(keyword => sanitizeSearchInput(keyword))
    .filter(keyword => keyword.length > 0)
}

/**
 * Rate limiting helper - simple client-side debounce
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => func(...args), delay)
  }
}