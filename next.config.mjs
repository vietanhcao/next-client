/** @type {import('next').NextConfig} */
const nextConfig = {
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
