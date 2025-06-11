// types/api.ts

export type ApiResponse<T> = {
    data: T;
    message?: string;
    status?: number;
    total?: number;
};

export type PaginationParams = {
    page: number;
    limit: number;
    q?: string;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type VideoListParams = PaginationParams & {
    q: string;
}; 

export type responseSuccess = {
    message: string;
}