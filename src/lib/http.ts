import { redirect } from "next/navigation";
import envConfig from "../app/config";
import { LoginResType } from "../schemaValidations/auth.schema";
import { normalizePath } from "./utils";

type CustomOptions = Omit<RequestInit, "method"> & {
	baseUrl?: string;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPlayload = {
	message: string;
	errors: { field: string; message: string }[]; // format server trả về
};

export class HttpError extends Error {
	status: number;
	payload: {
		message: string;
		[key: string]: any;
	};
	constructor({ status, payload }: { status: number; payload: any }) {
		super("HTTP Error");
		this.status = status;
		this.payload = payload;
	}
}

export class EntityError extends HttpError {
	status: typeof ENTITY_ERROR_STATUS;
	payload: EntityErrorPlayload;
	constructor({
		status,
		payload,
	}: {
		status: typeof ENTITY_ERROR_STATUS;
		payload: EntityErrorPlayload;
	}) {
		super({ status, payload });
		if (status !== ENTITY_ERROR_STATUS) {
			throw new Error("EntityError must have status 422");
		}
		this.status = status;
		this.payload = payload;
	}
}

let clientLogoutRequest: Promise<Response> | null = null;

// nên dùng hàm vì mỗi lần khởi tạo request isClient sẽ có giá trị mới
export const isClient = () => typeof window !== "undefined";

const request = async <Response>(
	method: "GET" | "POST" | "PUT" | "DELETE",
	url: string,
	options?: CustomOptions
) => {
	let body: string | FormData | undefined = undefined;
	if (options?.body instanceof FormData) {
		body = options.body;
	} else if (options?.body) {
		body = JSON.stringify(options.body);
	}

	const baseHeader: {
		[key: string]: string;
	} = body instanceof FormData ? {} : { "Content-Type": "application/json" };

	if (isClient()) {
		const sessionToken = localStorage.getItem("sessionToken");
		if (sessionToken) {
			baseHeader.Authorization = `Bearer ${sessionToken}`;
		}
	}

	// Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào ""  thì đồng nghĩa với việc gọi đến Api Nextjs

	const baseUrl =
		options?.baseUrl === undefined
			? envConfig.NEXT_PUBLIC_API_URL
			: options.baseUrl;

	const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;

	const res = await fetch(fullUrl, {
		...options,
		method,
		headers: {
			...baseHeader,
			...options?.headers,
		},
		body,
	});

	const payload: Response = await res.json();

	const data = {
		status: res.status,
		payload,
	};

	if (!res.ok) {
		if (res.status === ENTITY_ERROR_STATUS) {
			throw new EntityError(
				data as {
					status: typeof ENTITY_ERROR_STATUS;
					payload: EntityErrorPlayload;
				}
			);
		}
		if (res.status === AUTHENTICATION_ERROR_STATUS) {
			if (isClient()) {
				// client side
				// chặn việc gọi nhiều lần logout
				if (!clientLogoutRequest) {
					// Xóa token khi logout ở client chỉ sử dụng function base ở interceptor
					// lúc này sẽ không còn clientSessionToken.value
					// call api logout server nextjs to remove cookie
					clientLogoutRequest = fetch("/api/auth/logout", {
						method: "POST",
						headers: {
							...baseHeader,
						},
						body: JSON.stringify({ force: true }),
					});

					try {
						await clientLogoutRequest;
					} catch (error) {
					} finally {
						localStorage.removeItem("sessionToken");
						localStorage.removeItem("sessionTokenExpiresAt");
						clientLogoutRequest = null;
						location.href = "/login";
					}
				}
			} else {
				// server side
				const sessionToken = (options?.headers as any)?.Authorization.split(
					"Bearer "
				)[1];

				redirect("/logout?sessionToken=" + sessionToken);
			}
		}
		throw new HttpError(data);
	}

	// đảm bảo url chạy ở client side
	if (isClient()) {
		if (
			["auth/login", "auth/register"].some(
				(item) => item === normalizePath(url)
			)
		) {
			const { token, expiresAt } = (payload as LoginResType).data;
			localStorage.setItem("sessionToken", token);
			localStorage.setItem("sessionTokenExpiresAt", expiresAt);
		}
		if ("auth/logout" === normalizePath(url)) {
			localStorage.removeItem("sessionToken");
			localStorage.removeItem("sessionTokenExpiresAt");
		}
	}

	return data;
};

const http = {
	get: <Response>(url: string, options?: Omit<CustomOptions, "body">) =>
		request<Response>("GET", url, options),
	post: <Response>(
		url: string,
		body: any,
		options?: Omit<CustomOptions, "body">
	) => request<Response>("POST", url, { ...options, body }),
	put: <Response>(
		url: string,
		body: any,
		options?: Omit<CustomOptions, "body">
	) => request<Response>("PUT", url, { ...options, body }),
	delete: <Response>(url: string, options?: Omit<CustomOptions, "body">) =>
		request<Response>("DELETE", url, options),
};

export default http;
