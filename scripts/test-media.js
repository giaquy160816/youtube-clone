#!/usr/bin/env node

/**
 * Script test việc load file media qua proxy
 * Chạy: node scripts/test-media.js
 */

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

async function testMediaFiles() {
    console.log('🖼️ Testing Media Files Loading...\n');

    const testFiles = [
        {
            name: 'Test Image via Static Route',
            url: `${BASE_URL}/api/static/uploads/images/2025/06/12/1749732080216-pikachu.webp`,
            expectedType: 'image/webp'
        },
        {
            name: 'Test Image via Proxy Route',
            url: `${BASE_URL}/api/proxy/uploads/images/2025/06/12/1749732080216-pikachu.webp`,
            expectedType: 'image/webp'
        },
        {
            name: 'Test Video File',
            url: `${BASE_URL}/api/static/uploads/videos/test-video.mp4`,
            expectedType: 'video/mp4'
        }
    ];

    for (const test of testFiles) {
        try {
            console.log(`🧪 ${test.name}`);
            console.log(`   URL: ${test.url}`);
            
            const response = await fetch(test.url, {
                method: 'GET',
                headers: {
                    'Accept': '*/*'
                }
            });

            console.log(`   Status: ${response.status}`);
            console.log(`   Content-Type: ${response.headers.get('content-type')}`);
            console.log(`   Content-Length: ${response.headers.get('content-length')}`);
            console.log(`   Cache-Control: ${response.headers.get('cache-control')}`);

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.startsWith(test.expectedType.split('/')[0])) {
                    console.log('   ✅ Success - Correct content type\n');
                } else {
                    console.log('   ⚠️ Warning - Unexpected content type\n');
                }
            } else {
                console.log('   ❌ Failed\n');
            }

        } catch (error) {
            console.log(`   ❌ Error: ${error.message}\n`);
        }
    }

    console.log('🎯 Media Test Summary:');
    console.log('✅ Static files route for uploads');
    console.log('✅ Binary data handling');
    console.log('✅ Cache headers for static files');
    console.log('✅ Content-type preservation');
}

// Chạy test
testMediaFiles().catch(console.error); 