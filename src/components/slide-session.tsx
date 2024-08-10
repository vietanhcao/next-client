"use client";

import { useEffect } from "react";
import authApiRequest from "../apiRequest/api.auth";
import { clientSessionToken } from "../lib/http";
import { differenceInHours } from "date-fns";

export default function SlideSession() {
	const handleSlideSession = async () => {
		const now = new Date();
		const expiresAt = new Date(clientSessionToken.expiresAt);
		if (differenceInHours(expiresAt, now) < 1) {
			const res = await authApiRequest.slideSessionFromNextClientToNextServer();
			clientSessionToken.expiresAt = res.payload.data.expiresAt;
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			handleSlideSession();
		}, 1000 * 60 * 60);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return null;
}
