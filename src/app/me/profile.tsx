"use client";
import { useEffect } from "react";
import accountApiRequest from "../../apiRequest/api.account";

export default function Profile() {
	useEffect(() => {
		const fetchProfile = async () => {
			const res = await accountApiRequest.clientMe();
			console.log("🚀 ~ fetchProfile ~ res", res);
		};
		fetchProfile();
	}, []);
	return (
		<div>
			<h1>Profile</h1>
		</div>
	);
}
