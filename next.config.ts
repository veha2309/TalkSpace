import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    domains:[
        "res.cloudinary.com",
        "avatars.githubusercontent.com/:path*",
        "lh3.googleusercontent.com",
    ]
}
};


export default nextConfig;