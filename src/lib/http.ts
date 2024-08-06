import envConfig from "../app/config";
import { LoginResType } from "../schemaValidations/auth.schema";
import { normalizePath } from "./utils";

type CustomOptions = Omit<RequestInit, "method"> & {
	baseUrl?: string;
};

const ENTITY_ERROR_STATUS = 422;

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
		if (res.status === ENTITY_ERROR_STATUS) {
			throw new EntityError(
				data as {
					status: typeof ENTITY_ERROR_STATUS;
					payload: EntityErrorPlayload;
				}
			);
		}
		throw new HttpError(data);
	}

	// đảm bảo url chạy ở client side
	if (typeof window !== "undefined") {
		if (
			["auth/login", "auth/register"].some(
				(item) => item === normalizePath(url)
			)
		) {
			clientSessionToken.value = (payload as LoginResType).data.token;
		}
		if ("auth/logout" === normalizePath(url)) {
			clientSessionToken.value = "";
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
