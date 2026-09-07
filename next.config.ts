import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/redirects.mjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
