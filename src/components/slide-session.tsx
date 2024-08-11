"use client";

import { useEffect } from "react";
import authApiRequest from "../apiRequest/api.auth";
import { differenceInHours } from "date-fns";

export default function SlideSession() {
	const handleSlideSession = async () => {
		const now = new Date();
		const sessionTokenExpiresAt = localStorage.getItem("sessionTokenExpiresAt");
		const expiresAt = sessionTokenExpiresAt
			? new Date(sessionTokenExpiresAt)
			: now;
		if (differenceInHours(expiresAt, now) < 1) {
			const res = await authApiRequest.slideSessionFromNextClientToNextServer();
			if (res) {
				localStorage.setItem(
					"sessionTokenExpiresAt",
					res.payload.data.expiresAt
				);
			}
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
