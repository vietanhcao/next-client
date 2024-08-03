import Image from "next/image";
import { Button } from "../components/ui/button";
import Card from "./components/Card";
import Header from "./Header";

export default function Home() {
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
			<Header />
			<Card />
		</main>
	);
}
