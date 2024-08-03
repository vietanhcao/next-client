"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../../components/ui/button";

export default function ButtonRedirect() {
	const router = useRouter();

	const handleNavigate = () => {
		router.push("/login");
	};
	return <Button onClick={handleNavigate}>Click me to login page</Button>;
}
