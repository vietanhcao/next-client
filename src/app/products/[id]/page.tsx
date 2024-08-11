import React from "react";
import productApiRequest from "../../../apiRequest/api.product";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";


const getDetail = cache(productApiRequest.getDetail);


type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	let product = null;
	try {
		const id = params.id;
		const res = await getDetail(Number(id));
		product = res.payload.data;
	} catch (error) {
		console.log("🚀 ~ ProductDetailPage ~ error:", error);
	}

	// optionally access and extend (rather than replace) parent metadata
	// const previousImages = (await parent).openGraph?.images || [];

	return {
		title: product?.name,
		description: product?.description,
		// openGraph: {
		// 	images: ["/some-specific-page-image.jpg", ...previousImages],
		// },
	};
}

export default async function ProductDetailPage({
	params,
	searchParams,
}: Props) {
	let product = null;
	try {
		const id = params.id;
		const res = await getDetail(Number(id));
		product = res.payload.data;
	} catch (error) {
		console.log("🚀 ~ ProductDetailPage ~ error:", error);
		// handleErrorApi({ error });
	}

	if (!product) {
		return <div>Product not found</div>;
	}
	return (
		<div className="flex flex-col-reverse items-center">
			<Image
				src={product.image}
				alt={product.name}
				width={100}
				height={100}
				className="w-32 h-32 object-cover"
			/>
			<p>{product.name}</p>
			<p>{product.price}</p>
		</div>
	);
}
