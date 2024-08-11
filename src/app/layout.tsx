import type { Metadata } from "next";
// import { Roboto } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Header from "../components/header";
import { Toaster } from "../components/ui/toaster";
import AppProvider from "./AppProvider";
import { cookies } from "next/headers";
import SlideSession from "../components/slide-session";
import accountApiRequest from "../apiRequest/api.account";
import { AccountResType } from "../schemaValidations/account.schema";
import { baseOpenGraph } from "./shared-metadata";

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
	title: {
		template: "%s | FA",
		default: "FA",
	},
	description: "Generated by create next app11",
	openGraph: baseOpenGraph,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let user: AccountResType["data"] | null = null;

	return (
		<html
			lang="en"
			className={`${myFont.className} ${myFont.variable}`}
			suppressHydrationWarning
		>
			<body>
				<header>my root header</header>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<AppProvider user={user}>
						<Header user={user} />
						{children}
						<SlideSession />
					</AppProvider>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
