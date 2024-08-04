import React from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
	return (
		<div>
			<h4 className="text-2xl font-semibold text-center">Login Page</h4>
			<div className="flex justify-center">
				<LoginForm />
			</div>
		</div>
	);
}
