export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export const loginEndpoint = `${API_BASE_URL}/backend/auth/login`;