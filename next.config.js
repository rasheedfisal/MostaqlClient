/** @type {import('next').NextConfig} */
module.exports = {
  redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  optimizeFonts: true,
  // images: {
  //   domains: ["127.0.0.1"],
  //   // formats: ["image/avif", "image/webp"],
  //   // remotePatterns: [
  //   //   {
  //   //     // protocol: "http",
  //   //     hostname: "localhost:3000/uploads",
  //   //     // port: "3000",
  //   //     // pathname: "/upload/**",
  //   //     // pathname: "",
  //   //   },
  //   //],
  // },
  // images: {
  //   domains: ["localhost:3000"],
  // },
  // images: {
  //   remotePatterns: [
  //     {
  //       // protocol: 'https',
  //       hostname: "localhost:3000",
  //       // port: '',
  //       // pathname: '/account123/**',
  //     },
  //   ],
  // },
  reactStrictMode: true,

  // basePath: "/auth/login",
  experimental: {
    appDir: true,
  },
};
