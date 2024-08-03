/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "upload.wikimedia.org",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
