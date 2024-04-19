// next.config.js
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["image.tmdb.org"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://lookup.binlist.net/:path*",
      },
    ];
  },
};
