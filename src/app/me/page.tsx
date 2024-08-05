import { cookies } from "next/headers";
import envConfig from "../config";
import Profile from "./profile";
import accountApiRequest from "../../apiRequest/api.account";

export default async function PageMe() {
	const cookieStore = cookies();
	const dataCookie = cookieStore.get("sessionToken");
	const res = await accountApiRequest.me(dataCookie?.value ?? "");

	return (
		<div>
			<h4 className="text-2xl font-semibold text-center">Profile</h4>
			<div className="flex justify-center">
				<p>{JSON.stringify(res.payload.data)}</p>
			</div>
			<Profile />
		</div>
	);
}
