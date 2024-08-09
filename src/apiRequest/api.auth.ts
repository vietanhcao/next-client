import http from "../lib/http";
import {
	LoginBodyType,
	LoginResType,
	RegisterBodyType,
	RegisterResType,
	SlideSessionResType,
} from "../schemaValidations/auth.schema";
import { MessageResType } from "../schemaValidations/common.schema";

const authApiRequest = {
	login: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
	register: (body: RegisterBodyType) =>
		http.post<RegisterResType>("/auth/register", body),
	auth: (body: { sessionToken: string, expiresAt: string }) =>
		http.post<{ sessionToken: string }>("/api/auth", body, {
			baseUrl: "",
		}),
	logoutFromNextServerToServer: (sessionToken: string) =>
		http.post<MessageResType>(
			"/auth/logout",
			{},
			{
				headers: {
					Authorization: `Bearer ${sessionToken}`,
				},
			}
		),
	logoutFromNextClientToNextServer: (force = false, signal?: AbortSignal) =>
		http.post<MessageResType>(
			"/api/auth/logout",
			{
				force,
			},
			{
				baseUrl: "",
				signal,
			}
		),
	slideSessionFromNextServerToServer: (sessionToken: string) =>
		http.post<SlideSessionResType>(
			"/auth/slide-session",
			{},
			{
				headers: {
					Authorization: `Bearer ${sessionToken}`,
				},
			}
		),

	slideSessionFromNextClientToNextServer: (signal?: AbortSignal) =>
		http.post<SlideSessionResType>(
			"/api/auth/slide-session",
			{},
			{
				baseUrl: "",
				signal,
			}
		),
};

export default authApiRequest;
