"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
	LoginBody,
	RegisterBody,
	LoginBodyType,
} from "../../../schemaValidations/auth.schema";
import envConfig from "../../config";
import { useToast } from "../../../components/ui/use-toast";

export default function LoginForm() {
	const { toast } = useToast();
	const form = useForm<LoginBodyType>({
		resolver: zodResolver(LoginBody),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: LoginBodyType) {
		try {
			const res = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/auth/login`, {
				method: "POST",
				body: JSON.stringify(values),
				headers: {
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				const payload = await res.json();
				const data = {
					status: res.status,
					payload,
				};
				if (!res.ok) {
					throw data;
				}

				return data;
			});
			console.log(res);
			toast({
				title: "Login successful",
			});
		} catch (error) {
			console.log("🚀 ~ onSubmit ~ error:", error);
			const { status, payload } = error as any;
			if (status === 422) {
				const errors: { field: any; message: string }[] = payload.errors;
				errors.forEach((error) => {
					form.setError(error.field, {
						type: "server",
						message: error.message,
					});
				});
			} else {
				toast({
					title: "Uh oh! Something went wrong.",
					variant: "destructive",
					description: payload.message,
				});
			}
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-2 max-w-[600px] w-full flex-shrink-0"
				noValidate
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full">
					Submit
				</Button>
			</form>
		</Form>
	);
}
