// Simple in-memory rate limiter for scan requests
// In production, use Redis (Upstash) or Vercel KV for distributed rate limiting

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt < now) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    retryAfter?: number;
}

/**
 * Check if a request is allowed based on rate limiting
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60 * 1000 } // 10 requests per minute default
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // No entry or window expired - create new entry
    if (!entry || entry.resetAt < now) {
        const resetAt = now + config.windowMs;
        rateLimitStore.set(identifier, {
            count: 1,
            resetAt,
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt,
        };
    }

    // Entry exists and window is still valid
    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
            retryAfter: Math.ceil((entry.resetAt - now) / 1000),
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
    };
}

/**
 * Get client identifier from request (IP address or fallback)
 */
export function getClientIdentifier(request: Request): string {
    // Try to get real IP from headers (works with most proxies/CDNs)
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback to a generic identifier
    // In production, you might want to use user session or other identifier
    return 'anonymous';
}

/**
 * Clear rate limit for an identifier (useful for testing)
 */
export function clearRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier);
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || entry.resetAt < now) {
        return {
            allowed: true,
            remaining: config.maxRequests,
            resetAt: now + config.windowMs,
        };
    }

    return {
        allowed: entry.count < config.maxRequests,
        remaining: Math.max(0, config.maxRequests - entry.count),
        resetAt: entry.resetAt,
        retryAfter: entry.count >= config.maxRequests ? Math.ceil((entry.resetAt - now) / 1000) : undefined,
    };
}
