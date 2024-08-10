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
import { useState } from "react";
import { useToast } from "../../components/ui/use-toast";
import {
	AccountRes,
	AccountResType,
	UpdateMeBody,
	UpdateMeBodyType,
} from "../../schemaValidations/account.schema";
import accountApiRequest from "../../apiRequest/api.account";
import { handleErrorApi } from "../../lib/utils";

type ProfileFormProps = AccountResType["data"];

export default function ProfileForm({
	profile,
}: {
	profile: ProfileFormProps;
}) {
	const { toast } = useToast();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const form = useForm<UpdateMeBodyType>({
		resolver: zodResolver(UpdateMeBody),
		defaultValues: {
			name: profile.name,
		},
	});

	async function onSubmit(values: UpdateMeBodyType) {
		if (loading) return;
		try {
			setLoading(true);
			const res = await accountApiRequest.updateMe(values);

			toast({
				title: "Update successful",
			});
      router.refresh();
		} catch (error) {
			handleErrorApi({ error, setError: form.setError });
		} finally {
			setLoading(false);
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-2 max-w-[600px] w-full flex-shrink-0"
				noValidate
			>
				<FormLabel>Email</FormLabel>
				<FormControl>
					<Input value={profile.email} readOnly />
				</FormControl>
				<FormMessage />

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên</FormLabel>
							<FormControl>
								<Input {...field} type="text" />
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
