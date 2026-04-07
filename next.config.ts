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
      config.optimization.minimize = true;
      config.devtool = false;
      config.parallelism = 1;
      
      // Das hier verhindert, dass er versucht, den Code in zu viele kleine Teile zu zerlegen
      config.optimization.splitChunks = false; 
    }
    return config;
  },
  experimental: {
    // Hilft Next.js, den Speicher während des Builds besser zu verwalten
    webpackMemoryOptimizations: true,
  }
});

export default nextConfig;
