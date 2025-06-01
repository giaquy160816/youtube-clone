import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    trailingSlash: false,
    images: {
        domains: ['picsum.photos', 'i.ytimg.com', 'i.pravatar.cc'],
    },
    rewrites: async () => [
        {
            source: '/:slug*',
            destination: '/routes/:slug*',
        },
    ],
};

export default nextConfig;
