import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
	const isLogin = false;
	if (!isLogin) {
		redirect("/login"); // just server component
	}
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="size-96 bg-red-400">
				<Image
					// src="/images/448305433_503520218851072_8421567374049262245_n.jpg"
					src="https://upload.wikimedia.org/wikipedia/commons/4/42/Canyon_midday.jpg"
					alt="Logo"
					width={200}
					height={200}
					quality={100}
				/>
			</div>
			<ul>
				<li>
					<Link href="/login">Go to login</Link>
				</li>
			</ul>
		</main>
	);
}
