export default function LoginLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<p>nested layout</p>
			<div>{children}</div>
		</main>
	);
}
