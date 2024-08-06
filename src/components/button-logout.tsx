"use client";
import React from "react";
import { Button } from "./ui/button";
import authApiRequest from "../apiRequest/api.auth";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "../lib/utils";

export default function ButtonLogout() {
	const router = useRouter();
	const handleLogout = async () => {
		try {
			await authApiRequest.logoutFromNextClientToNextServer();
			router.push("/login");
		} catch (error) {
			handleErrorApi({ error });
		}
	};

	return (
		<Button onClick={handleLogout} size={"sm"}>
			Logout
		</Button>
	);
}
