import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:locale(tr|en)/about",
        destination: "/:locale/hakkimizda",
        permanent: true,
      },
      {
        source: "/:locale(tr|en)/products",
        destination: "/:locale/urunler",
        permanent: true,
      },
      {
        source: "/:locale(tr|en)/products/:slug",
        destination: "/:locale/urunler/:slug",
        permanent: true,
      },
      {
        source: "/:locale(tr|en)/contact",
        destination: "/:locale/iletisim",
        permanent: true,
      },
      {
        source: "/:locale(tr|en)/tools",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale(tr|en)/tools/:path*",
        destination: "/:locale",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: projectRoot,
    resolveAlias: {
      fs: "./src/lib/empty-module.ts",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.output = {
      ...config.output,
      webassemblyModuleFilename: "static/wasm/[modulehash].wasm",
    };
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.karpol.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
