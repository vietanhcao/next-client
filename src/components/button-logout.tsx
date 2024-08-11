"use client";
import React from "react";
import { Button } from "./ui/button";
import authApiRequest from "../apiRequest/api.auth";
import { usePathname, useRouter } from "next/navigation";
import { handleErrorApi } from "../lib/utils";

export default function ButtonLogout() {
	const router = useRouter();
	const pathname = usePathname();
	const handleLogout = async () => {
		try {
			await authApiRequest.logoutFromNextClientToNextServer();
			router.push("/login");
		} catch (error) {
			handleErrorApi({ error });
			authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
				router.push("/login?redirectForm=" + pathname);
			});
		} finally {
			router.refresh();
			localStorage.removeItem("sessionToken");
			localStorage.removeItem("sessionTokenExpiresAt");
		}
	};

	return (
		<Button onClick={handleLogout} size={"sm"}>
			Logout
		</Button>
	);
}
