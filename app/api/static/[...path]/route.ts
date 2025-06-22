import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:3002';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const path = resolvedParams.path.join('/');
        const url = new URL(request.url);
        const queryString = url.search;
        
        // Xây dựng URL đích cho static files - đảm bảo URL hợp lệ
        let targetUrl: string;
        try {
            targetUrl = new URL(`${path}${queryString}`, BACKEND_BASE_URL).toString();
        } catch (error) {
            console.warn('URL constructor failed, using string concatenation:', error);
            targetUrl = `${BACKEND_BASE_URL}/${path}${queryString}`;
        }
        
        console.log('📁 Static file request:', `${path} → ${targetUrl}`);
        
        // Thực hiện request đến backend
        const response = await fetch(targetUrl, {
            method: 'GET',
            credentials: 'include',
        });
        
        if (!response.ok) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }
        
        // Lấy binary data
        const responseData = await response.arrayBuffer();
        
        // Tạo response mới
        const newResponse = new NextResponse(responseData, {
            status: response.status,
            statusText: response.statusText,
        });
        
        // Copy content-type header
        const contentType = response.headers.get('content-type');
        if (contentType) {
            newResponse.headers.set('content-type', contentType);
        }
        
        // Thêm cache headers cho static files
        newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        newResponse.headers.set('ETag', `"${Date.now()}"`);
        
        return newResponse;
        
    } catch (error) {
        console.error('Static file proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 