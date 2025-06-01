// ✅ lib/fetcher.ts

export async function api<TResponse = unknown, TRequest = unknown>(
    url: string,
    options: RequestInit = {},
    body?: TRequest
): Promise<TResponse> {
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