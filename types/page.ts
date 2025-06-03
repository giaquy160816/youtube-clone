// types/page.ts
/**
 * Base type for page props
 */
export type PageProps = {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
};

/**
 * Type for video detail page props
 */
export type VideoPageProps = {
    params: {
        id: string;
    };
    searchParams?: Record<string, string | string[] | undefined>;
}; 