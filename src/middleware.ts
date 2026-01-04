import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';

export function middleware(request: NextRequest) {
    // Only apply rate limiting to scan page
    if (request.nextUrl.pathname.startsWith('/scan')) {
        const identifier = getClientIdentifier(request);
        const rateLimit = checkRateLimit(identifier, {
            maxRequests: 10, // 10 scans
            windowMs: 60 * 1000, // per minute
        });

        // Add rate limit headers to response
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', '10');
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetAt).toISOString());

        if (!rateLimit.allowed) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Rate limit exceeded',
                    message: `Too many scan requests. Please try again in ${rateLimit.retryAfter} seconds.`,
                    retryAfter: rateLimit.retryAfter,
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': rateLimit.retryAfter?.toString() || '60',
                        'X-RateLimit-Limit': '10',
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
                    },
                }
            );
        }

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/scan'],
};
