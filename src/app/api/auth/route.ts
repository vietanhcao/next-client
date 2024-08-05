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

	return Response.json(res, {
		status: 200,
		headers: { "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly` },
	});
}
