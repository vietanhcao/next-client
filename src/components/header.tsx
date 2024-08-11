import React from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import ButtonLogout from "./button-logout";
import { cookies } from "next/headers";
import accountApiRequest from "../apiRequest/api.account";

export default async function Header() {
	const cookieStore = cookies();
	const sessionToken = cookieStore.get("sessionToken")?.value || "";
	let user = null;
	if (sessionToken) {
		try {
			const rest = await accountApiRequest.me(sessionToken);
			user = rest.payload.data;
		} catch (error) {
			console.log("🚀 ~ Header ~ error:", error);
		}
	}

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
