import { cookies } from "next/headers";
import envConfig from "../config";
import Profile from "./profile";

export default async function PageMe() {
	// const cookieStore = cookies();
	// const dataCookie = cookieStore.get("sessionToken");
	// const res = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/account/me`, {
	// 	method: "GET",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 		Authorization: `Bearer ${dataCookie?.value}`,
	// 	},
	// }).then(async (res) => {
	// 	const payload = await res.json();
	// 	const data = {
	// 		status: res.status,
	// 		payload,
	// 	};
	// 	if (!res.ok) {
	// 		throw data;
	// 	}

	// 	return data;
	// });

	return (
		<div>
			<h4 className="text-2xl font-semibold text-center">Profile</h4>
			{/* <div className="flex justify-center">
				<p>{JSON.stringify(res)}</p>
			</div> */}
			<Profile />
		</div>
	);
}
