#!/usr/bin/env node

/**
 * Rate Limit Test Script
 * Tests that the scan endpoint properly rate limits requests
 * 
 * Usage: node test-rate-limit.js
 */

const BASE_URL = 'http://localhost:3000';
const TEST_REPO = 'https://github.com/shadcn-ui/ui';

async function testRateLimit() {
    console.log('🧪 Testing Rate Limiting...\n');
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Test Repo: ${TEST_REPO}\n`);

    const results = [];

    for (let i = 1; i <= 12; i++) {
        try {
            const url = `${BASE_URL}/scan?repo=${encodeURIComponent(TEST_REPO)}`;
            const startTime = Date.now();

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'ProdReady-Test-Script',
                },
            });

            const duration = Date.now() - startTime;
            const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
            const rateLimitReset = response.headers.get('X-RateLimit-Reset');

            results.push({
                request: i,
                status: response.status,
                remaining: rateLimitRemaining,
                resetAt: rateLimitReset,
                duration,
            });

            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                console.log(`❌ Request ${i}: RATE LIMITED (429)`);
                console.log(`   Retry After: ${retryAfter}s`);
                console.log(`   Remaining: ${rateLimitRemaining}`);
                console.log(`   Reset At: ${rateLimitReset}\n`);
            } else {
                console.log(`✅ Request ${i}: SUCCESS (${response.status})`);
                console.log(`   Remaining: ${rateLimitRemaining}`);
                console.log(`   Duration: ${duration}ms\n`);
            }

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.error(`❌ Request ${i}: ERROR - ${error.message}\n`);
            results.push({
                request: i,
                error: error.message,
            });
        }
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log('─'.repeat(50));

    const successful = results.filter(r => r.status === 200).length;
    const rateLimited = results.filter(r => r.status === 429).length;
    const errors = results.filter(r => r.error).length;

    console.log(`Total Requests: ${results.length}`);
    console.log(`Successful (200): ${successful}`);
    console.log(`Rate Limited (429): ${rateLimited}`);
    console.log(`Errors: ${errors}`);

    if (rateLimited > 0) {
        console.log('\n✅ Rate limiting is working correctly!');
        console.log(`   First ${successful} requests succeeded`);
        console.log(`   Requests ${successful + 1}-${results.length} were rate limited`);
    } else {
        console.log('\n⚠️  Warning: No rate limiting detected!');
        console.log('   All requests succeeded - rate limiting may not be working');
    }

    console.log('\n');
}

// Run the test
testRateLimit().catch(console.error);
