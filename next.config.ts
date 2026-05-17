import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/weight", destination: "/gym/weight", permanent: true },
      { source: "/meals", destination: "/diet/meals", permanent: true },
      { source: "/water", destination: "/diet/water", permanent: true },
    ];
  },
};

export default nextConfig;
