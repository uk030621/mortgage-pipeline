/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  // Default dev indicator sits bottom-left, which collides with the
  // sidebar's sign-out link in this layout — move it out of the way.
  devIndicators: {
    position: "bottom-right",
  },
};

module.exports = nextConfig;
