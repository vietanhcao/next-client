import { cookies } from "next/headers";
import envConfig from "../config";
import Profile from "./profile";
import accountApiRequest from "../../apiRequest/api.account";
import ProfileForm from "./profile-form";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile",
};

export default async function MeProfile() {
	const cookieStore = cookies();
	const dataCookie = cookieStore.get("sessionToken");
	const res = await accountApiRequest.me(dataCookie?.value ?? "");

	return (
		<div>
			<h4 className="text-2xl font-semibold text-center">Profile</h4>
			<div className="flex justify-center">
				<ProfileForm profile={res.payload.data} />
			</div>
		</div>
	);
}
