import type { Metadata } from "next";
// import { Roboto } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

// const roboto = Roboto({
// 	subsets: ["vietnamese"],
// 	weight: ["100", "300", "400", "500", "700", "900"],
// });

// Font files can be colocated inside of `app`
const myFont = localFont({
	src: [
		{
			path: "./Roboto-Thin.ttf",
			weight: "100",
		},
		{
			path: "./Roboto-Regular.ttf",
			weight: "400",
		},
	],
	display: "swap",
	variable: "--font-roboto",
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${myFont.className} ${myFont.variable}`} suppressHydrationWarning>
			<body>
				<header>my root header</header>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
