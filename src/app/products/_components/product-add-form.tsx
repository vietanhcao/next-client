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
import { useToast } from "../../../components/ui/use-toast";
import { handleErrorApi } from "../../../lib/utils";
import { useRef, useState } from "react";
import {
	CreateProductBody,
	CreateProductBodyType,
	ProductResType,
	UpdateProductBodyType,
} from "../../../schemaValidations/product.schema";
import productApiRequest from "../../../apiRequest/api.product";
import { Textarea } from "../../../components/ui/textarea";
import Image from "next/image";

interface ProductAddFormProps {
	product?: ProductResType["data"];
}

export default function ProductAddForm({ product }: ProductAddFormProps) {
	const [file, setFile] = useState<File | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const form = useForm<CreateProductBodyType>({
		resolver: zodResolver(CreateProductBody),
		defaultValues: {
			name: product?.name || "",
			price: product?.price || 0,
			description: product?.description || "",
			image: product?.image || "",
		},
	});

	const image = form.watch("image");

	const createProduct = async (values: CreateProductBodyType) => {
		try {
			setLoading(true);
			const formData = new FormData();
			formData.append("file", file as Blob);
			const resUpload = await productApiRequest.uploadImage(formData);
			const imageUrl = resUpload.payload.data;

			const res = await productApiRequest.create({
				...values,
				image: imageUrl,
			});

			toast({
				title: "Create Product successful",
			});
			router.push("/products");
			router.refresh();
		} catch (error) {
			handleErrorApi({ error, setError: form.setError });
		} finally {
			setLoading(false);
		}
	};

	const updateProduct = async (values: UpdateProductBodyType) => {
		if (!product) return;
		try {
			setLoading(true);
			if (file) {
				const formData = new FormData();
				formData.append("file", file as Blob);
				const resUpload = await productApiRequest.uploadImage(formData);
				const imageUrl = resUpload.payload.data;
				values.image = imageUrl;
			}

			const res = await productApiRequest.update(product.id, {
				...values,
			});

			toast({
				title: "Update Product successful",
			});
			router.refresh();
		} catch (error) {
			handleErrorApi({ error, setError: form.setError });
		} finally {
			setLoading(false);
		}
	};

	async function onSubmit(values: CreateProductBodyType) {
		if (loading) return;
		if (product) {
			updateProduct(values);
		} else {
			createProduct(values);
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
								<Input type="text" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Giá</FormLabel>
							<FormControl>
								<Input type="number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mô tả</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Hình ảnh</FormLabel>
							<FormControl>
								<Input
									type="file"
									{...field}
									ref={inputRef}
									accept="image/*"
									value={undefined}
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											setFile(file);
											field.onChange("http://localhost:3000/" + file.name);
										}
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{(file || image) && (
					<div>
						<Image
							src={file ? URL.createObjectURL(file) : image}
							alt="preview"
							className="w-32 h-32 object-cover"
							width={200}
							height={200}
						/>
						<Button
							variant={"destructive"}
							size={"sm"}
							type="button"
							onClick={() => {
								setFile(null);
								form.setValue("image", "");
								if (inputRef?.current) {
									inputRef.current.value = "";
								}
							}}
						>
							Remove
						</Button>
					</div>
				)}

				<Button type="submit" className="w-full">
					Submit
				</Button>
			</form>
		</Form>
	);
}
