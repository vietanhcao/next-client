"use client";
import { createContext, useContext, useState } from "react";
import { AccountResType } from "../schemaValidations/account.schema";
import { isClient } from "../lib/http";

type User = AccountResType["data"];

const AppContext = createContext<{
	user: User | null;
	setUser: (user: User | null) => void;
	isAuthenticated: boolean;
}>({
	user: null,
	setUser: () => {},
	isAuthenticated: false,
});

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within AppProvider");
	}
	return context;
};

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUserState] = useState<User | null>(() => {
		// cần tìm hiêu thêm vế function dispatch setStateAction
		if (isClient()) {
			const user = localStorage.getItem("user");
			return user ? JSON.parse(user) : null;
		}
	});
	const isAuthenticated = Boolean(user);

	const setUser = (user: User | null) => {
		setUserState(user);
		if (isClient()) {
			if (user) {
				localStorage.setItem("user", JSON.stringify(user));
			} else {
				localStorage.removeItem("user");
			}
		}
	}

	return (
		<AppContext.Provider
			value={{
				user,
				setUser,
				isAuthenticated,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
