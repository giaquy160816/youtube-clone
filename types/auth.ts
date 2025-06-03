/**
 * Auth token response type
 */
export type AuthToken = {
    accessToken: string;
    refreshToken: string;
};

/**
 * Auth response type
 */
export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        email: string;
        fullname: string;
        avatar?: string;
    };
}; 