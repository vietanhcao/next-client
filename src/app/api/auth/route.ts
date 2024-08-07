import { decodeJWT } from "../../../lib/utils";

type PayloadJWT = {
	iat: number;
	exp: number;
	tokenType: string;
	userId: string;
};

export async function POST(request: Request) {
	const res = await request.json();
	const sessionToken = res?.sessionToken;
	if (!sessionToken) {
		return Response.json(
			{ message: "session Token not found" },
			{
				status: 400,
			}
		);
	}
	const payload = decodeJWT<PayloadJWT>(sessionToken);
	const experied = new Date(payload.exp * 1000).toUTCString();

	return Response.json(res, {
		status: 200,
		headers: {
			"Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${experied}; SameSite=Lax; Secure`,
		},
	});
}
