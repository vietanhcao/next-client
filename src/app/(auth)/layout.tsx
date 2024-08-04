export default function RegisterLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<div>{children}</div>
		</main>
	);
}
