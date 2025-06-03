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
    token: AuthToken;
    user: {
        id: string;
        email: string;
        fullname: string;
        avatar?: string;
    };
}; 