"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { clientSessionToken } from "../../../lib/http";
import authApiRequest from "../../../apiRequest/api.auth";

export default function LogoutPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const sessionToken = searchParams.get("sessionToken");
	useEffect(() => {
		// chặn call 2 lần api logout
		const controler = new AbortController();
		const signal = controler.signal;
		if (sessionToken === clientSessionToken.value) {
			authApiRequest.logoutFromNextClientToNextServer(true, signal).then(() => {
				router.push("/login?redirectForm=" + pathname);
			});
		}
		return () => {
			controler.abort();
		};
	}, [sessionToken, router, pathname]);
	return (
		<div>
			<h4 className="text-2xl font-semibold text-center">Logout Page</h4>
			<div className="flex justify-center"></div>
		</div>
	);
}
