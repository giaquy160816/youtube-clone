import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    trailingSlash: false,
    reactStrictMode: false,
    images: {
        domains: ['picsum.photos', 'i.ytimg.com', 'i.pravatar.cc', 'localhost', 'lh3.googleusercontent.com'],
    }
};

export default nextConfig;
