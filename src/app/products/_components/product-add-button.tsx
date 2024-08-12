"use client";

import Link from "next/link";
import React from "react";
import { isClient } from "../../../lib/http";

export default function ProductAddButton() {
	const isAuthenticated = isClient() && localStorage.getItem("sessionToken");
	if (!isAuthenticated) return null;

	return (
		<div>
			<Link href={"/products/add"}>Add Product</Link>
		</div>
	);
}
