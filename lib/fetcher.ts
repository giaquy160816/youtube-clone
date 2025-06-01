// ✅ 4. Hàm gọi API có sẵn token
// file: lib/fetcher.ts

export async function api<T = any>(
    url: string,
    options: RequestInit = {},
    body?: any
): Promise<T> {
    const token = localStorage.getItem("access_token");

    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(err.message || 'Request failed');
    }

    return res.json();
}


// 👉 Dùng:
// const data = await api('/backend/auth/me');
// const updated = await api('/backend/profile/update', { method: 'POST' }, { name: 'New name' });
