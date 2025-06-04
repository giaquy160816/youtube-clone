// types/page.ts

export type PageProps = {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
};

export type VideoPageProps = {
    params: {
        id: string;
    };
    searchParams?: Record<string, string | string[] | undefined>;
}; 