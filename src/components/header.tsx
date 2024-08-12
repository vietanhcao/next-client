"use client";
import Link from "next/link";
import { useAppContext } from "../app/AppProvider";
import ButtonLogout from "./button-logout";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	const { user } = useAppContext();
	return (
		<div>
			<ul className="flex gap-2">
				<li>
					<Link href={"/products"}>Products</Link>
				</li>

				{user ? (
					<li>
						<ButtonLogout />
					</li>
				) : (
					<>
						<li>
							<Link href={"/login"}>Login</Link>
						</li>
						<li>
							<Link href={"/register"}>Register</Link>
						</li>
					</>
				)}
			</ul>
			<ModeToggle />
		</div>
	);
}
