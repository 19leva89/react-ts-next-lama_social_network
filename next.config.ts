import { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.pexels.com',
			},
			{
				protocol: 'https',
				hostname: 'img.clerk.com',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
		unoptimized: true,
	},
	// cacheComponents: true,
	reactCompiler: true,
	reactStrictMode: false,
	poweredByHeader: false, // remove X-Powered-By
	compress: true, // gzip compression
}

export default nextConfig
