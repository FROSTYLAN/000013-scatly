/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  optimizeFonts: true,
  compress: true,
  env: {
    POSTGRES_URL: process.env.POSTGRES_URL,
  },
  experimental: {
    staticPageGenerationTimeout: 120,
  },
  // Excluir rutas de API de la generación estática
  output: 'standalone',
  async headers() {
    return [
      {
        // Aplicar estas cabeceras a todas las rutas
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Permitir cualquier origen para Vercel
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
