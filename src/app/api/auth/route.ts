export async function POST(request: Request) {
	const body = await request.json();
	const sessionToken = body?.sessionToken;
	const expiresAt = body?.expiresAt;

	if (!sessionToken) {
		return Response.json(
			{ message: "session Token not found" },
			{
				status: 400,
			}
		);
	}
	const experied = new Date(expiresAt).toUTCString();

	return Response.json(body, {
		status: 200,
		headers: {
			"Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${experied}; SameSite=Lax; Secure`,
		},
	});
}
