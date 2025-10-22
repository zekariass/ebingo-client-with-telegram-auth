// import type { NextConfig } from "next";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
  
// }

// export default nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: `
  //             default-src 'self';
  //             script-src 'self' 'unsafe-inline' 'unsafe-eval';
  //             style-src 'self' 'unsafe-inline';
  //             img-src 'self' data: https:;
  //             font-src 'self' data:;
  //             connect-src 'self' https://api.bingofam.com wss://api.bingofam.com;
  //             frame-ancestors 'self';
  //             object-src 'none';
  //             base-uri 'self';
  //           `.replace(/\s{2,}/g, ' ').trim(),
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;

