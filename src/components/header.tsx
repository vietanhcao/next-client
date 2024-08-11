import React from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import ButtonLogout from "./button-logout";
import { cookies } from "next/headers";
import accountApiRequest from "../apiRequest/api.account";
import { AccountResType } from "../schemaValidations/account.schema";

interface HeaderProps {
	user: AccountResType["data"] | null;
}

export default async function Header({ user }: HeaderProps) {
	return (
		<div>
			<ul className="flex gap-2">
				<li>
					<Link href={"/products"}>Products</Link>
				</li>
				<li>
						<ButtonLogout />
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
