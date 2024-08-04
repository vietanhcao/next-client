"use client";
import React, { useEffect } from "react";
import { useAppContext } from "../AppProvider";
import envConfig from "../config";

export default function Profile() {
	const { sessionToken } = useAppContext();

	useEffect(() => {
		const fetchProfile = async () => {
			const res = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/account/me`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${sessionToken}`,
				},
			}).then(async (res) => {
				const payload = await res.json();
				const data = {
					status: res.status,
					payload,
				};
				if (!res.ok) {
					throw data;
				}

				return data;
			});
			console.log("🚀 ~ fetchProfile ~ res", res);
		};
		fetchProfile();
	}, []);
	return <div>Profile</div>;
}
