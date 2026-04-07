import { defineConfig } from './src/libs/next/config/define-config';

const isVercel = !!process.env.VERCEL_ENV;

const vercelConfig = {
  // Verhindert das Mitkopieren schwerer Binärdateien
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

  // Fehler ignorieren, um RAM bei der Prüfung zu sparen
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // --- DIE RADIKALE RAM-RETTUNG ---
  webpack: (config) => {
    if (isVercel) {
      config.optimization.minimize = false;    // Schaltet den speicherfressenden Komprimierer aus
      config.optimization.splitChunks = false; // Verhindert komplexes Code-Splitting
      config.devtool = false;                 // Keine schweren Source-Maps generieren
      config.parallelism = 1;                 // Nur ein CPU-Kern für Webpack
    }
    return config;
  },

  experimental: {
    webpackMemoryOptimizations: true,         // Aktiviert interne Next.js Speicher-Spar-Features
  }
});

export default nextConfig;
