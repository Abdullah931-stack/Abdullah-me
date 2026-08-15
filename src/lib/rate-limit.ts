import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Creates an Upstash Redis client for rate limiting.
 * Returns null if environment variables are not configured.
 */
function createRedisClient(): Redis | null {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        return null;
    }

    return new Redis({ url, token });
}

/**
 * Rate limiter for Smart Contact Form messages.
 * Limit: 5 messages per IP per hour.
 */
export function getMessageRateLimiter(): Ratelimit | null {
    const redis = createRedisClient();
    if (!redis) return null;

    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        prefix: "ratelimit:messages",
    });
}


/**
 * Checks rate limit for a given IP address.
 * Returns { allowed: true } if within limits, or { allowed: false, retryAfter } if exceeded.
 */
export async function checkRateLimit(
    rateLimiter: Ratelimit | null,
    identifier: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
    if (!rateLimiter) {
        // If rate limiter is not configured, allow the request
        return { allowed: true };
    }

    const result = await rateLimiter.limit(identifier);

    if (!result.success) {
        return {
            allowed: false,
            retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        };
    }

    return { allowed: true };
}
