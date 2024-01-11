/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/dashboard/schedule",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
