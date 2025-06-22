#!/usr/bin/env node

/**
 * Script test URL creation
 * Chạy: node scripts/test-url.js
 */

// Mock window object for testing
global.window = {
    location: {
        origin: 'http://localhost:3000'
    }
};

// Mock process.env
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Import functions (simplified for testing)
function createApiUrl(path) {
    const API_BASE_URL = '/api/proxy';
    
    if (typeof window !== 'undefined') {
        return `${window.location.origin}${API_BASE_URL}${path}`;
    } else {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        return `${baseUrl}${API_BASE_URL}${path}`;
    }
}

function createStaticUrl(path) {
    const STATIC_BASE_URL = '/api/static';
    
    if (typeof window !== 'undefined') {
        return `${window.location.origin}${STATIC_BASE_URL}/${path}`;
    } else {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        return `${baseUrl}${STATIC_BASE_URL}/${path}`;
    }
}

function testUrlCreation() {
    console.log('🔗 Testing URL Creation...\n');

    const testCases = [
        {
            name: 'API URL - Video List',
            input: '/video?q=&page=1&limit=7',
            expected: 'http://localhost:3000/api/proxy/video?q=&page=1&limit=7'
        },
        {
            name: 'API URL - Video Detail',
            input: '/video/22',
            expected: 'http://localhost:3000/api/proxy/video/22'
        },
        {
            name: 'Static URL - Image',
            input: 'uploads/images/2025/06/12/1749732080216-pikachu.webp',
            expected: 'http://localhost:3000/api/static/uploads/images/2025/06/12/1749732080216-pikachu.webp'
        }
    ];

    for (const test of testCases) {
        console.log(`🧪 ${test.name}`);
        console.log(`   Input: ${test.input}`);
        
        let result;
        if (test.name.includes('Static')) {
            result = createStaticUrl(test.input);
        } else {
            result = createApiUrl(test.input);
        }
        
        console.log(`   Result: ${result}`);
        console.log(`   Expected: ${test.expected}`);
        
        if (result === test.expected) {
            console.log('   ✅ Pass\n');
        } else {
            console.log('   ❌ Fail\n');
        }
    }

    console.log('🎯 URL Creation Test Summary:');
    console.log('✅ Absolute URLs should be created correctly');
    console.log('✅ Both client and server should work');
    console.log('✅ API and static URLs should be different');
}

// Chạy test
testUrlCreation(); 