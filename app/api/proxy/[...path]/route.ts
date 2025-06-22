import { NextRequest, NextResponse } from 'next/server';
import { SecurityUtils } from '@/lib/utils/security';

const BACKEND_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:3002';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'GET');
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'POST');
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'PUT');
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'DELETE');
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxyRequest(request, resolvedParams.path, 'PATCH');
}

async function handleProxyRequest(
    request: NextRequest,
    pathSegments: string[],
    method: string
) {
    try {
        const path = pathSegments.join('/');
        const url = new URL(request.url);
        const queryString = url.search;
        
        const decodedPath = SecurityUtils.decryptEndpoint(path);
        
        let targetUrl: string;
        try {
            targetUrl = new URL(`${decodedPath}${queryString}`, BACKEND_BASE_URL).toString();
        } catch (error) {
            console.warn('URL constructor failed, using string concatenation:', error);
            targetUrl = `${BACKEND_BASE_URL}${decodedPath}${queryString}`;
        }
        
        console.log('🌐 Proxy request:', `${method} ${path} → ${targetUrl}`);
        
        // Lấy body và kiểm tra có phải là FormData không
        let body: BodyInit | null = null;
        let isFormData = false;
        if (method !== 'GET' && method !== 'HEAD') {
            const contentType = request.headers.get('content-type');
            if (contentType?.includes('multipart/form-data')) {
                body = await request.formData();
                isFormData = true;
            } else {
                body = await request.text();
            }
        }

        // Lấy headers từ request gốc
        const headers = new Headers();
        
        // Copy các headers cần thiết
        const allowedHeaders = [
            'authorization',
            'content-type',
            'accept',
            'user-agent',
            'cookie'
        ];
        
        allowedHeaders.forEach(header => {
            // **FIX**: Không copy Content-Type cho FormData
            if (header === 'content-type' && isFormData) {
                return; 
            }
            const value = request.headers.get(header);
            if (value) {
                headers.set(header, value);
            }
        });
        
        headers.set('X-Request-ID', SecurityUtils.generateRequestId());
        
        // Thực hiện request đến backend
        const response = await fetch(targetUrl, {
            method,
            headers,
            body,
            credentials: 'include',
        });
        
        // Kiểm tra content type để xử lý đúng loại data
        const contentType = response.headers.get('content-type');
        const isBinary = contentType && (
            contentType.startsWith('image/') ||
            contentType.startsWith('video/') ||
            contentType.startsWith('audio/') ||
            contentType.startsWith('application/octet-stream') ||
            contentType.includes('multipart')
        );
        
        let responseData: string | ArrayBuffer;
        
        if (isBinary) {
            // Xử lý binary data cho file media
            responseData = await response.arrayBuffer();
        } else {
            // Xử lý text data cho API responses
            responseData = await response.text();
        }
        
        // Tạo response mới với đúng loại data
        const newResponse = new NextResponse(responseData, {
            status: response.status,
            statusText: response.statusText,
        });
        
        // Copy response headers nhưng ẩn thông tin nhạy cảm
        response.headers.forEach((value, key) => {
            // Loại bỏ headers có thể gây vấn đề hoặc chứa thông tin nhạy cảm
            if (!['content-encoding', 'transfer-encoding', 'server', 'x-powered-by'].includes(key.toLowerCase())) {
                newResponse.headers.set(key, value);
            }
        });
        
        // Thêm security headers (chỉ cho API responses, không cho file media)
        if (!isBinary) {
            newResponse.headers.set('X-Content-Type-Options', 'nosniff');
            newResponse.headers.set('X-Frame-Options', 'DENY');
            newResponse.headers.set('X-XSS-Protection', '1; mode=block');
        }
        
        return newResponse;
        
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 