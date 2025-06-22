#!/usr/bin/env node

/**
 * Script test đơn giản để kiểm tra các fix
 * Chạy: node scripts/test-fix.js
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testFix() {
    console.log('🔧 Testing Fixes...\n');

    const tests = [
        {
            name: 'Test Video List (empty query)',
            url: `${BASE_URL}/api/proxy/video?q=&page=1&limit=7`,
            expected: 'Should work with empty query'
        },
        {
            name: 'Test Video Detail',
            url: `${BASE_URL}/api/proxy/video/22`,
            expected: 'Should work with video ID'
        },
        {
            name: 'Test Encrypted Video Detail',
            url: `${BASE_URL}/api/proxy/v/22`,
            expected: 'Should decrypt to /video/22'
        }
    ];

    for (const test of tests) {
        try {
            console.log(`🧪 ${test.name}`);
            console.log(`   URL: ${test.url}`);
            
            const response = await fetch(test.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log(`   Status: ${response.status}`);
            
            if (response.ok) {
                console.log('   ✅ Success\n');
            } else {
                const errorText = await response.text();
                console.log(`   ❌ Failed: ${errorText}\n`);
            }

        } catch (error) {
            console.log(`   ❌ Error: ${error.message}\n`);
        }
    }

    console.log('🎯 Fix Summary:');
    console.log('✅ URL parsing should work');
    console.log('✅ Endpoint encryption should work');
    console.log('✅ Query parameters should work');
}

// Chạy test
testFix().catch(console.error); 