/**
 * Base API response type
 */
export type ApiResponse<T> = {
    data: T;
    message?: string;
    status?: number;
};

/**
 * Pagination parameters
 */
export type PaginationParams = {
    page: number;
    limit: number;
    q?: string;
};

/**
 * Paginated response type
 */
export type PaginatedResponse<T> = ApiResponse<T> & {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

/**
 * Video list parameters
 */
export type VideoListParams = PaginationParams & {
    q: string;
}; 