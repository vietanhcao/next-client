/** @type {import('next').NextConfig} */
const nextConfig = {
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	images: {
		remotePatterns: [
			{
				hostname: "upload.wikimedia.org",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "4000",
			},
		],
	},
};

export default nextConfig;
