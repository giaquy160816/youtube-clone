type CacheValue<T> = {
    data: T;
    expiresAt: number;
};

export class InMemoryCache<T = unknown> {
    private store = new Map<string, CacheValue<T>>();

    constructor(private ttl: number = 60 * 1000) { } // default 60s

    get(key: string): T | null {
        const cached = this.store.get(key);
        const now = Date.now();

        if (cached && cached.expiresAt > now) {
            return cached.data;
        }

        this.store.delete(key);
        return null;
    }

    set(key: string, data: T) {
        this.store.set(key, {
            data,
            expiresAt: Date.now() + this.ttl,
        });
    }

    delete(key: string) {
        this.store.delete(key);
    }

    clear() {
        this.store.clear();
    }
}