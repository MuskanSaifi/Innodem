import 'dotenv/config';

const nextConfig = {
  env: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
  },
  images: {
    domains: [
      "upload-images-in-bucket.s3.eu-north-1.amazonaws.com",
      "img.freepik.com","example.com","images.unsplash.com" // Added Freepik image domain
    ],
  },
};

export default nextConfig;
