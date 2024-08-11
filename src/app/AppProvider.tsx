"use client";
import { createContext, useContext, useState } from "react";
import { clientSessionToken } from "../lib/http";
import { AccountResType } from "../schemaValidations/account.schema";

type User = AccountResType["data"];

const AppContext = createContext<{
	user: User | null;
	setUser: (user: User | null) => void;
}>({
	user: null,
	setUser: () => {},
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
	initalSessionToken = "",
	user: userProp,
}: {
	children: React.ReactNode;
	initalSessionToken?: string;
	user: User | null;
}) {
	const [user, setUser] = useState(userProp);

	useState(() => {
		// set giá trị khi khởi tạo
		if (typeof window !== "undefined") {
			clientSessionToken.value = initalSessionToken;
		}
	});

	return (
		<AppContext.Provider
			value={{
				user,
				setUser,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
