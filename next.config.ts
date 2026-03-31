import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        dangerouslyAllowLocalIP: true,
        remotePatterns: [{
            protocol: "http",
            hostname: "localhost",
            port: "9000",
            pathname: "/**",
        }],
    }
};

export default nextConfig;
