"use client";
import { useState } from "react";
import { clientSessionToken } from "../lib/http";

export default function AppProvider({
	children,
	initalSessionToken = "",
}: {
	children: React.ReactNode;
	initalSessionToken?: string;
}) {
	useState(() => {
		if (typeof window !== "undefined") {
			clientSessionToken.value = initalSessionToken;
		}
	});

	return <>{children}</>;
}
