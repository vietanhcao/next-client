import React from "react";
import productApiRequest from "../../../apiRequest/api.product";
import Image from "next/image";

export default async function ProductDetailPage({
	params,
}: {
	params: { id: string };
}) {
	let product = null;
	try {
		const id = params.id;
		const res = await productApiRequest.getDetail(Number(id));
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
