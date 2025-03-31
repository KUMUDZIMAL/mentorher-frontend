import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    });
    config.resolve.alias["@tailwindcss/oxide-linux-x64-gnu"] = false;
    return config;
  },
  async headers() {
    return [
      {
        source: "/api/socket",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        ],
      },
    ];
  },
  eslint: {
    // This allows production builds to successfully complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARNING !!
    // This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    // !! WARNING !!
    ignoreBuildErrors: true,
  },
  experimental: {
    // @ts-ignore: nextConfig.experimental.optimizeFonts is not officially typed but works at runtime.
    outputFileTracingExcludes: {
      '*': ['node_modules/**'],
    optimizeFonts: false,
  }},
};

export default nextConfig;
