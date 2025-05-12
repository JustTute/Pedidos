// next.config.ts
import type { NextConfig } from 'next';

const repo  = 'Pedidos';                 // nombre EXACTO del repo GitHub
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /** 1 · Salida estática para GitHub Pages */
  output: 'export',

  distDir: 'dist',               // carpeta de salida (GitHub Pages)
  /** 2 · Corrige rutas cuando el site vive en /<repo> */
  basePath:  isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',

  /** 3 · Evita la optimización de <Image> (requiere servidor) */
  images: { unoptimized: true },
};

export default nextConfig;
