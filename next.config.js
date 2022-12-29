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
