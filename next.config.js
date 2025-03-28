/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // ✅ Cloudinary is allowed
  },
};

export default nextConfig;
