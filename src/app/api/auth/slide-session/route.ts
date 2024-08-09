import { cookies } from "next/headers";
import authApiRequest from "../../../../apiRequest/api.auth";
import { HttpError } from "../../../../lib/http";

export async function POST(request: Request) {
	const cookieStore = cookies();
	const sessionToken = cookieStore.get("sessionToken");

	if (!sessionToken) {
		return Response.json(
			{ message: "session Token not found" },
			{
				status: 401,
			}
		);
	}

	try {
		const res = await authApiRequest.slideSessionFromNextServerToServer(
			sessionToken.value
		);
		const newExiresDate = new Date(res.payload.data.expiresAt).toUTCString();
		return Response.json(res.payload, {
			status: 200,
			headers: {
				"Set-Cookie": `sessionToken=${sessionToken.value}; Path=/; HttpOnly; Expires=${newExiresDate}; SameSite=Lax; Secure`,
			},
		});
	} catch (error) {
		if (error instanceof HttpError) {
			return Response.json(error.payload, { status: error.status });
		} else {
			return Response.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
}
