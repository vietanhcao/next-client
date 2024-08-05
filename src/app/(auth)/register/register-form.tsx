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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import authApiRequest from "../../../apiRequest/api.auth";
import { toast } from "../../../components/ui/use-toast";
import {
	RegisterBody,
	RegisterBodyType,
} from "../../../schemaValidations/auth.schema";

export default function RegisterForm() {
	const router = useRouter();
	const form = useForm<RegisterBodyType>({
		resolver: zodResolver(RegisterBody),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: RegisterBodyType) {
		try {
			const res = await authApiRequest.register(values);

			await authApiRequest.auth({
				sessionToken: res.payload.data.token,
			});

			router.push("/me");

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
					description: payload?.message,
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
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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

				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>ConfirmPassword</FormLabel>
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
