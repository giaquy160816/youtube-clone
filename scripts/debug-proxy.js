#!/usr/bin/env node

/**
 * Script debug proxy và URL parsing issues
 * Chạy: node scripts/debug-proxy.js
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function debugProxy() {
    console.log('🐛 Debugging Proxy Issues...\n');

    const testCases = [
        {
            name: 'Test Video List API',
            url: `${BASE_URL}/api/proxy/video?q=&page=1&limit=9`,
            expected: 'Should work with empty query'
        },
        {
            name: 'Test Video Detail API',
            url: `${BASE_URL}/api/proxy/video/22`,
            expected: 'Should work with video ID'
        },
        {
            name: 'Test Encrypted Video Detail',
            url: `${BASE_URL}/api/proxy/v/22`,
            expected: 'Should decrypt to /video/22'
        },
        {
            name: 'Test Static File',
            url: `${BASE_URL}/api/static/uploads/images/2025/06/12/1749732080216-pikachu.webp`,
            expected: 'Should serve static file'
        }
    ];

    for (const test of testCases) {
        try {
            console.log(`🧪 ${test.name}`);
            console.log(`   URL: ${test.url}`);
            console.log(`   Expected: ${test.expected}`);
            
            const response = await fetch(test.url, {
                method: 'GET',
                headers: {
                    'Accept': '*/*'
                }
            });

            console.log(`   Status: ${response.status}`);
            console.log(`   Content-Type: ${response.headers.get('content-type')}`);
            
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    const data = await response.text();
                    console.log(`   Response: ${data.substring(0, 200)}...`);
                } else {
                    console.log(`   Response: Binary data (${response.headers.get('content-length')} bytes)`);
                }
                console.log('   ✅ Success\n');
            } else {
                const errorText = await response.text();
                console.log(`   ❌ Failed: ${errorText}\n`);
            }

        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            if (error.cause) {
                console.log(`   Cause: ${error.cause.message}`);
            }
            console.log('');
        }
    }

    console.log('🎯 Debug Summary:');
    console.log('✅ Check Next.js 15 compatibility');
    console.log('✅ Check URL parsing in proxy');
    console.log('✅ Check endpoint encryption/decryption');
    console.log('✅ Check static file serving');
}

// Chạy debug
debugProxy().catch(console.error); 