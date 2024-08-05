import envConfig from "../app/config";
import { LoginResType } from "../schemaValidations/auth.schema";

type CustomOptions = Omit<RequestInit, "method"> & {
	baseUrl?: string;
};

class HttpError extends Error {
	status: number;
	payload: any;
	constructor({ status, payload }: { status: number; payload: any }) {
		super("HTTP Error");
		this.status = status;
		this.payload = payload;
	}
}

// Chỉ sử dụng cở client
class SessionToken {
	private token = "";
	get value() {
		return this.token;
	}
	set value(token: string) {
		// check server side
		if (typeof window === "undefined") {
			throw new Error("Cannot set token on server side");
		}
		this.token = token;
	}
}

export const clientSessionToken = new SessionToken();

const request = async <Response>(
	method: "GET" | "POST" | "PUT" | "DELETE",
	url: string,
	options?: CustomOptions
) => {
	const body = options?.body ? JSON.stringify(options.body) : undefined;
	const baseHeader = {
		"Content-Type": "application/json",
		Authorization: clientSessionToken.value
			? `Bearer ${clientSessionToken.value}`
			: "",
	};

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
		throw new HttpError(data);
	}

	if (["/auth/login", "/auth/register"].includes(url)) {
		clientSessionToken.value = (payload as LoginResType).data.token;
	}
	if ("/auth/logout".includes(url)) {
		clientSessionToken.value = "";
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
