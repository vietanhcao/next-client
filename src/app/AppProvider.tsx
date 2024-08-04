"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext({
	sessionToken: "",
	setSessionToken: (token: string) => {},
});

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error("useAppContext must be used within a AppProvider");
	}
	return context;
};

export default function AppProvider({
	children,
	initalSessionToken = "",
}: {
	children: React.ReactNode;
	initalSessionToken?: string;
}) {
	const [sessionToken, setSessionToken] = useState(initalSessionToken);
	return (
		<AppContext.Provider value={{ sessionToken, setSessionToken }}>
			{children}
		</AppContext.Provider>
	);
}
