import { cookies } from "next/headers";
import authApiRequest from "../../../../apiRequest/api.auth";
import { HttpError } from "../../../../lib/http";

export async function POST(request: Request) {
	const res = await request.json();
	const force = res?.force;
	if (force) {
		return Response.json(
			{ message: "You force logged out" },
			{
				status: 200,
				headers: {
					// remove the sessionToken cookie
					"Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
				},
			}
		);
	}

	const cookieStorage = cookies();
	const sessionToken = cookieStorage.get("sessionToken");
	if (!sessionToken?.value) {
		return Response.json(
			{ message: "session Token not found" },
			{
				status: 401,
			}
		);
	}

	try {
		const res = await authApiRequest.logoutFromNextServerToServer(
			sessionToken.value
		);
		return Response.json(res.payload, {
			status: 200,
			headers: {
				// remove the sessionToken cookie
				"Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
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
