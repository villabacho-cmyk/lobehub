import { defineConfig } from './src/libs/next/config/define-config';

const isVercel = !!process.env.VERCEL_ENV;

const vercelConfig = {
  outputFileTracingExcludes: {
    '*': [
      'node_modules/.pnpm/@napi-rs+canvas-*-musl*',
      'node_modules/.pnpm/@img+sharp-libvips-*musl*',
      'public/_spa/**',
      'dist/desktop/**',
      'dist/mobile/**',
      'apps/desktop/**',
      'packages/database/migrations/**',
    ],
  },
};

const nextConfig = defineConfig({
  ...(isVercel ? vercelConfig : {}),
  
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
  // --- NEU: RADIKALE SPEICHER-OPTIMIERUNG ---
  webpack: (config, { isServer }) => {
    if (isVercel) {
      config.optimization.minimize = true; // Minimierung anlassen, aber...
      config.devtool = false; // Absolut keine Source Maps generieren
      
      // Begrenzt die parallele Verarbeitung innerhalb von Webpack
      config.parallelism = 1; 
      
      // Verhindert, dass Webpack zu viele Chunks gleichzeitig im Speicher hält
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 1,
        minSize: 100000, 
      };
    }
    return config;
  },
  experimental: {
    // Hilft Next.js, den Speicher während des Builds besser zu verwalten
    webpackMemoryOptimizations: true,
  }
});

export default nextConfig;
