#!/usr/bin/env node

/**
 * OG Image Test Script
 * Verifies that OG image exists and meta tags are correct
 * 
 * Usage: node test-og-image.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const OG_IMAGE_PATH = path.join(__dirname, 'public', 'og-image.png');

async function testOGImage() {
    console.log('🧪 Testing OG Image Configuration...\n');

    let allPassed = true;

    // Test 1: Check if OG image file exists
    console.log('Test 1: OG Image File Exists');
    console.log('─'.repeat(50));

    if (fs.existsSync(OG_IMAGE_PATH)) {
        const stats = fs.statSync(OG_IMAGE_PATH);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`✅ File exists: ${OG_IMAGE_PATH}`);
        console.log(`   Size: ${sizeKB} KB`);

        if (stats.size < 1024) {
            console.log('⚠️  Warning: File seems very small, may be corrupted');
            allPassed = false;
        }
    } else {
        console.log(`❌ File NOT found: ${OG_IMAGE_PATH}`);
        allPassed = false;
    }

    console.log('\n');

    // Test 2: Check HTML meta tags
    console.log('Test 2: HTML Meta Tags');
    console.log('─'.repeat(50));

    try {
        const response = await fetch(BASE_URL);
        const html = await response.text();

        const checks = [
            { tag: 'og:image', regex: /<meta[^>]*property="og:image"[^>]*content="\/og-image\.png"[^>]*>/i },
            { tag: 'og:image:width', regex: /<meta[^>]*property="og:image:width"[^>]*content="1200"[^>]*>/i },
            { tag: 'og:image:height', regex: /<meta[^>]*property="og:image:height"[^>]*content="630"[^>]*>/i },
            { tag: 'twitter:image', regex: /<meta[^>]*name="twitter:image"[^>]*content="\/og-image\.png"[^>]*>/i },
        ];

        for (const check of checks) {
            if (check.regex.test(html)) {
                console.log(`✅ ${check.tag} meta tag found`);
            } else {
                console.log(`❌ ${check.tag} meta tag NOT found`);
                allPassed = false;
            }
        }

    } catch (error) {
        console.log(`❌ Failed to fetch homepage: ${error.message}`);
        allPassed = false;
    }

    console.log('\n');

    // Test 3: Check image accessibility
    console.log('Test 3: Image Accessibility');
    console.log('─'.repeat(50));

    try {
        const imageUrl = `${BASE_URL}/og-image.png`;
        const response = await fetch(imageUrl);

        if (response.ok) {
            const contentType = response.headers.get('content-type');
            console.log(`✅ Image accessible at: ${imageUrl}`);
            console.log(`   Content-Type: ${contentType}`);

            if (!contentType?.includes('image')) {
                console.log('⚠️  Warning: Content-Type is not an image type');
                allPassed = false;
            }
        } else {
            console.log(`❌ Image not accessible: ${response.status} ${response.statusText}`);
            allPassed = false;
        }
    } catch (error) {
        console.log(`❌ Failed to fetch image: ${error.message}`);
        allPassed = false;
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log('─'.repeat(50));

    if (allPassed) {
        console.log('✅ All OG image tests passed!');
        console.log('\nNext steps:');
        console.log('1. Test on Twitter Card Validator: https://cards-dev.twitter.com/validator');
        console.log('2. Test on LinkedIn Post Inspector');
        console.log('3. Test on Facebook Sharing Debugger');
    } else {
        console.log('❌ Some tests failed. Please review the errors above.');
    }

    console.log('\n');
}

// Run the test
testOGImage().catch(console.error);
